import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { SERVICES } from '@/lib/services-config';
import { SERVICE_PILLARS } from '@/lib/site-config';
import ImageCard from '@/components/ImageCard';

const BASE_URL = 'https://brainworksstudioafrica.com';

const TITLE = 'Creative Production Services in Accra, Ghana | Brain Works Studio Africa';
const DESCRIPTION =
  'Commercial, corporate, social content, live streaming, events, photography, post-production and creative design — produced by Brain Works Studio Africa in Accra, Ghana.';

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: `${BASE_URL}/services` },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${BASE_URL}/services`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: TITLE,
    description: DESCRIPTION,
    images: [`${BASE_URL}/newlogo2.jpg`],
  },
};

export default function ServicesHubPage() {
  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
    ],
  };

  return (
    <Layout>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <section className="relative flex min-h-[45vh] items-center overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image src="/hero/photography-brain.jpg" alt="Brain Works Studio Africa production crew" fill priority quality={85} sizes="100vw" className="object-cover" />
          <div className="absolute inset-0 bg-navy-900/75" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">What We Do</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
            From a single social shoot to a full commercial or live broadcast, we assemble the right creative and technical team for the job.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-gold-500 px-8 py-4 text-sm font-semibold uppercase tracking-wider text-white transition-colors hover:bg-gold-600"
          >
            Start a Project
          </Link>
        </div>
      </section>

      {/* Service pillars */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {SERVICE_PILLARS.map((pillar, index) => (
              <ImageCard
                key={pillar.slug}
                index={index}
                href={pillar.href}
                image={pillar.image}
                imageAlt={`${pillar.name} by Brain Works Studio Africa`}
                title={pillar.name}
                summary={pillar.summary}
                headingLevel="h2"
                cta={pillar.href.startsWith('/services') ? 'Learn more' : 'Get a quote'}
              >
                <ul className="mt-3 space-y-1 text-xs text-white/70">
                  {pillar.includes.map((item) => (
                    <li key={item}>· {item}</li>
                  ))}
                </ul>
              </ImageCard>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed service pages */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <h2 className="mb-10 font-serif text-2xl font-bold text-navy-900 sm:text-3xl">Service Details</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service, index) => (
              <ImageCard
                key={service.slug}
                index={index}
                href={`/services/${service.slug}`}
                image={service.image}
                imageAlt={`${service.name} in Ghana by Brain Works Studio Africa`}
                kicker={service.heroKicker.split('·').pop()?.trim()}
                title={service.name}
                summary={service.intro}
                cta="Learn more"
              />
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
