import { NextRequest, NextResponse } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const published = searchParams.get('published') === 'true';
    const slug = searchParams.get('slug');

    console.log('GET /api/blog called with:', { slug, published });

    if (!adminDb) {
      console.error('Firestore not initialized');
      return NextResponse.json({ error: 'Service unavailable: Firestore not initialized' }, { status: 503 });
    }

    let query = adminDb.collection('blog-posts');
    if (published) {
      query = query.where('published', '==', true);
    }
    if (slug) {
      query = query.where('slug', '==', slug).limit(1);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const posts = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || null,
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || null,
      };
    });

    console.log('Fetched posts:', posts.length, 'for slug:', slug || 'all');

    if (slug && posts.length === 0) {
      console.warn('No post found for slug:', slug);
      return NextResponse.json([], { status: 404 });
    }

    return NextResponse.json(posts, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching blog posts:', error.message, error.stack);
    return NextResponse.json({ error: `Failed to fetch blog posts: ${error.message}` }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb || !adminAuth) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service unavailable: Firebase Admin not initialized' }, { status: 503 });
    }

    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      console.error('No authorization header');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (!decodedToken) {
      console.error('Invalid token');
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      console.error('User not admin:', decodedToken.uid);
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await req.json();
    const slug = data.title
      ?.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '') || `post-${Date.now()}`;

    const blogPost = {
      ...data,
      slug,
      author: {
        name: userDoc.data()?.displayName || 'Admin',
        uid: decodedToken.uid,
      },
      views: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const docRef = await adminDb.collection('blog-posts').add(blogPost);
    console.log('Created post:', docRef.id);
    return NextResponse.json({ id: docRef.id, ...blogPost }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating blog post:', error.message, error.stack);
    return NextResponse.json({ error: `Failed to create blog post: ${error.message}` }, { status: 500 });
  }
}