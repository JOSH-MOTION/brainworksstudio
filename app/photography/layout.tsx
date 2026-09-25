import type { Metadata } from 'next';

const BASE_URL = 'https://brainworksstudioafrica.com';
const TITLE = 'Photography Portfolio in Accra, Ghana | Brain Works Studio Africa';
const DESCRIPTION =
  'Corporate, event, portrait, fashion and product photography by Brain Works Studio Africa — real work shot in Accra and across Ghana.';

// /photography/[category] pages override this with their own generateMetadata.
export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/photography` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/photography`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
};

export default function PhotographyLayout({ children }: { children: React.ReactNode }) {
  return children;
}
