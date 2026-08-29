import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Layout from '@/components/Layout';
import { SERVICES } from '@/lib/services-config';

const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  title: 'Photography & Videography Services | Brain Works Studio Africa',
  description:
    'Wedding, event, corporate, and product photography, plus videography — all delivered by Brain Works Studio Africa in Accra, Ghana.',
  alternates: { canonical: `${BASE_URL}/services` },
  openGraph: {
    title: 'Photography & Videography Services | Brain Works Studio Africa',
    description:
      'Wedding, event, corporate, and product photography, plus videography — all delivered by Brain Works Studio Africa in Accra, Ghana.',
    url: `${BASE_URL}/services`,
    siteName: 'Brain Works Studio Africa',
    type: 'website',
    images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Photography & Videography Services | Brain Works Studio Africa',
    description:
      'Wedding, event, corporate, and product photography, plus videography — all delivered by Brain Works Studio Africa in Accra, Ghana.',
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
          <Image src="/hero/photography-brain.jpg" alt="Brain Works Studio Africa services" fill priority quality={95} className="object-cover" />
          <div className="absolute inset-0 bg-[#001F44]/70" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-16 text-center sm:px-6 lg:px-8">
          <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">Our Services</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">
            Photography and videography for weddings, events, corporate brands, and products — all delivered by one studio in Accra, Ghana.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {SERVICES.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group block rounded-2xl border border-gray-200 p-7 transition-colors hover:border-teal-300 hover:bg-teal-50/40"
              >
                <p className="text-xs font-semibold uppercase tracking-wider text-teal-600">{service.heroKicker}</p>
                <h2 className="mt-3 font-serif text-xl font-bold text-[#001F44]">{service.name}</h2>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{service.intro}</p>
                <span className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-teal-600 group-hover:gap-2 transition-all">
                  Learn more →
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
}
