import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getPricingCategoryBySlug } from '@/lib/pricing-server';
import PricingCategoryClient from './PricingCategoryClient';
import { formatCategoryName } from '@/lib/pricing-format';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://brainworksstudioafrica.com';

interface PricingCategoryPageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PricingCategoryPageProps): Promise<Metadata> {
  const category = await getPricingCategoryBySlug(params.slug);

  if (!category) {
    return { title: 'Category Not Found | Brain Works Studio Africa' };
  }

  const url = `${BASE_URL}/pricing/${category.slug}`;
  // Display-friendly name (fixes ALL CAPS / typos typed in the admin panel).
  const name = formatCategoryName(category.name);
  const description =
    category.description || `${name} packages from Brain Works Studio Africa in Accra, Ghana.`;

  const keywords = [
    `${name} pricing Ghana`,
    `${name} packages Accra`,
    `${name} cost Ghana`,
    'photography pricing Accra',
    'videography pricing Ghana',
  ];

  return {
    title: `${name} Pricing | Brain Works Studio Africa`,
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      title: `${name} Pricing | Brain Works Studio Africa`,
      description,
      url,
      siteName: 'Brain Works Studio Africa',
      type: 'website',
      images: [{ url: category.imageUrl || `${BASE_URL}/newlogo2.jpg` }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} Pricing | Brain Works Studio Africa`,
      description,
      images: [category.imageUrl || `${BASE_URL}/newlogo2.jpg`],
    },
  };
}

export default async function PricingCategoryPage({ params }: PricingCategoryPageProps) {
  const category = await getPricingCategoryBySlug(params.slug);

  if (!category) {
    notFound();
  }

  return <PricingCategoryClient category={category as any} />;
}
