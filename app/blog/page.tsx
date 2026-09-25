import type { Metadata } from 'next';
import { getPublishedBlogPosts } from '@/lib/blog-server';
import BlogPageClient from './BlogPageClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Insights | Production, Video & Photography Guides, Ghana | Brain Works Studio Africa',
  description:
    'Guides, stories and behind-the-scenes insights on commercial and corporate production, live streaming, photography and visual storytelling from Brain Works Studio Africa in Accra, Ghana.',
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
    title: 'Insights | Brain Works Studio Africa',
    description:
      'Guides and behind-the-scenes insights on production, live streaming and photography from Brain Works Studio Africa.',
    url: `${BASE_URL}/blog`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights | Brain Works Studio Africa',
    description:
      'Guides and behind-the-scenes insights on production, live streaming and photography from Brain Works Studio Africa.',
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts();
  return <BlogPageClient initialPosts={posts} />;
}
