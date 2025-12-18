// app/api/blog/track-view/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { slug } = await request.json();

    if (!slug) {
      return NextResponse.json({ error: 'Slug is required' }, { status: 400 });
    }
    
    // Find the blog post by slug
    const postsRef = adminDb?.collection('blog-posts');
    const snapshot = await postsRef?.where('slug', '==', slug).limit(1).get();

    if (!snapshot || snapshot.empty) {
      return NextResponse.json({ error: 'Post not found' }, { status: 404 });
    }

    const postDoc = snapshot.docs[0];
    const currentViews = postDoc.data().views || 0;

    // Increment views
    await postDoc.ref.update({
      views: currentViews + 1,
      lastViewed: new Date(),
    });

    return NextResponse.json({ 
      success: true, 
      views: currentViews + 1 
    });
  } catch (error) {
    console.error('Error tracking view:', error);
    return NextResponse.json(
      { error: 'Failed to track view' },
      { status: 500 }
    );
  }
}