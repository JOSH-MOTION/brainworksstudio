'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Check, ArrowUpRight } from 'lucide-react';
import type { ServicePillar } from '@/lib/site-config';

interface ServiceChapterRowProps {
  pillar: ServicePillar;
  index: number;
}

// Full-bleed, alternating-tone "chapter" for each service pillar — a numbered
// section with its own background rather than a card in a grid, so scrolling
// through the list of services reads like chapters rather than a catalogue.
export default function ServiceChapterRow({ pillar, index }: ServiceChapterRowProps) {
  const dark = index % 2 === 0;
  const imageOnRight = index % 2 === 0;
  const cta = pillar.href.startsWith('/services') ? 'Learn more' : 'Get a quote';

  return (
    <section className={dark ? 'bg-navy-900 text-white' : 'bg-white text-navy-900'}>
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className={imageOnRight ? 'lg:order-1' : 'lg:order-2'}
          >
            <span className={dark ? 'text-sm font-semibold tracking-widest text-gold-300' : 'text-sm font-semibold tracking-widest text-gold-600'}>
              {String(index + 1).padStart(2, '0')}
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight sm:text-4xl">{pillar.name}</h2>
            <p className={dark ? 'mt-4 max-w-md text-white/75' : 'mt-4 max-w-md text-navy-900/70'}>{pillar.summary}</p>

            <ul className={`mt-8 divide-y ${dark ? 'divide-white/10' : 'divide-navy-900/10'}`}>
              {pillar.includes.map((item) => (
                <li key={item} className="flex items-center gap-3 py-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full ${
                      dark ? 'bg-gold-400/20 text-gold-300' : 'bg-gold-500/15 text-gold-600'
                    }`}
                  >
                    <Check className="h-3.5 w-3.5" strokeWidth={3} />
                  </span>
                  <span className={dark ? 'text-white/85' : 'text-navy-900/80'}>{item}</span>
                </li>
              ))}
            </ul>

            <Link
              href={pillar.href}
              className={`mt-8 inline-flex items-center gap-3 rounded-full py-3 pl-6 pr-2 text-sm font-semibold uppercase tracking-wider transition-colors ${
                dark ? 'bg-gold-500 text-white hover:bg-gold-600' : 'bg-navy-900 text-white hover:bg-navy-800'
              }`}
            >
              {cta}
              <span className={`flex h-8 w-8 items-center justify-center rounded-full ${dark ? 'bg-white/15' : 'bg-white/10'}`}>
                <ArrowUpRight className="h-4 w-4" />
              </span>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className={`relative aspect-[4/5] overflow-hidden rounded-3xl ${imageOnRight ? 'lg:order-2' : 'lg:order-1'}`}
          >
            <Image
              src={pillar.image}
              alt={`${pillar.name} by Brain Works Studio Africa`}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
