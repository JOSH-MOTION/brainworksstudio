'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import Image from 'next/image';
import { Check, MapPin, ArrowUpRight } from 'lucide-react';
import { getServiceBySlug } from '@/lib/services-config';
import { PortfolioItem } from '@/types';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.06, ease: 'easeOut' },
  }),
};

export default function ServiceLandingClient({ slug }: { slug: string }) {
  const service = getServiceBySlug(slug);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);

  useEffect(() => {
    if (!service) return;
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/portfolio');
        if (!response.ok) return;
        const data: PortfolioItem[] = await response.json();
        setPortfolioItems(data.filter(service.matchesPortfolioItem).slice(0, 6));
      } catch (err) {
        console.error('Failed to load portfolio examples:', err);
      }
    };
    fetchItems();
  }, [service]);

  if (!service) return null;

  return (
    <Layout>
      {/* Hero */}
      <section className="relative flex min-h-[55vh] items-center overflow-hidden text-white">
        <div className="absolute inset-0">
          <Image src="/hero/photography-brain.jpg" alt={`${service.name} in Accra, Ghana`} fill priority quality={95} className="object-cover" />
          <div className="absolute inset-0 bg-[#001F44]/70" />
        </div>
        <div className="relative mx-auto max-w-4xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-teal-300">{service.heroKicker}</p>
            <h1 className="font-serif text-4xl font-bold tracking-tight md:text-5xl">{service.name} in Accra, Ghana</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-white/85">{service.intro}</p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <Link href="/booking">
                <Button className="rounded-full bg-teal-500 px-8 py-6 text-base font-semibold text-white hover:bg-teal-600">Book a Session</Button>
              </Link>
              <Link href={service.pricingHref}>
                <Button variant="outline" className="rounded-full border-white/40 bg-white/10 px-8 py-6 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20">
                  {service.pricingLabel}
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* What's included */}
      <section className="bg-white py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-serif text-2xl font-bold text-[#001F44] sm:text-3xl">What&rsquo;s Included</h2>
              <ul className="mt-6 space-y-3">
                {service.whatIncluded.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <Check className="mt-0.5 h-5 w-5 flex-none text-teal-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
              <h2 className="font-serif text-2xl font-bold text-[#001F44] sm:text-3xl">Why Brain Works Studio Africa</h2>
              <ul className="mt-6 space-y-3">
                {service.whyBrainWorks.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-700">
                    <Check className="mt-0.5 h-5 w-5 flex-none text-teal-600" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex items-center gap-2 rounded-full bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                <MapPin className="h-4 w-4 flex-none text-teal-600" />
                {service.serviceArea}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-12 font-serif text-2xl font-bold text-[#001F44] sm:text-3xl"
          >
            How It Works
          </motion.h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {service.process.map((step, index) => (
              <motion.div key={step.title} custom={index} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                <p className="font-serif text-lg font-bold text-teal-600">{index + 1}</p>
                <h3 className="mt-2 font-semibold text-[#001F44]">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio examples */}
      {portfolioItems.length > 0 && (
        <section className="bg-white py-16 sm:py-24">
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
            <motion.div variants={sectionVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="mb-10 flex items-end justify-between">
              <h2 className="font-serif text-2xl font-bold text-[#001F44] sm:text-3xl">Recent {service.name} Work</h2>
              <Link href="/portfolio" className="hidden text-sm font-medium text-teal-600 hover:text-teal-700 sm:inline-flex sm:items-center sm:gap-1">
                Full portfolio <ArrowUpRight className="h-4 w-4" />
              </Link>
            </motion.div>
            <div className="grid grid-cols-2 gap-3 sm:gap-6 lg:grid-cols-3">
              {portfolioItems.map((item, index) => (
                <motion.div key={item.id} custom={index} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
                  <Link href={`/portfolio/${item.id}`} className="group block">
                    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-xl bg-slate-100 shadow-[0_8px_30px_-14px_rgba(0,31,68,0.35)] transition-shadow duration-500 group-hover:shadow-[0_24px_48px_-16px_rgba(0,31,68,0.45)]">
                      <Image
                        src={item.imageUrls[0] || '/placeholder-image.jpg'}
                        alt={`${item.title} — ${item.category} ${item.type} by Brain Works Studio Africa, Accra, Ghana`}
                        fill
                        sizes="(max-width: 640px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                      />
                      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#001F44]/90 via-[#001F44]/30 to-transparent px-4 pb-4 pt-10">
                        <p className="font-serif text-sm text-white sm:text-base">{item.title}</p>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/portfolio" className="text-sm font-medium text-teal-600 hover:text-teal-700">Full portfolio →</Link>
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <motion.h2
            variants={sectionVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="mb-10 font-serif text-2xl font-bold text-[#001F44] sm:text-3xl"
          >
            Frequently Asked Questions
          </motion.h2>
          <div className="divide-y divide-gray-200">
            {service.faqs.map((faq, index) => (
              <motion.div key={faq.question} custom={index} variants={cardVariants} initial="hidden" whileInView="visible" viewport={{ once: true }} className="py-6">
                <h3 className="font-semibold text-[#001F44]">{faq.question}</h3>
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              </motion.div>
            ))}
          </div>
          {service.relatedBlogSlug && (
            <p className="mt-8 text-gray-600">
              Read more: <Link href={`/blog/${service.relatedBlogSlug}`} className="font-medium text-teal-600 hover:text-teal-700">{service.relatedBlogTitle}</Link>
            </p>
          )}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden bg-[#001F44] py-16 text-white sm:py-20">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 1.5px 1.5px, white 1px, transparent 0)', backgroundSize: '28px 28px' }}
        />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="font-serif text-3xl font-bold sm:text-4xl">Ready to Book Your {service.name}?</h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">Tell us your date and location, and we&rsquo;ll get back to you with availability and a quote.</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link href="/booking">
              <Button className="rounded-full bg-white px-8 py-6 text-base font-semibold text-[#001F44] hover:bg-gray-100">Book Now</Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" className="rounded-full border-white/40 bg-transparent px-8 py-6 text-base font-semibold text-white hover:bg-white/10">
                Ask a Question
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
