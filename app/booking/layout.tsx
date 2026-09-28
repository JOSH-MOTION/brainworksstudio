import type { Metadata } from 'next';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Book a Session | Brain Works Studio Africa',
  description:
    'Book a photography, videography or live streaming session with Brain Works Studio Africa in Accra, Ghana. Choose your date and we confirm within 24 hours.',
  alternates: { canonical: `${BASE_URL}/booking` },
};

export default function BookingLayout({ children }: { children: React.ReactNode }) {
  return children;
}
