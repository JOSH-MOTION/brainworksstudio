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
    const body = await req.json();
    const { approved, featured, adminResponse } = body;

    console.log('Updating review:', { id, approved, featured, adminResponse });

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Check if review exists
    const reviewRef = adminDb.collection('reviews').doc(id);
    const reviewDoc = await reviewRef.get();
    
    if (!reviewDoc.exists) {
      console.error('Review not found:', id);
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Prepare update data
    const updateData: any = {
      updatedAt: new Date(),
    };

    // Only update fields that are provided
    if (typeof approved === 'boolean') {
      updateData.approved = approved;
      console.log('Setting approved to:', approved);
    }

    if (typeof featured === 'boolean') {
      updateData.featured = featured;
      console.log('Setting featured to:', featured);
    }

    if (typeof adminResponse === 'string') {
      updateData.adminResponse = adminResponse;
      console.log('Setting admin response');
    }

    // Update review
    await reviewRef.update(updateData);
    console.log('Review updated successfully:', id);

    // Fetch the updated review
    const updatedDoc = await reviewRef.get();
    const updatedData = updatedDoc.data();
    
    const updatedReview = {
      id,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
      updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || updatedData?.updatedAt,
    };

    return NextResponse.json(updatedReview, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error: any) {
    console.error('Error updating review:', error);
    return NextResponse.json({ 
      error: 'Failed to update review',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    if (!adminDb) {
      throw new Error('Firestore database is not initialized');
    }

    const { id } = params;

    console.log('Deleting review:', id);

    // Validate ID
    if (!id) {
      return NextResponse.json({ error: 'Review ID is required' }, { status: 400 });
    }

    // Check if review exists
    const reviewRef = adminDb.collection('reviews').doc(id);
    const reviewDoc = await reviewRef.get();
    
    if (!reviewDoc.exists) {
      console.error('Review not found:', id);
      return NextResponse.json({ error: 'Review not found' }, { status: 404 });
    }

    // Delete review
    await reviewRef.delete();
    console.log('Review deleted successfully:', id);
    
    return NextResponse.json({ 
      message: 'Review deleted successfully' 
    }, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return NextResponse.json({ 
      error: 'Failed to delete review',
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}