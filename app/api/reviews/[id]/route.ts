// app/api/reviews/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!adminDb) {
      throw new Error('Firestore database is not initialized');
    }

    const { id } = params;
    const { approved, adminResponse } = await req.json();

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Check if review exists
    const reviewRef = adminDb.collection('reviews').doc(id);
    const reviewDoc = await reviewRef.get();
    if (!reviewDoc.exists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: { approved?: boolean; adminResponse?: string; updatedAt: Date } = {
      updatedAt: new Date(),
    };
    if (typeof approved === 'boolean') {
      updateData.approved = approved;
    }
    if (typeof adminResponse === 'string') {
      updateData.adminResponse = adminResponse;
    }

    // Update review
    await reviewRef.update(updateData);
    const updatedReview = { id, ...reviewDoc.data(), ...updateData };

    return NextResponse.json(updatedReview, { status: 200 });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!adminDb) {
      throw new Error('Firestore database is not initialized');
    }

    const { id } = params;

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Check if review exists
    const reviewRef = adminDb.collection('reviews').doc(id);
    const reviewDoc = await reviewRef.get();
    if (!reviewDoc.exists) {
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Delete review
    await reviewRef.delete();
    return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
  }
}