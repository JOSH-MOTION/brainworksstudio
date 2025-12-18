// app/api/blog/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published');
    const slug = searchParams.get('slug');
    const incrementView = searchParams.get('incrementView'); // New parameter to track views

    let query: any = adminDb?.collection('blog-posts');

    if (published === 'true') {
      query = query.where('published', '==', true);
    }

    if (slug) {
      query = query.where('slug', '==', slug);
      
      // If incrementView is true and we have a slug, increment the view count
      if (incrementView === 'true') {
        const snapshot = await query.limit(1).get();
        if (!snapshot.empty) {
          const postDoc = snapshot.docs[0];
          const currentViews = postDoc.data().views || 0;
          
          // Increment view count in background (don't await to avoid blocking response)
          postDoc.ref.update({
            views: currentViews + 1,
            lastViewed: new Date(),
          }).catch((err: Error) => console.error('Error updating views:', err));
        }
      }
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const posts = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ error: 'Failed to fetch blog posts' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth?.verifyIdToken(token);

    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userDoc = await adminDb?.collection('users').doc(decodedToken.uid).get();
    if (!userDoc?.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await req.json();
    const slug = data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const blogPost = {
      ...data,
      slug,
      author: {
        name: userDoc.data()?.displayName || 'Admin',
        uid: decodedToken.uid,
      },
      views: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb?.collection('blog-posts').add(blogPost);
    return NextResponse.json({ id: docRef?.id, ...blogPost }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error);
    return NextResponse.json({ error: 'Failed to create blog post' }, { status: 500 });
  }
}