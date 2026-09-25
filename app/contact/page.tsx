import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Start a Project | Brain Works Studio Africa — Accra, Ghana',
  description:
    'Start a project with Brain Works Studio Africa in Accra — commercials, corporate films, live streaming, social content, events and photography. We reply within one business day.',
  keywords: [
    'contact photographer Accra',
    'book videographer Ghana',
    'photography studio contact Accra',
    'live streaming company contact Ghana',
    'photographer near me Accra',
    'book a photoshoot Ghana',
    'photographer Lapaz Accra',
    'photographer East Legon',
    'photographer Tema',
    'photographer Kasoa',
  ],
  alternates: { canonical: `${BASE_URL}/contact` },
  openGraph: {
    title: 'Start a Project with Brain Works Studio Africa',
    description:
      'Tell us about your commercial, corporate, live, social or event production in Accra, Ghana and across Africa.',
    url: `${BASE_URL}/contact`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Start a Project with Brain Works Studio Africa',
    description:
      'Tell us about your commercial, corporate, live, social or event production in Accra, Ghana and across Africa.',
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
