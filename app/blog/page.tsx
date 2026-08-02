import type { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/lib/blog-server';
import BlogPageClient from './BlogPageClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Blog | Photography & Videography Tips, Ghana | Brain Works Studio Africa',
  description:
    'Stories, tips, and behind-the-scenes insights on photography, videography, live streaming, and visual storytelling from Brain Works Studio Africa in Accra, Ghana.',
  keywords: [
    'photography tips Ghana',
    'wedding photography cost Ghana',
    'videography tips Accra',
    'live streaming guide Ghana',
    'how to choose a photographer in Ghana',
    'how to choose a videographer in Ghana',
    'voice over vs on camera talent',
    'event planning tips Ghana',
  ],
  alternates: { canonical: `${BASE_URL}/blog` },
  openGraph: {
    title: 'Blog | Brain Works Studio Africa',
    description:
      'Stories, tips, and behind-the-scenes insights on photography, videography, and live streaming from Brain Works Studio Africa.',
    url: `${BASE_URL}/blog`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Blog | Brain Works Studio Africa',
    description:
      'Stories, tips, and behind-the-scenes insights on photography, videography, and live streaming from Brain Works Studio Africa.',
  },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return <BlogPageClient initialPosts={posts} />;
}
