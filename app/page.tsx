import type { Metadata } from 'next';
import { getApprovedReviews } from '@/lib/reviews-server';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Brain Works Studio Africa | Wedding & Event Photographer, Videographer in Accra, Ghana',
  description:
    'Professional wedding photography, corporate event coverage, portraits, live streaming, and cinematic videography in Accra, Ghana. Serving clients across Ghana and Africa — book Brain Works Studio Africa today.',
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: 'Brain Works Studio Africa | Wedding & Event Photographer, Videographer in Accra, Ghana',
    description:
      'Professional wedding photography, corporate event coverage, portraits, live streaming, and cinematic videography in Accra, Ghana and across Africa.',
    url: BASE_URL,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brain Works Studio Africa | Wedding & Event Photographer in Accra, Ghana',
    description:
      'Professional wedding photography, corporate event coverage, portraits, live streaming, and cinematic videography in Accra, Ghana and across Africa.',
  },
};

export default async function Home() {
  const reviews = await getApprovedReviews();
  return <HomePageClient initialReviews={reviews as any} />;
}
