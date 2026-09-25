import type { Metadata } from 'next';
import { getApprovedReviews } from '@/lib/reviews-server';
import { getPortfolioItems } from '@/lib/portfolio-server';
import HomePageClient from './HomePageClient';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

const TITLE = 'Brain Works Studio Africa | Creative Production Company in Accra, Ghana';
const DESCRIPTION =
  'African creative production company in Accra, Ghana producing commercials, corporate films, branded content, live broadcasts, events, photography and social-first video.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: BASE_URL },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: BASE_URL,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default async function Home() {
  const [reviews, portfolio] = await Promise.all([getApprovedReviews(), getPortfolioItems()]);
  // getPortfolioItems already sorts featured first.
  const selectedWork = portfolio.filter((item) => item.imageUrls.length > 0).slice(0, 6);
  return <HomePageClient initialReviews={reviews as any} selectedWork={selectedWork} />;
}
