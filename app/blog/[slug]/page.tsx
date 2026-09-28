import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getBlogPostBySlug } from '@/lib/blog-server';
import BlogPostClient from './BlogPostClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

interface BlogPostPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    return {
      title: 'Post Not Found | Brain Works Studio Africa',
    };
  }

  const url = `${BASE_URL}/blog/${post.slug}`;
  const description = post.excerpt || post.title;

  const keywords = Array.from(
    new Set([
      post.category,
      ...(post.tags || []),
      'Brain Works Studio Africa blog',
      'photography Ghana',
      'videography Ghana',
    ].filter(Boolean))
  );

  return {
    title: `${post.title} | Brain Works Studio Africa`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description,
      url,
      siteName: 'Brain Works Studio Africa',
      type: 'article',
      images: [{ url: post.featuredImage || `${BASE_URL}/newlogo2.jpg` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description,
      images: [post.featuredImage || `${BASE_URL}/newlogo2.jpg`],
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getBlogPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.createdAt,
    dateModified: post.updatedAt || post.createdAt,
    author: {
      '@type': 'Person',
      name: post.author?.name || 'Brain Works Studio Africa',
    },
    publisher: {
      '@type': 'Organization',
      name: 'Brain Works Studio Africa',
      logo: {
        '@type': 'ImageObject',
        url: `${BASE_URL}/android-chrome-512x512.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${BASE_URL}/blog/${post.slug}`,
    },
  };

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Blog', item: `${BASE_URL}/blog` },
      { '@type': 'ListItem', position: 3, name: post.title, item: `${BASE_URL}/blog/${post.slug}` },
    ],
  };

  // Only emitted when the post actually has real, admin-authored FAQ entries —
  // never fabricated, since FAQPage schema requires genuine answers.
  const faqJsonLd = post.faq.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: post.faq.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: { '@type': 'Answer', text: item.answer },
        })),
      }
    : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}
      <BlogPostClient post={post} />
    </>
  );
}
