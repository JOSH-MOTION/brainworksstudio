import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Brain Works Studio Africa – Professional Photography & Videography',
  description:
    'Brain Works Studio Africa offers professional photography and videography services for events, portraits, products, and commercial projects across Ghana and Africa.',
  keywords: [
    'Brain Works Studio Africa',
    'photography Ghana',
    'videography Ghana',
    'creative studio',
    'media production',
    'Brain works',
    'photo studio Accra',
  ],
  icons: {
    icon: '/brain.jpeg',
  },
  openGraph: {
    title: 'Brain Works Studio Africa',
    description:
      'Professional photography, videography, and storytelling across Ghana and Africa.',
    url: 'https://brainworksstudioafrica.com',
    siteName: 'Brain Works Studio Africa',
    images: [
      {
        url: '/brain.jpeg',
        width: 1200,
        height: 630,
        alt: 'Brain Works Studio Africa logo',
      },
    ],
    locale: 'en_GB',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Brain Works Studio Africa',
    description:
      'Photography, videography, and creative storytelling across Ghana and Africa.',
    images: ['/brain.jpeg'],
  },
  other: {
    // 👇 Replace this with your real Google Search Console code
    'google-site-verification': 'YOUR_VERIFICATION_CODE_HERE',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
