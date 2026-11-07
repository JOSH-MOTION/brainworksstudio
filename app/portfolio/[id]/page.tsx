import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPortfolioItemById, getPortfolioItems } from '@/lib/portfolio-server';
import PortfolioDetailClient from './PortfolioDetailClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

interface PortfolioDetailPageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PortfolioDetailPageProps): Promise<Metadata> {
  const item = await getPortfolioItemById(params.id);

  if (!item) {
    return { title: 'Portfolio Item Not Found | Brain Works Studio Africa' };
  }

  const serviceLabel = item.type === 'photography' ? 'Photography' : 'Videography';
  const title = `${item.title} — ${item.category} ${serviceLabel} in Accra, Ghana | Brain Works Studio Africa`;
  const description =
    item.caption ||
    `${item.title}: a ${item.category.toLowerCase()} ${serviceLabel.toLowerCase()} project by Brain Works Studio Africa, shot in Accra, Ghana.`;
  const url = `${BASE_URL}/portfolio/${item.id}`;
  const image = item.imageUrls[0] || `${BASE_URL}/newlogo2.jpg`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'Brain Works Studio Africa',
      type: 'website',
      images: [{ url: image, width: 1200, height: 630, alt: item.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  };
}

export default async function PortfolioDetailPage({ params }: PortfolioDetailPageProps) {
  const item = await getPortfolioItemById(params.id);

  if (!item) {
    notFound();
  }

  // Real related work only — same category first, falling back to same type,
  // so a project never sits with nothing to suggest next.
  const allItems = await getPortfolioItems();
  const sameCategory = allItems.filter((i) => i.id !== item.id && i.category === item.category);
  const sameType = allItems.filter((i) => i.id !== item.id && i.type === item.type && i.category !== item.category);
  const relatedItems = [...sameCategory, ...sameType].slice(0, 4);

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Portfolio', item: `${BASE_URL}/portfolio` },
      { '@type': 'ListItem', position: 3, name: item.title, item: `${BASE_URL}/portfolio/${item.id}` },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {/* Pass the item so the project renders server-side (item has hasPin, never the PIN). */}
      <PortfolioDetailClient id={params.id} initialItem={item} relatedItems={relatedItems} />
    </>
  );
}
