import type { Metadata } from 'next';
import PodcastBriefPageClient from './PodcastBriefPageClient';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Podcast Shoot Brief | Brain Works Studio Africa — Accra, Ghana',
  description:
    'Tell us about your podcast — concept, format, production needs, and budget — so Brain Works Studio Africa can tailor the setup, team and quote.',
  alternates: { canonical: `${BASE_URL}/podcast-brief` },
  robots: { index: false, follow: true },
  openGraph: {
    title: 'Podcast Shoot Brief | Brain Works Studio Africa',
    description: 'Fill this in so we can tailor the setup, team and budget for your podcast shoot.',
    url: `${BASE_URL}/podcast-brief`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
  },
};

export default function PodcastBriefPage() {
  return <PodcastBriefPageClient />;
}
