import { adminDb } from '@/lib/firebase-admin';
import { DocumentData } from 'firebase-admin/firestore';

export interface ServerBlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: { name: string; uid?: string };
  category: string;
  tags: string[];
  createdAt: string;
  updatedAt?: string;
  views: number;
}

function normalizePost(id: string, data: DocumentData): ServerBlogPost {
  return {
    id,
    title: data.title || '',
    slug: data.slug || '',
    excerpt: data.excerpt || '',
    content: data.content || '',
    featuredImage: data.featuredImage || '',
    author: data.author || { name: 'Brain Works Studio Africa' },
    category: data.category || '',
    tags: data.tags || [],
    createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || undefined,
    views: data.views || 0,
  };
}

/**
 * Server-only fetch of published blog posts directly from Firestore, used so
 * the Blog listing page has real, crawlable content in its initial HTML.
 */
export async function getPublishedBlogPosts(): Promise<ServerBlogPost[]> {
  if (!adminDb) {
    console.error('getPublishedBlogPosts: Firebase Admin not initialized');
    return [];
  }

  try {
    const snapshot = await adminDb
      .collection('blog-posts')
      .where('published', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => normalizePost(doc.id, doc.data()));
  } catch (error) {
    console.error('getPublishedBlogPosts: Error fetching posts:', error);
    return [];
  }
}

/**
 * Server-only fetch of a single published post by slug, used for the blog
 * detail page's generateMetadata (unique per-post title/description/OG image)
 * and for server-rendering the article body itself.
 */
export async function getBlogPostBySlug(slug: string): Promise<ServerBlogPost | null> {
  if (!adminDb) {
    console.error('getBlogPostBySlug: Firebase Admin not initialized');
    return null;
  }

  try {
    const snapshot = await adminDb
      .collection('blog-posts')
      .where('slug', '==', slug)
      .where('published', '==', true)
      .limit(1)
      .get();

    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return normalizePost(doc.id, doc.data());
  } catch (error) {
    console.error('getBlogPostBySlug: Error fetching post:', error);
    return null;
  }
}

export async function getAllPublishedSlugs(): Promise<string[]> {
  if (!adminDb) return [];
  try {
    const snapshot = await adminDb.collection('blog-posts').where('published', '==', true).get();
    return snapshot.docs.map((doc) => doc.data().slug).filter(Boolean);
  } catch (error) {
    console.error('getAllPublishedSlugs: Error fetching slugs:', error);
    return [];
  }
}
