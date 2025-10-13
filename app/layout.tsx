import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/hooks/useAuth';

const inter = Inter({ subsets: ['latin'] });

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
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
  icons: { icon: '/brain.jpeg' },
  openGraph: {
    title: 'Brain Works Studio Africa',
    description:
      'Professional photography, videography, and storytelling across Ghana and Africa.',
    url: BASE_URL,
    siteName: 'Brain Works Studio Africa',
    images: [
      {
        url: `${BASE_URL}/brain.jpeg`,
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
    images: [`${BASE_URL}/brain.jpeg`],
  },
  other: {
    'google-site-verification': 'google7ba9027710f6a9e6',
    'google-adsense-account': 'ca-pub-3845871149646341',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* ✅ Google AdSense Script */}
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-3845871149646341"
          crossOrigin="anonymous"
        />

        {/* ✅ Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Brain Works Studio Africa",
              url: BASE_URL,
              logo: `${BASE_URL}/brain.jpeg`,
              sameAs: [
                "https://www.instagram.com/brainworksstudioafrica",
                "https://www.facebook.com/brainworksstudioafrica",
              ],
            }),
          }}
        />

        <meta
          name="google-adsense-account"
          content="ca-pub-3845871149646341"
        />
      </head>
      <body className={inter.className}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
