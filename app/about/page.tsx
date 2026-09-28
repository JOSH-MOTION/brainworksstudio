import type { Metadata } from 'next';
import AboutPageClient from './AboutPageClient';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'About Us | Brain Works Studio Africa — Creative Production Company in Accra, Ghana',
  description:
    'Brain Works Studio Africa is an African creative production company founded in 2019 in Accra, Ghana — producing commercials, corporate films, live broadcasts, events, photography and social content.',
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
      'Founded in 2019 in Accra, Ghana. Meet the creative production team behind Brain Works Studio Africa.',
    url: `${BASE_URL}/about`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Brain Works Studio Africa',
    description:
      'Founded in 2019 in Accra, Ghana. Meet the creative production team behind Brain Works Studio Africa.',
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default function AboutPage() {
  return <AboutPageClient />;
}
