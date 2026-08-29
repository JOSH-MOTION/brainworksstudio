import './globals.css';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import { Suspense } from 'react';
import { AuthProvider } from '@/hooks/useAuth';
import VercelAnalytics from "@/components/VercelAnalytics";
import { getApprovedReviews } from '@/lib/reviews-server';

const inter = Inter({ subsets: ['latin'] });
const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: 'Brain Works Studio Africa | Wedding & Event Photographer, Videographer in Accra, Ghana',
  description:
    'Brain Works Studio Africa offers professional wedding photography, corporate event coverage, portraits, live streaming, and cinematic videography in Accra, Ghana and across Africa.',
  keywords: [
    'Brain Works Studio Africa',
    'BWSA',
    // Core local
    'photography Ghana',
    'photographer Accra',
    'photography studio Accra',
    'best photographer in Accra',
    'videography Ghana',
    'videographer Accra',
    'video production company Ghana',
    'creative studio Accra',
    'media production company Ghana',
    // Occasion-specific
    'wedding photographer Accra',
    'wedding photography Ghana',
    'traditional wedding photography Ghana',
    'engagement photoshoot Accra',
    'event photographer Ghana',
    'corporate event photographer Ghana',
    'portrait photographer Accra',
    'graduation photography Ghana',
    'product photography Ghana',
    'commercial photographer Ghana',
    'fashion photographer Ghana',
    'real estate photography Ghana',
    'drone photography Ghana',
    'aerial photography Ghana',
    'wedding videographer Ghana',
    'event videographer Accra',
    // Corporate & specialty
    'corporate event photographer Accra',
    'corporate dinner photographer Ghana',
    'corporate photoshoot Ghana',
    'corporate videographer Accra',
    'documentary filmmaker Ghana',
    'music video production Ghana',
    'corporate training video Ghana',
    // Design & content
    'graphic design Accra',
    'branding agency Ghana',
    'motion graphics Ghana',
    'animation studio Accra',
    'social media content creation Ghana',
    'photo editing services Ghana',
    'video editing services Accra',
    'podcast production Ghana',
    'album design Ghana',
    // Live streaming
    'live streaming services Ghana',
    'live streaming company Accra',
    'church live streaming Ghana',
    'conference live streaming Accra',
    'hybrid event production Ghana',
    // Voiceover & ads
    'voice over artist Ghana',
    'voice over services Africa',
    'ad production Ghana',
    'commercial video production Ghana',
    'brand campaign video Ghana',
    // Pan-African
    'photography studio Africa',
    'videography company Africa',
    'destination wedding photographer Africa',
    'media production company West Africa',
    'diaspora wedding photographer Ghana',
    // Near-me / intent
    'photographers near me Accra',
    'videographers near me Ghana',
    'affordable photographer Accra',
    // Accra neighborhoods
    'photographer East Legon',
    'wedding photographer East Legon',
    'event photographer Cantonments',
    'photographer Airport Residential Area',
    'photographer Osu Accra',
    'photographer Labone',
    'photographer Dzorwulu',
    'photographer Roman Ridge',
    'photographer Ridge Accra',
    'photographer Kaneshie',
    'photographer Dansoman',
    'photographer Achimota',
    'photographer Madina',
    'photographer Adenta',
    'photographer Spintex',
    'photographer Tema',
    'photographer Teshie',
    'photographer Labadi',
    'videographer East Legon',
    'photo studio Lapaz Accra',
    // Other Ghana cities
    'photographer Kumasi',
    'photographer Takoradi',
    'photographer Cape Coast',
    'photographer Tamale',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    shortcut: '/favicon.ico',
  },
  openGraph: {
    title: 'Brain Works Studio Africa | Wedding & Event Photographer, Videographer in Accra, Ghana',
    description:
      'Professional wedding photography, event coverage, and cinematic videography in Accra, Ghana and across Africa.',
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

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const reviews = await getApprovedReviews();
  const ratedReviews = reviews.filter((r) => typeof r.rating === 'number' && r.rating > 0);
  const aggregateRating =
    ratedReviews.length > 0
      ? {
          "@type": "AggregateRating",
          ratingValue: (
            ratedReviews.reduce((sum, r) => sum + r.rating, 0) / ratedReviews.length
          ).toFixed(1),
          reviewCount: ratedReviews.length,
          bestRating: 5,
          worstRating: 1,
        }
      : undefined;

  return (
    <html lang="en">
      <head>
        {/* Favicon Package - All sizes for maximum compatibility */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/site.webmanifest" />

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
              "@type": ["LocalBusiness", "ProfessionalService"],
              "@id": `${BASE_URL}/#business`,
              name: "Brain Works Studio Africa",
              alternateName: "BWSA",
              description:
                'Professional photography, videography, live streaming, voiceover, and ad production studio based in Accra, Ghana, serving clients across Africa and the diaspora.',
              url: BASE_URL,
              logo: `${BASE_URL}/android-chrome-512x512.png`,
              image: `${BASE_URL}/android-chrome-512x512.png`,
              telephone: "+233242403450",
              email: "brainworksstudio2@gmail.com",
              priceRange: "₵₵",
              ...(aggregateRating ? { aggregateRating } : {}),
              address: {
                "@type": "PostalAddress",
                streetAddress: "Lapaz",
                addressLocality: "Accra",
                addressRegion: "Greater Accra",
                addressCountry: "GH",
              },
              areaServed: [
                { "@type": "AdministrativeArea", name: "Greater Accra Region" },
                { "@type": "Place", name: "Accra" },
                { "@type": "Place", name: "Lapaz" },
                { "@type": "Place", name: "East Legon" },
                { "@type": "Place", name: "West Legon" },
                { "@type": "Place", name: "Legon" },
                { "@type": "Place", name: "Cantonments" },
                { "@type": "Place", name: "Airport Residential Area" },
                { "@type": "Place", name: "Osu" },
                { "@type": "Place", name: "Labone" },
                { "@type": "Place", name: "Dzorwulu" },
                { "@type": "Place", name: "Roman Ridge" },
                { "@type": "Place", name: "Abelemkpe" },
                { "@type": "Place", name: "Ridge" },
                { "@type": "Place", name: "North Ridge" },
                { "@type": "Place", name: "Kaneshie" },
                { "@type": "Place", name: "Dansoman" },
                { "@type": "Place", name: "Odorkor" },
                { "@type": "Place", name: "Abossey Okai" },
                { "@type": "Place", name: "Achimota" },
                { "@type": "Place", name: "Abeka" },
                { "@type": "Place", name: "Tesano" },
                { "@type": "Place", name: "Dome" },
                { "@type": "Place", name: "Taifa" },
                { "@type": "Place", name: "Madina" },
                { "@type": "Place", name: "Adenta" },
                { "@type": "Place", name: "Haatso" },
                { "@type": "Place", name: "Ashongman" },
                { "@type": "Place", name: "Spintex" },
                { "@type": "Place", name: "Sakumono" },
                { "@type": "Place", name: "Tema" },
                { "@type": "Place", name: "Nungua" },
                { "@type": "Place", name: "Teshie" },
                { "@type": "Place", name: "La" },
                { "@type": "Place", name: "Labadi" },
                { "@type": "Place", name: "Accra Central" },
                { "@type": "Place", name: "Circle" },
                { "@type": "Place", name: "McCarthy Hill" },
                { "@type": "Place", name: "Weija" },
                { "@type": "Place", name: "Ablekuma" },
                { "@type": "Place", name: "Darkuman" },
                { "@type": "Place", name: "Awoshie" },
                { "@type": "Place", name: "Kasoa" },
                { "@type": "Place", name: "Kumasi" },
                { "@type": "Place", name: "Takoradi" },
                { "@type": "Place", name: "Cape Coast" },
                { "@type": "Place", name: "Tamale" },
                { "@type": "Place", name: "Koforidua" },
                { "@type": "Place", name: "Ho" },
                { "@type": "Country", name: "Ghana" },
                { "@type": "Place", name: "Africa" },
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
                  opens: "09:00",
                  closes: "18:00",
                },
              ],
              sameAs: [
                "https://www.instagram.com/brainworks_studio_africa",
                "https://www.facebook.com/share/17AbCs7VRQ/",
                "https://x.com/bws_africa",
                "https://www.linkedin.com/in/brain-works-studio-africa-06491b381",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+233242403450",
                contactType: "Customer Service",
                areaServed: "GH",
                availableLanguage: ["English"]
              },
              makesOffer: [
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Event Photography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate Event Photography & Dinners" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding Photography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Portrait Sessions" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Product Photography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Commercial Photography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Real Estate Photography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Fashion Photography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aerial & Drone Photography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Video Production" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Wedding Films" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Documentary Filmmaking" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Music Video Production" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Corporate & Training Videos" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Aerial & Drone Videography" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Live Streaming" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Voiceover Services" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Ad Production" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Graphic Design & Branding" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Motion Graphics & Animation" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Social Media Content Creation" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Photo & Video Editing" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Podcast Production" } },
                { "@type": "Offer", itemOffered: { "@type": "Service", name: "Album & Photo Book Design" } },
              ],
            }),
          }}
        />

        <meta
          name="google-adsense-account"
          content="ca-pub-3845871149646341"
        />
      </head>
      <body className={`${inter.className} ${playfair.variable}`}>
        <AuthProvider>{children}</AuthProvider>
        
            <VercelAnalytics />
       
      </body>
    </html>
  );
}