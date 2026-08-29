import type { Metadata } from 'next';
import VideographyCategoryClient from './VideographyCategoryClient';
import { getCategoryLabel } from '@/lib/videography-categories';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

interface VideographyCategoryPageProps {
  params: { category: string };
}

export function generateMetadata({ params }: VideographyCategoryPageProps): Metadata {
  const { category } = params;
  const displayCategory = getCategoryLabel(category);
  const title = `${displayCategory} Videography in Accra, Ghana | Brain Works Studio Africa`;
  const description = `Browse our ${displayCategory.toLowerCase()} videography portfolio — real productions shot in Accra, Ghana by Brain Works Studio Africa.`;
  const url = `${BASE_URL}/videography/${category}`;

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
      images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [`${BASE_URL}/newlogo2.jpg`],
    },
  };
}

export default function VideographyCategoryPage({ params }: VideographyCategoryPageProps) {
  return <VideographyCategoryClient category={params.category} />;
}
