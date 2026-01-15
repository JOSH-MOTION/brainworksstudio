// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Camera, Video, Star, Sparkles, Zap, Award, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -40 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

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

export default function Home() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/reviews?approved=true', {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        const approvedReviews = data.filter((r: Review) => r.approved === true);
        setReviews(approvedReviews);
      } else {
        setError('Failed to load testimonials');
      }
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('An error occurred while loading testimonials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section - Inspired by KRAFT Design */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-slate-900">
        {/* Hero Background Image with Dramatic Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/hero1.jpg"
            alt="Hero Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            quality={100}
            onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
          />
          {/* Dramatic gradient overlays for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/60 to-transparent" />
<div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/40" />

        </div>

        {/* Subtle animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute -top-1/4 -left-1/4 w-[600px] h-[600px] bg-teal-400/20 rounded-full blur-[120px]"
          />
        </div>

        {/* Hero Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-6 lg:px-8 py-20 text-center"
        >
          <div className="max-w-5xl mx-auto">
            {/* Premium Badge */}
            <motion.div
              variants={fadeInUp}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-full mb-8"
            >
              <Sparkles className="w-4 h-4 text-teal-400" />
              <span className="text-sm text-white/90 font-medium tracking-wide">Premium Visual Storytelling</span>
            </motion.div>

            {/* Main Heading - Large and Bold */}
            <motion.h1
              variants={fadeInUp}
              className="text-6xl sm:text-7xl lg:text-8xl font-bold text-white mb-8 leading-[1.1] tracking-tight"
            >
              Every Frame Tells
              <span className="block mt-2">
                <span className="bg-gradient-to-r from-white via-teal-200 to-teal-400 bg-clip-text text-transparent">
                  a Story
                </span>
              </span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              variants={fadeInUp}
              className="text-xl sm:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light"
            >
              Explore our innovative lineup of visual services, where
              creativity meets performance.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              variants={fadeInUp}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/portfolio">
                <motion.div
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(20,184,166,0.3)" }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="lg"
                    className="group w-full sm:w-auto bg-white text-slate-900 hover:bg-gray-100 border-0 text-base font-bold py-7 px-10 rounded-full shadow-2xl shadow-white/20 transition-all duration-300"
                  >
                    SEE ALL MODELS
                    <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </motion.div>
              </Link>
              <Link href="/pricing">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    size="lg"
                    variant="outline"
                    className="w-full sm:w-auto bg-transparent backdrop-blur-sm border-2 border-white/30 text-white hover:text-teal-400 hover:bg-white/10 hover:border-white/50 text-base font-bold py-7 px-10 rounded-full transition-all duration-300"
                  >
                    <FileText className="mr-3 h-5 w-5" />
                    VIEW RATE CARD
                  </Button>
                </motion.div>
              </Link>
            </motion.div>

            {/* Stats Section */}
            <motion.div
              variants={fadeInUp}
              className="grid grid-cols-3 gap-8 mt-20 max-w-3xl mx-auto border-t border-white/10 pt-12"
            >
              {[
                { number: '500+', label: 'Happy Clients' },
                { number: '1000+', label: 'Projects Done' },
                { number: '15+', label: 'Awards Won' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.3 }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl font-bold text-white mb-2 tracking-tight">
                    {stat.number}
                  </div>
                  <div className="text-sm text-gray-400 uppercase tracking-wider font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 12, 0] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-8 h-12 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 16, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section - Modern Grid */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-6">
              <span className="px-5 py-2.5 bg-teal-50 text-teal-600 rounded-full text-sm font-bold uppercase tracking-wider">
                Our Services
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              What We Offer
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            >
              Professional services tailored to capture your vision with creativity and precision
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto"
          >
            {[
              {
                icon: Camera,
                title: 'Photography',
                description: 'Stunning images that freeze your most precious moments in time with artistic precision.',
                features: ['Portrait Sessions', 'Event Coverage', 'Commercial Shoots'],
                link: '/photography',
                image: '/Pic1.jpeg',
                gradient: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Video,
                title: 'Videography',
                description: 'Cinematic videos that bring your story to life with emotion and professional quality.',
                features: ['Wedding Films', 'Corporate Videos', 'Documentary Style'],
                link: '/videography',
                image: '/Pic3.jpeg',
                gradient: 'from-purple-500 to-pink-500',
              },
            ].map((service, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Link href={service.link}>
                  <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white rounded-2xl">
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                      <div className="absolute top-8 left-8">
                        <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-2xl">
                          <service.icon className="w-8 h-8 text-slate-900" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-10">
                      <h3 className="text-3xl font-bold text-slate-900 mb-4 group-hover:text-teal-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                        {service.description}
                      </p>
                      <ul className="space-y-3 mb-8">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-3 text-base text-gray-700">
                            <Zap className="w-5 h-5 text-[#CB9D06] flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center text-teal-600 font-bold group-hover:gap-3 gap-2 transition-all text-lg">
                        Learn More
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Featured Work Section */}
      <section className="py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-6">
              <span className="px-5 py-2.5 bg-[#CB9D06]/10 text-[#CB9D06] rounded-full text-sm font-bold uppercase tracking-wider">
                Portfolio
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              Featured Work
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            >
              A glimpse into our portfolio of unforgettable moments
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {[
              { image: '/image.jpg', title: 'Timeless Wedding', category: 'Wedding', link: '/portfolio/wedding' },
              { image: '/brand.jpg', title: 'Brand Campaign', category: 'Corporate', link: '/portfolio/corporate' },
            ].map((work, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Link href={work.link}>
                  <div className="group relative overflow-hidden rounded-3xl aspect-[4/3] shadow-xl hover:shadow-2xl transition-all duration-500">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col justify-end p-10">
                      <span className="inline-block px-4 py-2 bg-white/20 backdrop-blur-md text-white text-xs font-bold rounded-full mb-4 w-fit uppercase tracking-wider">
                        {work.category}
                      </span>
                      <h3 className="text-3xl font-bold text-white mb-3 group-hover:translate-y-0 translate-y-2 transition-transform">
                        {work.title}
                      </h3>
                      <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity font-semibold">
                        View Project
                        <ArrowRight className="ml-3 w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center mt-16"
          >
            <Link href="/portfolio">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 py-7 text-base font-bold shadow-xl"
                >
                  Explore Full Portfolio
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-32 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-6">
              <span className="px-5 py-2.5 bg-teal-50 text-teal-600 rounded-full text-sm font-bold flex items-center gap-2 w-fit mx-auto uppercase tracking-wider">
                <Award className="w-4 h-4" />
                Client Reviews
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-5xl sm:text-6xl font-bold text-slate-900 mb-6 tracking-tight"
            >
              What Clients Say
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto font-light"
            >
              Hear from those who trusted us with their special moments
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-6 text-gray-600 text-lg">Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <Card className="max-w-md mx-auto shadow-xl border-0 rounded-2xl">
                <CardContent className="p-10">
                  <p className="text-red-600 mb-6 text-lg">{error}</p>
                  <Button 
                    onClick={fetchReviews}
                    className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-6"
                  >
                    Try Again
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : reviews.length === 0 ? (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={scaleIn}
            >
              <Card className="max-w-2xl mx-auto shadow-xl border-0 rounded-2xl">
                <CardContent className="p-16 text-center">
                  <div className="w-20 h-20 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Star className="w-10 h-10 text-teal-500" />
                  </div>
                  <h3 className="text-3xl font-bold text-slate-900 mb-4">
                    Be the First to Review
                  </h3>
                  <p className="text-gray-600 mb-8 text-lg">
                    Share your experience with Brain Works Studio Africa!
                  </p>
                  <Link href="/reviews/submit">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-10 py-6 text-base font-semibold">
                      Submit a Review
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            <>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                variants={staggerContainer}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {reviews.slice(0, 6).map((review, index) => (
                  <motion.div key={review.id} variants={scaleIn}>
                    <Card className="h-full border-0 shadow-xl hover:shadow-2xl transition-shadow duration-300 bg-white rounded-2xl">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          {review.clientImage ? (
                            <Image
                              src={review.clientImage}
                              alt={review.clientName}
                              width={64}
                              height={64}
                              className="rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/profile-placeholder.jpg';
                              }}
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-2xl">
                                {review.clientName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-xl font-bold text-slate-900 truncate">
                              {review.clientName}
                            </CardTitle>
                            <p className="text-sm text-gray-500 truncate">{review.serviceType}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-1 mb-6">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-5 w-5 ${
                                i < review.rating 
                                  ? 'fill-[#CB9D06] text-[#CB9D06]' 
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700 leading-relaxed mb-6">
                          &ldquo;{review.reviewText}&rdquo;
                        </p>
                        {review.adminResponse && (
                          <div className="p-5 bg-slate-50 rounded-xl border-l-4 border-teal-500">
                            <p className="text-xs font-bold text-teal-600 mb-2 uppercase tracking-wider">
                              Our Response:
                            </p>
                            <p className="text-sm text-gray-700">
                              {review.adminResponse}
                            </p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>

              {reviews.length > 6 && (
                <motion.div
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  variants={fadeInUp}
                  className="text-center mt-16"
                >
                  <p className="text-gray-600 mb-6 text-lg">
                    Showing 6 of {reviews.length} testimonials
                  </p>
                  <Link href="/reviews">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-10 py-7 text-base font-bold">
                      View All Testimonials
                    </Button>
                  </Link>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Modern CTA Section */}
      <section className="relative py-32 bg-gradient-to-br from-slate-950 via-slate-900 to-teal-950 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '48px 48px'
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-[#CB9D06]/10 rounded-full blur-[150px]" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative max-w-5xl mx-auto text-center px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-8">
            <span className="px-5 py-2.5 bg-white/5 backdrop-blur-md text-white rounded-full text-sm font-bold uppercase tracking-wider">
              Ready to Get Started?
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 tracking-tight"
          >
            Let&rsquo;s Create Something
            <span className="block mt-3 bg-gradient-to-r from-white via-teal-300 to-teal-400 bg-clip-text text-transparent">
              Extraordinary
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 mb-16 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Book your session today and let us turn your vision into stunning visual stories
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link href="/booking">
              <motion.div
                whileHover={{ scale: 1.05, boxShadow: "0 20px 40px rgba(255,255,255,0.2)" }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  className="group w-full sm:w-auto bg-white text-slate-900 hover:bg-gray-100 text-base font-bold py-7 px-10 rounded-full shadow-2xl"
                >
                  Book a Session
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white/10 hover:border-white/50 text-base font-bold py-7 px-10 rounded-full backdrop-blur-sm"
                >
                  Get in Touch
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}
       