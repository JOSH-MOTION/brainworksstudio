import type { Metadata } from 'next';
import { getPortfolioItems } from '@/lib/portfolio-server';
import PortfolioPageClient from './PortfolioPageClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Portfolio | Wedding, Event & Commercial Photography in Accra, Ghana | Brain Works Studio Africa',
  description:
    'Browse real photography and videography work by Brain Works Studio Africa: weddings, events, portraits, product shoots, and commercial campaigns shot in Accra, Ghana and across Africa.',
  keywords: [
    'photography portfolio Ghana',
    'wedding photography Accra examples',
    'event photography portfolio Ghana',
    'videography portfolio Accra',
    'product photography examples Ghana',
    'commercial photography portfolio Africa',
    'real Ghanaian wedding photos',
    'corporate video production examples Ghana',
  ],
  alternates: { canonical: `${BASE_URL}/portfolio` },
  openGraph: {
    title: 'Portfolio | Brain Works Studio Africa',
    description:
      'Real photography and videography work from weddings, events, portraits, and commercial shoots across Ghana and Africa.',
    url: `${BASE_URL}/portfolio`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Portfolio | Brain Works Studio Africa',
    description:
      'Real photography and videography work from weddings, events, portraits, and commercial shoots across Ghana and Africa.',
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default async function PortfolioPage() {
  const items = await getPortfolioItems();

  const itemListJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Brain Works Studio Africa Portfolio',
    url: `${BASE_URL}/portfolio`,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: items.slice(0, 24).map((item, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: `${BASE_URL}/portfolio/${item.id}`,
        name: item.title,
        image: item.imageUrls?.[0] || undefined,
      })),
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
      />
      <PortfolioPageClient initialItems={items} />
    </>
  );
}
