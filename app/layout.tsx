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
  icons: {
    icon: [
      { url: '/newlogo2.jpg', sizes: '16x16', type: 'image/jpeg' },
      { url: '/newlogo2.jpg', sizes: '32x32', type: 'image/jpeg' },
      { url: '/newlogo2.jpg', sizes: '48x48', type: 'image/jpeg' },
      { url: '/newlogo2.jpg', sizes: '192x192', type: 'image/jpeg' },
      { url: '/newlogo2.jpg', sizes: '512x512', type: 'image/jpeg' }
    ],
    apple: [
      { url: '/newlogo2.jpg', sizes: '180x180', type: 'image/jpeg' }
    ],
    shortcut: '/newlogo2.jpg',
  },
  openGraph: {
    title: 'Brain Works Studio Africa – Professional Photography & Videography',
    description:
      'Professional photography, videography, and storytelling across Ghana and Africa.',
    url: BASE_URL,
    siteName: 'Brain Works Studio Africa',
    images: [
      {
        url: `${BASE_URL}/newlogo2.jpg`,
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
    images: [`${BASE_URL}/newlogo2.jpg`],
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
        {/* Force favicon refresh with versioning */}
        <link rel="icon" type="image/jpeg" sizes="16x16" href="/newlogo2.jpg?v=2" />
        <link rel="icon" type="image/jpeg" sizes="32x32" href="/newlogo2.jpg?v=2" />
        <link rel="icon" type="image/jpeg" sizes="48x48" href="/newlogo2.jpg?v=2" />
        <link rel="apple-touch-icon" sizes="180x180" href="/newlogo2.jpg?v=2" />
        <link rel="shortcut icon" href="/newlogo2.jpg?v=2" />

        {/* Open Graph & Social Media Meta Tags */}
        <meta property="og:image" content={`${BASE_URL}/newlogo2.jpg?v=2`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/jpeg" />
        <meta name="twitter:image" content={`${BASE_URL}/newlogo2.jpg?v=2`} />

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
              logo: `${BASE_URL}/newlogo2.jpg`,
              image: `${BASE_URL}/newlogo2.jpg`,
              sameAs: [
                "https://www.instagram.com/brainworks_studio_africa",
                "https://www.facebook.com/brainworksstudioafrica",
                "https://x.com/bws_africa",
                "https://www.linkedin.com/in/brain-works-studio-africa-06491b381",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                contactType: "Customer Service",
                availableLanguage: ["English"]
              }
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