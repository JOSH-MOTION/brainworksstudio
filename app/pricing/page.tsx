import type { Metadata } from 'next';
import { getPublishedPricingCategories } from '@/lib/pricing-server';
import PricingPageClient from './PricingPageClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Pricing | Photography, Videography & Live Streaming Packages | Brain Works Studio Africa',
  description:
    'Transparent pricing for photography, videography, live streaming, and event coverage packages from Brain Works Studio Africa in Accra, Ghana.',
  keywords: [
    'photography prices Ghana',
    'videography prices Accra',
    'wedding photography cost Ghana',
    'event photography packages Ghana',
    'live streaming pricing Ghana',
    'photographer rates Accra',
    'affordable photography packages Ghana',
  ],
  alternates: { canonical: `${BASE_URL}/pricing` },
  openGraph: {
    title: 'Pricing | Brain Works Studio Africa',
    description:
      'Transparent pricing for photography, videography, and live streaming packages in Accra, Ghana.',
    url: `${BASE_URL}/pricing`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pricing | Brain Works Studio Africa',
    description:
      'Transparent pricing for photography, videography, and live streaming packages in Accra, Ghana.',
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default async function PricingPage() {
  const categories = await getPublishedPricingCategories();
  return <PricingPageClient initialCategories={categories as any} />;
}
