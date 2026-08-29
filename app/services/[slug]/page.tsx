import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { SERVICES, getServiceBySlug } from '@/lib/services-config';
import ServiceLandingClient from './ServiceLandingClient';

export const dynamic = 'force-static';

const BASE_URL = 'https://brainworksstudioafrica.com';

interface ServicePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export function generateMetadata({ params }: ServicePageProps): Metadata {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    return { title: 'Service Not Found | Brain Works Studio Africa' };
  }

  const url = `${BASE_URL}/services/${service.slug}`;

  return {
    title: service.metaTitle,
    description: service.metaDescription,
    alternates: { canonical: url },
    openGraph: {
      title: service.metaTitle,
      description: service.metaDescription,
      url,
      siteName: 'Brain Works Studio Africa',
      type: 'website',
      images: [{ url: `${BASE_URL}/newlogo2.jpg`, width: 1200, height: 630, alt: 'Brain Works Studio Africa' }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.metaTitle,
      description: service.metaDescription,
      images: [`${BASE_URL}/newlogo2.jpg`],
    },
  };
}

export default function ServicePage({ params }: ServicePageProps) {
  const service = getServiceBySlug(params.slug);

  if (!service) {
    notFound();
  }

  const url = `${BASE_URL}/services/${service.slug}`;

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: BASE_URL },
      { '@type': 'ListItem', position: 2, name: 'Services', item: `${BASE_URL}/services` },
      { '@type': 'ListItem', position: 3, name: service.name, item: url },
    ],
  };

  const serviceJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: service.name,
    name: `${service.name} — Brain Works Studio Africa`,
    description: service.metaDescription,
    url,
    provider: {
      '@type': 'ProfessionalService',
      name: 'Brain Works Studio Africa',
      url: BASE_URL,
    },
    areaServed: {
      '@type': 'Place',
      name: service.serviceArea,
    },
  };

  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: service.faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      <ServiceLandingClient slug={service.slug} />
    </>
  );
}
