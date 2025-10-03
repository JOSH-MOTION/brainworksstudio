// app/api/portfolio/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { uploadToImageKit } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';

export async function GET() {
  console.log('GET /api/portfolio: Starting request');
  try {
    if (!adminDb) {
      console.error('GET /api/portfolio: Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    console.log('GET /api/portfolio: Querying portfolio collection');
    const portfolioSnapshot = await adminDb.collection('portfolio')
      .orderBy('createdAt', 'desc')
      .get();

    console.log(`GET /api/portfolio: Found ${portfolioSnapshot.size} items`);
    const portfolioItems = portfolioSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title,
        category: data.category,
        tags: data.tags || [],
        imageUrls: data.imageUrls || [], // Handle array of image URLs
        videoUrl: data.videoUrl || null,
        caption: data.caption || null,
        clientName: data.clientName || null,
        featured: data.featured || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt,
        createdBy: data.createdBy,
        clientId: data.clientId || null,
      };
    });

    // Sort featured items first in memory
    portfolioItems.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));

    console.log(`GET /api/portfolio: Returning ${portfolioItems.length} items`);
    return NextResponse.json(portfolioItems, {
      headers: {
        'Cache-Control': 'public, max-age=60, stale-while-revalidate=300',
      },
    });
  } catch (error: any) {
    console.error('GET /api/portfolio: Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items', debug: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!adminAuth || !adminDb) {
      console.error('POST /api/portfolio: Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('POST /api/portfolio: Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const caption = formData.get('caption') as string;
    const clientName = formData.get('clientName') as string;
    const featured = formData.get('featured') === 'true';
    const clientId = formData.get('clientId') as string | null;
    const files = formData.getAll('files') as File[];

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }
    if (!files || files.length === 0) {
      return NextResponse.json({ error: 'At least one image is required' }, { status: 400 });
    }

    // Upload images to ImageKit
    const imageUrls: string[] = [];
    for (const file of files) {
      const result = await uploadToImageKit(file, file.name);
      imageUrls.push(result.url);
    }

    const portfolioItem = {
      title: title.trim(),
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : [],
      imageUrls,
      videoUrl: null, // Not used in this context
      caption: caption?.trim() || null,
      clientName: clientName?.trim() || null,
      featured: Boolean(featured),
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: decodedToken.uid,
      clientId: clientId || null,
    };

    const docRef = await adminDb.collection('portfolio').add(portfolioItem);
    const createdDoc = await docRef.get();
    const createdData = createdDoc.data();
    const createdItem = {
      id: createdDoc.id,
      ...createdData,
      createdAt: createdData?.createdAt?.toDate?.()?.toISOString() || createdData?.createdAt,
      updatedAt: createdData?.updatedAt?.toDate?.()?.toISOString() || createdData?.updatedAt,
    };

    console.log('POST /api/portfolio: Portfolio item created successfully:', createdDoc.id);
    return NextResponse.json(createdItem, { status: 201 });
  } catch (error: any) {
    console.error('POST /api/portfolio: Error creating portfolio item:', error);
    return NextResponse.json({ error: 'Failed to create portfolio item', debug: error.message }, { status: 500 });
  }
}