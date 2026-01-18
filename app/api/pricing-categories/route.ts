// app/api/pricing-categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin DB not initialized');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const { searchParams } = new URL(req.url);
    const publishedOnly = searchParams.get('published') === 'true';

    console.log('Fetching pricing categories, publishedOnly:', publishedOnly);

    let snapshot;
    
    try {
      // Try with both filters (requires Firestore index)
      if (publishedOnly) {
        snapshot = await adminDb
          .collection('pricing-categories')
          .where('published', '==', true)
          .orderBy('order', 'asc')
          .get();
      } else {
        snapshot = await adminDb
          .collection('pricing-categories')
          .orderBy('order', 'asc')
          .get();
      }
    } catch (indexError: any) {
      console.log('Firestore index not found, fetching all and filtering in memory');
      
      // Fallback: Fetch all and filter in memory
      const allDocs = await adminDb
        .collection('pricing-categories')
        .get();
      
      let docs = allDocs.docs;
      
      if (publishedOnly) {
        docs = docs.filter(doc => doc.data().published === true);
      }
      
      // Sort by order in memory
      docs.sort((a, b) => {
        const orderA = a.data().order || 0;
        const orderB = b.data().order || 0;
        return orderA - orderB;
      });
      
      snapshot = { docs };
    }
    
    const categories = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.()?.toISOString() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.()?.toISOString() || doc.data().updatedAt,
      packages: (doc.data().packages || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
    }));

    console.log(`Found ${categories.length} categories`);
    return NextResponse.json(categories, { status: 200 });
    
  } catch (error: any) {
    console.error('Error fetching pricing categories:', error);
    console.error('Error details:', {
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    return NextResponse.json({ 
      error: 'Failed to fetch categories',
      details: error.message 
    }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await req.json();
    
    if (!data.name || !data.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const existingCategory = await adminDb
      .collection('pricing-categories')
      .where('slug', '==', data.slug)
      .limit(1)
      .get();

    if (!existingCategory.empty) {
      return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 });
    }

    const category = {
      name: data.name,
      slug: data.slug,
      description: data.description || '',
      longDescription: data.longDescription || '',
      imageUrl: data.imageUrl || '',
      published: data.published !== undefined ? data.published : true,
      order: data.order || 0,
      packages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: decodedToken.uid,
    };

    const docRef = await adminDb.collection('pricing-categories').add(category);

    return NextResponse.json({ 
      id: docRef.id, 
      ...category,
      createdAt: category.createdAt.toISOString(),
      updatedAt: category.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating pricing category:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}