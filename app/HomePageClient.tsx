'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Star, Award, Play, Check } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import VideoPlayer from '@/components/VideoPlayer';
import { SERVICE_PILLARS, VERIFIED_STATS } from '@/lib/site-config';
import { PortfolioItem } from '@/types';
import MotionCard from '@/components/MotionCard';
import ImageCard from '@/components/ImageCard';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2,
    },
  },
};

const WHY_BWSA = [
  { title: 'Creative direction', description: 'Concept and story first — every shoot starts with what the work needs to achieve.' },
  { title: 'Production capability', description: 'From a lean social crew to multi-camera commercial and live productions.' },
  { title: 'Reliable crew', description: 'An experienced team that turns up prepared, on time and briefed.' },
  { title: 'Technical expertise', description: 'Cinema cameras, lighting, drone, sound and live switching handled in-house.' },
  { title: 'Storytelling', description: 'Visuals built around people and message, not just pretty frames.' },
  { title: 'Post-production', description: 'Edit, colour, motion graphics and sound delivered for every platform.' },
];

interface Review {
  id: string;
  clientName: string;
  clientImage?: string;
  rating: number;
  reviewText: string;
  serviceType: string;
  approved: boolean;
  adminResponse?: string;
}

export default function HomePageClient({
  initialReviews,
  selectedWork,
}: {
  initialReviews: Review[];
  selectedWork: PortfolioItem[];
}) {
  const [reviews] = useState<Review[]>(initialReviews);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const showreelId = 'Tvzynkzv_y4';
  const embedUrl = `https://www.youtube.com/embed/${showreelId}`;
  const [videoThumbnail, setVideoThumbnail] = useState(`https://img.youtube.com/vi/${showreelId}/maxresdefault.jpg`);

  const businessPillars = SERVICE_PILLARS.filter((p) => p.forBusiness);

  return (
    <Layout>
      {/* 1. Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-navy-900">
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero/249A9973.jpg"
            alt="Brain Works Studio Africa production"
            fill
            sizes="100vw"
            className="object-cover object-[center_20%]"
            priority
            quality={85}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/70 to-stone-900/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40" />
        </div>

        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-28 text-center"
        >
          <div className="max-w-5xl mx-auto">
            <motion.p variants={fadeInUp} className="mb-6 text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-gold-300">
              African Creative Production Company · Accra, Ghana
            </motion.p>

            <motion.h1
              variants={fadeInUp}
              className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold text-white mb-10 sm:mb-12 leading-[1.1] tracking-tight"
            >
              We Create Visual Stories
              <span className="block mt-1 sm:mt-2 text-gold-300">That Move People.</span>
            </motion.h1>

            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/contact" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-gold-500 text-white hover:bg-gold-400 border-0 text-base font-bold py-7 px-10 rounded-full shadow-2xl shadow-gold-500/30"
                >
                  START A PROJECT
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/portfolio" className="w-full sm:w-auto">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:text-white hover:bg-white/10 hover:border-white/50 text-base font-bold py-7 px-10 rounded-full"
                >
                  VIEW OUR WORK
                </Button>
              </Link>
            </motion.div>

            {/* 2. Credibility strip — only verified figures (see lib/site-config.ts) */}
            {VERIFIED_STATS.length > 0 && (
              <motion.div
                variants={fadeInUp}
                className="grid gap-8 mt-20 max-w-3xl mx-auto border-t border-white/10 pt-12"
                style={{ gridTemplateColumns: `repeat(${VERIFIED_STATS.length}, minmax(0, 1fr))` }}
              >
                {VERIFIED_STATS.map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-3xl sm:text-5xl font-bold text-white mb-2 tracking-tight">{stat.value}</div>
                    <div className="text-xs sm:text-sm text-gray-400 uppercase tracking-wider font-medium">{stat.label}</div>
                  </div>
                ))}
              </motion.div>
            )}
          </div>
        </motion.div>
      </section>

      {/* 3. What We Do */}
      <section className="py-24 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={staggerContainer}
            className="max-w-3xl mb-14"
          >
            <motion.span variants={fadeInUp} className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold block mb-4">
              What We Do
            </motion.span>
            <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-5xl font-bold text-navy-900 tracking-tight">
              The right creative and technical team for every project.
            </motion.h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {SERVICE_PILLARS.map((pillar, index) => (
              <ImageCard
                key={pillar.slug}
                index={index}
                href={pillar.href}
                image={pillar.image}
                imageAlt={`${pillar.name} by Brain Works Studio Africa`}
                title={pillar.name}
                summary={pillar.summary}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Selected Work */}
      {selectedWork.length > 0 && (
        <section className="py-24 sm:py-28 bg-navy-950 text-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 mb-14">
              <div>
                <span className="text-xs uppercase tracking-[0.25em] text-gold-300 font-semibold block mb-4">Selected Work</span>
                <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight">Proof, not promises.</h2>
              </div>
              <Link href="/portfolio" className="inline-flex items-center text-sm font-semibold text-gold-300 hover:text-gold-200">
                View all work <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {selectedWork.map((work, index) => (
                <MotionCard key={work.id} index={index} lift={8} className="rounded-xl bg-navy-800">
                  <Link href={`/portfolio/${work.id}`} className="block">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={work.imageUrls[0]}
                        alt={`${work.title} — ${work.category} by Brain Works Studio Africa`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent transition-opacity duration-500 group-hover:from-navy-950/95" />
                      <div className="absolute inset-x-0 bottom-0 p-6 transition-transform duration-500 group-hover:-translate-y-2">
                        <p className="text-xs uppercase tracking-wider text-gold-300 mb-1">{work.category || work.type}</p>
                        <h3 className="text-xl font-bold">{work.title}</h3>
                        <span className="mt-2 inline-flex translate-y-2 items-center text-sm font-semibold text-gold-300 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                          View project <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Why BWSA */}
      <section className="py-24 sm:py-28 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-14">
          <div className="lg:col-span-4">
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold block mb-4">Why BWSA</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight">
              Built to deliver, from brief to final cut.
            </h2>
          </div>
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {WHY_BWSA.map((item, index) => (
              <MotionCard key={item.title} index={index} lift={4} className="rounded-xl border border-gray-100 bg-slate-50 p-6 hover:bg-white">
                <div className="flex gap-4">
                  <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-gold-100 text-gold-600 transition-all duration-500 group-hover:rotate-[360deg] group-hover:bg-gold-500 group-hover:text-white">
                    <Check className="h-4 w-4" />
                  </span>
                  <div>
                    <h3 className="font-semibold text-navy-900">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-600">{item.description}</p>
                  </div>
                </div>
              </MotionCard>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Services for Business (with showreel) */}
      <section className="py-24 sm:py-28 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <button
            type="button"
            onClick={() => setSelectedVideo(embedUrl)}
            className="group relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-200 shadow-xl"
            aria-label="Play the BWSA showreel"
          >
            <Image
              src={videoThumbnail}
              alt="BWSA showreel"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              onError={() => {
                if (videoThumbnail.includes('maxresdefault')) {
                  setVideoThumbnail(`https://img.youtube.com/vi/${showreelId}/hqdefault.jpg`);
                } else {
                  setVideoThumbnail('/hero1.jpg');
                }
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-lg">
                <Play className="ml-1 h-6 w-6 fill-navy-900 text-navy-900" />
              </span>
            </div>
          </button>

          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold block mb-4">For Business</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-6">
              Production for brands and organisations.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-8">
              Corporate films, commercials, branded content, social media content, live streaming and photography —
              planned around your audience and delivered for every platform you publish on.
            </p>
            <ul className="space-y-3 mb-10">
              {businessPillars.map((pillar) => (
                <li key={pillar.slug}>
                  <Link href={pillar.href} className="group flex items-center justify-between border-b border-gray-200 pb-3 text-navy-900 hover:text-gold-700">
                    <span className="font-medium">{pillar.name}</span>
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact">
              <Button className="rounded-full bg-navy-900 hover:bg-navy-800 px-8 py-6 font-semibold">
                Get a Quote
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 9. Testimonials */}
      {reviews.length > 0 && (
        <section className="py-24 sm:py-28 bg-white">
          <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-100px' }}
              variants={staggerContainer}
              className="text-center mb-16"
            >
              <motion.span
                variants={fadeInUp}
                className="px-5 py-2.5 bg-gold-50 text-gold-600 rounded-full text-sm font-bold inline-flex items-center gap-2 uppercase tracking-wider mb-6"
              >
                <Award className="w-4 h-4" />
                Client Reviews
              </motion.span>
              <motion.h2 variants={fadeInUp} className="font-serif text-3xl sm:text-5xl font-bold text-navy-900 tracking-tight">
                What Clients Say
              </motion.h2>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {reviews.slice(0, 6).map((review, index) => (
                <MotionCard key={review.id} index={index} className="rounded-2xl">
                  <Card className="relative h-full border border-gray-100 shadow-sm bg-white rounded-2xl">
                    <span aria-hidden="true" className="pointer-events-none absolute right-5 top-2 font-serif text-7xl leading-none text-gold-100 transition-all duration-500 group-hover:-translate-y-1 group-hover:text-gold-200">
                      &rdquo;
                    </span>
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-4">
                        {review.clientImage ? (
                          <Image
                            src={review.clientImage}
                            alt={review.clientName}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full object-cover flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-gold-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-white font-bold text-xl">{review.clientName.charAt(0).toUpperCase()}</span>
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <CardTitle className="text-lg font-bold text-navy-900 truncate">{review.clientName}</CardTitle>
                          <p className="text-sm text-gray-500 truncate">{review.serviceType}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1 mb-4" aria-label={`${review.rating} out of 5 stars`}>
                        {[...Array(5)].map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ opacity: 0, scale: 0, rotate: -90 }}
                            whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 + (index % 3) * 0.09 + i * 0.08, type: 'spring', stiffness: 260, damping: 14 }}
                          >
                            <Star className={`h-4 w-4 ${i < review.rating ? 'fill-gold-500 text-gold-500' : 'text-gray-300'}`} />
                          </motion.span>
                        ))}
                      </div>
                      <p className="text-gray-700 leading-relaxed">&ldquo;{review.reviewText}&rdquo;</p>
                      {review.adminResponse && (
                        <div className="mt-5 p-4 bg-slate-50 rounded-xl border-l-4 border-gold-500">
                          <p className="text-xs font-bold text-gold-600 mb-1 uppercase tracking-wider">Our Response</p>
                          <p className="text-sm text-gray-700">{review.adminResponse}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </MotionCard>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. About BWSA */}
      <section className="py-24 sm:py-28 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-stone-100">
            <Image src="/charles.jpg" alt="The Brain Works Studio Africa team at work" fill sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
          </div>
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-gold-600 font-semibold block mb-4">About BWSA</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-navy-900 tracking-tight mb-6">
              From photography studio to creative production company.
            </h2>
            <p className="text-gray-600 leading-relaxed mb-5">
              Brain Works Studio Africa started with a camera and a love for people&rsquo;s stories. Today we&rsquo;re a
              production company based in Accra, bringing together directors, cinematographers, photographers, editors and
              live-production crew.
            </p>
            <p className="text-gray-600 leading-relaxed mb-8">
              We believe visual storytelling should solve a communication problem — not simply look good.
            </p>
            <Link href="/about">
              <Button variant="outline" className="rounded-full border-navy-900 px-8 py-6 font-semibold text-navy-900 hover:bg-navy-900 hover:text-white">
                Our Story
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* 11. Final CTA */}
      <section className="relative py-28 bg-gradient-to-br from-navy-950 via-navy-900 to-navy-950 overflow-hidden">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative max-w-4xl mx-auto text-center px-6 lg:px-8"
        >
          <motion.h2 variants={fadeInUp} className="font-serif text-4xl sm:text-6xl font-bold text-white mb-6 tracking-tight">
            Have a project in mind?
            <span className="block mt-2 text-gold-300">Let&rsquo;s build it.</span>
          </motion.h2>
          <motion.p variants={fadeInUp} className="text-lg text-gray-300 mb-12 max-w-2xl mx-auto font-light leading-relaxed">
            Tell us what you need and we&rsquo;ll come back with ideas, availability and a quote within one business day.
          </motion.p>
          <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="group w-full sm:w-auto bg-white text-navy-900 hover:bg-gray-100 text-base font-bold py-7 px-10 rounded-full">
                Start a Project
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/booking" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:text-white hover:bg-white/10 text-base font-bold py-7 px-10 rounded-full"
              >
                Book a Session
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {selectedVideo && <VideoPlayer videoSrc={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </Layout>
  );
}
