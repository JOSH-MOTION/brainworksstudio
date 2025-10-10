import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });

// --- FIX: Define BASE_URL and metadataBase to resolve absolute paths ---
const BASE_URL = 'https://brainworksstudioafrica.com';
// ---------------------------------------------------------------------

export const metadata: Metadata = {
  // --- ADDED: This resolves the 'metadataBase is not set' warning ---
  metadataBase: new URL(BASE_URL),
  // ------------------------------------------------------------------
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
    url: BASE_URL, // Using BASE_URL constant for consistency
    siteName: 'Brain Works Studio Africa',
    images: [
      {
        url: '/brain.jpeg', // Now correctly resolves as absolute URL
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
    images: ['/brain.jpeg'], // Now correctly resolves as absolute URL
  },
  other: {
    // ✅ CORRECTED: Use the meta name as the key and the verification token as the value.
    'google-site-verification': 'google7ba9027710f6a9e6',
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
