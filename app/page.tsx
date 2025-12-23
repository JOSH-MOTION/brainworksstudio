// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Camera, Video, Star, Sparkles, Zap, Award } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Animation variants
const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

const slideIn: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
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
      {/* Modern Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/brand.jpg"
            alt="Hero Background"
            fill
            sizes="100vw"
            className="object-cover opacity-30"
            priority
            onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-slate-900/30 to-slate-900" />
        </div>

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-1/4 -left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-[#CB9D06]/20 rounded-full blur-3xl"
          />
        </div>

        {/* Hero Content */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
          className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
        >
          <motion.div
            variants={fadeInUp}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full mb-8"
          >
            <Sparkles className="w-4 h-4 text-[#CB9D06]" />
            <span className="text-sm text-white/90 font-medium">Award-Winning Visual Studio</span>
          </motion.div>

          <motion.h1
            variants={fadeInUp}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 tracking-tight"
          >
            Immortalize Your
            <span className="block bg-gradient-to-r from-teal-400 to-[#CB9D06] bg-clip-text text-transparent">
              Moments
            </span>
          </motion.h1>

          <motion.p
            variants={fadeInUp}
            className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl leading-relaxed"
          >
            Transform your story into breathtaking visuals with our expert photography and videography services.
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-start gap-4"
          >
            <Link href="/portfolio">
              <Button
                size="lg"
                className="group w-full sm:w-auto bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white border-0 text-base font-semibold py-6 px-8 rounded-full shadow-lg shadow-teal-500/30 transition-all duration-300"
              >
                Discover Our Work
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/booking">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-base font-semibold py-6 px-8 rounded-full transition-all duration-300"
              >
                Book Your Session
              </Button>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <motion.div
            variants={fadeInUp}
            className="grid grid-cols-3 gap-8 mt-20 max-w-2xl"
          >
            {[
              { number: '500+', label: 'Happy Clients' },
              { number: '1000+', label: 'Projects Done' },
              { number: '15+', label: 'Awards Won' },
            ].map((stat, index) => (
              <div key={index}>
                <div className="text-3xl sm:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* Services Section - Modern Grid */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
              <span className="px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-semibold">
                Our Services
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
            >
              What We Offer
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Professional services tailored to capture your vision with creativity and precision
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto"
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
                  <Card className="group relative overflow-hidden border-0 shadow-xl hover:shadow-2xl transition-all duration-500 bg-white">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={service.image}
                        alt={service.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                        onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                      />
                      <div className={`absolute inset-0 bg-gradient-to-t ${service.gradient} opacity-60 group-hover:opacity-70 transition-opacity`} />
                      <div className="absolute top-6 left-6">
                        <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-lg">
                          <service.icon className="w-7 h-7 text-slate-900" />
                        </div>
                      </div>
                    </div>
                    <CardContent className="p-8">
                      <h3 className="text-2xl font-bold text-slate-900 mb-3 group-hover:text-teal-600 transition-colors">
                        {service.title}
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        {service.description}
                      </p>
                      <ul className="space-y-2 mb-6">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm text-gray-700">
                            <Zap className="w-4 h-4 text-[#CB9D06]" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                      <div className="flex items-center text-teal-600 font-semibold group-hover:gap-3 gap-2 transition-all">
                        Learn More
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
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
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
              <span className="px-4 py-2 bg-[#CB9D06]/10 text-[#CB9D06] rounded-full text-sm font-semibold">
                Portfolio
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
            >
              Featured Work
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              A glimpse into our portfolio of unforgettable moments
            </motion.p>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {[
              { image: '/image.jpg', title: 'Timeless Wedding', category: 'Wedding', link: '/portfolio/wedding' },
              { image: '/brand.jpg', title: 'Brand Campaign', category: 'Corporate', link: '/portfolio/corporate' },
            ].map((work, index) => (
              <motion.div key={index} variants={scaleIn}>
                <Link href={work.link}>
                  <div className="group relative overflow-hidden rounded-2xl aspect-[4/3]">
                    <Image
                      src={work.image}
                      alt={work.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute inset-0 flex flex-col justify-end p-8">
                      <span className="inline-block px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full mb-3 w-fit">
                        {work.category}
                      </span>
                      <h3 className="text-2xl font-bold text-white mb-2 group-hover:translate-y-0 translate-y-2 transition-transform">
                        {work.title}
                      </h3>
                      <div className="flex items-center text-white opacity-0 group-hover:opacity-100 transition-opacity">
                        View Project
                        <ArrowRight className="ml-2 w-5 h-5" />
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
            className="text-center mt-12"
          >
            <Link href="/portfolio">
              <Button
                size="lg"
                className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6 text-base font-semibold shadow-lg"
              >
                Explore Full Portfolio
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.div variants={fadeInUp} className="inline-block mb-4">
              <span className="px-4 py-2 bg-teal-50 text-teal-600 rounded-full text-sm font-semibold flex items-center gap-2 w-fit mx-auto">
                <Award className="w-4 h-4" />
                Client Reviews
              </span>
            </motion.div>
            <motion.h2
              variants={fadeInUp}
              className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4"
            >
              What Clients Say
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-gray-600 max-w-2xl mx-auto"
            >
              Hear from those who trusted us with their special moments
            </motion.p>
          </motion.div>

          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-teal-500 border-t-transparent"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <Card className="max-w-md mx-auto shadow-lg">
                <CardContent className="p-8">
                  <p className="text-red-600 mb-4">{error}</p>
                  <Button 
                    onClick={fetchReviews}
                    className="bg-teal-500 hover:bg-teal-600 text-white"
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
              <Card className="max-w-2xl mx-auto shadow-lg border-0">
                <CardContent className="p-12 text-center">
                  <div className="w-16 h-16 bg-teal-50 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Star className="w-8 h-8 text-teal-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-3">
                    Be the First to Review
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Share your experience with Brain Works Studio Africa!
                  </p>
                  <Link href="/reviews/submit">
                    <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full px-8 py-6">
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
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {reviews.slice(0, 6).map((review, index) => (
                  <motion.div key={review.id} variants={scaleIn}>
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white">
                      <CardHeader className="pb-4">
                        <div className="flex items-center gap-4">
                          {review.clientImage ? (
                            <Image
                              src={review.clientImage}
                              alt={review.clientName}
                              width={56}
                              height={56}
                              className="rounded-full object-cover"
                              onError={(e) => {
                                e.currentTarget.src = '/images/profile-placeholder.jpg';
                              }}
                            />
                          ) : (
                            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xl">
                                {review.clientName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <CardTitle className="text-lg font-bold text-slate-900 truncate">
                              {review.clientName}
                            </CardTitle>
                            <p className="text-sm text-gray-500 truncate">{review.serviceType}</p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-1 mb-4">
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
                        <p className="text-gray-700 leading-relaxed mb-4">
                          &ldquo;{review.reviewText}&rdquo;
                        </p>
                        {review.adminResponse && (
                          <div className="p-4 bg-slate-50 rounded-lg border-l-4 border-teal-500">
                            <p className="text-xs font-semibold text-teal-600 mb-2">
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
                  className="text-center mt-12"
                >
                  <p className="text-gray-600 mb-4">
                    Showing 6 of {reviews.length} testimonials
                  </p>
                  <Link href="/reviews">
                    <Button className="bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-6">
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
      <section className="relative py-24 bg-gradient-to-br from-slate-900 via-slate-800 to-teal-900 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }} />
        </div>

        {/* Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#CB9D06]/20 rounded-full blur-3xl" />

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={staggerContainer}
          className="relative max-w-5xl mx-auto text-center px-4 sm:px-6 lg:px-8"
        >
          <motion.div variants={fadeInUp} className="inline-block mb-6">
            <span className="px-4 py-2 bg-white/10 backdrop-blur-sm text-white rounded-full text-sm font-semibold">
              Ready to Get Started?
            </span>
          </motion.div>

          <motion.h2
            variants={fadeInUp}
            className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6"
          >
            Let&rsquo;s Create Something
            <span className="block bg-gradient-to-r from-teal-400 to-[#CB9D06] bg-clip-text text-transparent">
              Extraordinary
            </span>
          </motion.h2>

          <motion.p
            variants={fadeInUp}
            className="text-xl text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Book your session today and let us turn your vision into stunning visual stories
          </motion.p>

          <motion.div
            variants={fadeInUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link href="/booking">
              <Button
                size="lg"
                className="group w-full sm:w-auto bg-white text-slate-900 hover:bg-gray-100 text-base font-semibold py-6 px-8 rounded-full shadow-xl"
              >
                Book a Session
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-transparent border-2 border-white/30 text-white hover:bg-white hover:text-slate-900 text-base font-semibold py-6 px-8 rounded-full backdrop-blur-sm"
              >
                Get in Touch
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </section>
    </Layout>
  );
}