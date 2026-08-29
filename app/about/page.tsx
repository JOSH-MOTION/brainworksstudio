import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'About Us | Brain Works Studio Africa — Photography & Video Team in Accra, Ghana',
  description:
    'Meet the team behind Brain Works Studio Africa: founded in 2019 in Accra, Ghana, delivering photography, videography, live streaming, and creative production for 500+ clients across Africa.',
  keywords: [
    'Brain Works Studio Africa team',
    'photography studio Accra about',
    'creative studio Ghana founders',
    'professional photographers Accra',
    'cinematographers Ghana',
    'media production team Ghana',
    'photographer East Legon',
    'photographer Cantonments',
    'photographer Kumasi',
  ],
  alternates: { canonical: `${BASE_URL}/about` },
  openGraph: {
    title: 'About Brain Works Studio Africa',
    description:
      'Founded in 2019 in Accra, Ghana. Meet the photographers, cinematographers, and creatives behind Brain Works Studio Africa.',
    url: `${BASE_URL}/about`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Brain Works Studio Africa',
    description:
      'Founded in 2019 in Accra, Ghana. Meet the photographers, cinematographers, and creatives behind Brain Works Studio Africa.',
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
