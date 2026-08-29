import type { Metadata } from 'next';
import PhotographyCategoryClient from './PhotographyCategoryClient';
import { getCategoryLabel } from '@/lib/photography-categories';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

interface PhotographyCategoryPageProps {
  params: { category: string };
}

export function generateMetadata({ params }: PhotographyCategoryPageProps): Metadata {
  const { category } = params;
  const displayCategory = getCategoryLabel(category);
  const title = `${displayCategory} Photography in Accra, Ghana | Brain Works Studio Africa`;
  const description = `Browse our ${displayCategory.toLowerCase()} photography portfolio — real sessions shot in Accra, Ghana by Brain Works Studio Africa.`;
  const url = `${BASE_URL}/photography/${category}`;

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

export default function PhotographyCategoryPage({ params }: PhotographyCategoryPageProps) {
  return <PhotographyCategoryClient category={params.category} />;
}
