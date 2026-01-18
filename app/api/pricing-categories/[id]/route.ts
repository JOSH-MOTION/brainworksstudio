// app/api/pricing-categories/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const doc = await adminDb.collection('pricing-categories').doc(params.id).get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    const data = doc.data();
    const category = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt,
      packages: (data?.packages || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
    };

    return NextResponse.json(category, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ error: 'Failed to fetch category' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
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

    // Check if category exists
    const categoryRef = adminDb.collection('pricing-categories').doc(params.id);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    // If slug is being updated, check for duplicates
    if (data.slug && data.slug !== categoryDoc.data()?.slug) {
      const existingCategory = await adminDb
        .collection('pricing-categories')
        .where('slug', '==', data.slug)
        .limit(1)
        .get();

      if (!existingCategory.empty && existingCategory.docs[0].id !== params.id) {
        return NextResponse.json({ error: 'A category with this slug already exists' }, { status: 400 });
      }
    }

    const updateData = {
      ...data,
      updatedAt: new Date(),
    };

    // Remove fields that shouldn't be updated this way
    delete updateData.id;
    delete updateData.createdAt;
    delete updateData.createdBy;

    await categoryRef.update(updateData);

    const updatedDoc = await categoryRef.get();
    const updatedData = updatedDoc.data();

    return NextResponse.json({
      id: updatedDoc.id,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
      updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || updatedData?.updatedAt,
    }, { status: 200 });
  } catch (error: any) {
    console.error('Error updating category:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

    const categoryRef = adminDb.collection('pricing-categories').doc(params.id);
    const categoryDoc = await categoryRef.get();

    if (!categoryDoc.exists) {
      return NextResponse.json({ error: 'Category not found' }, { status: 404 });
    }

    await categoryRef.delete();

    return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}