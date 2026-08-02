import type { Metadata } from 'next';
import ContactPageClient from './ContactPageClient';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Contact Us | Brain Works Studio Africa — Accra, Ghana',
  description:
    'Get in touch with Brain Works Studio Africa in Accra, Lapaz. Book photography, videography, live streaming, or ad production — response within 24 hours.',
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
    title: 'Contact Brain Works Studio Africa',
    description:
      'Get in touch to book photography, videography, live streaming, or ad production in Accra, Ghana and across Africa.',
    url: `${BASE_URL}/contact`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Brain Works Studio Africa',
    description:
      'Get in touch to book photography, videography, live streaming, or ad production in Accra, Ghana and across Africa.',
  },
};

export default function ContactPage() {
  return <ContactPageClient />;
}
