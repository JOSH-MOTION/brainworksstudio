// app/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowRight, Camera, Video, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeInOut', staggerChildren: 0.2 },
  },
};

// Animation variants for hero content
const heroContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, rotate: -10 },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: { duration: 1, type: 'spring', stiffness: 120, damping: 15 },
  },
};

// Animation variants for hero children
const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut' },
  },
};

// Animation variants for hero images
const heroImageVariants: Variants = {
  hidden: (direction: string) => ({
    opacity: 0,
    x: direction === 'left' ? -100 : direction === 'right' ? 100 : 0,
    y: direction === 'top' ? -100 : direction === 'bottom' ? 100 : 0,
    rotate: direction === 'left' || direction === 'right' ? 15 : 0,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    rotate: 0,
    transition: { duration: 1.2, type: 'spring', stiffness: 100, damping: 20 },
  },
};

// Animation variants for cards
const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: 30 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.8, delay: i * 0.2, type: 'spring', stiffness: 90 },
  }),
  hover: {
    scale: 1.05,
    y: -10,
    transition: { duration: 0.4, type: 'spring', stiffness: 130 },
  },
};

// Animation variants for buttons
const buttonVariants: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.6, ease: 'easeOut' } },
  hover: { scale: 1.1, rotate: 5, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

// Animation variants for featured work images
const imageVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    x: i % 2 === 0 ? -50 : 50,
    scale: 1.1,
  }),
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 1, ease: 'easeInOut', type: 'spring', stiffness: 80 },
  },
  hover: {
    scale: 1.05,
    transition: { duration: 0.5, type: 'spring', stiffness: 110 },
  },
};

// Animation variants for CTA section
const ctaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, type: 'spring', stiffness: 100, damping: 15 },
  },
};

// Animation variants for CTA children
const ctaChildVariants: Variants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.2, ease: 'easeOut' },
  }),
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

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews?approved=true');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to fetch reviews:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[80vh] sm:min-h-screen flex items-center justify-center text-white overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/hero-bg.jpg"
            alt="Hero Background"
            fill
            sizes="100vw"
            className="object-cover"
            priority
            onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
          />
          <div className="absolute inset-0 bg-teal-900/50" />
        </motion.div>

        <motion.div
          custom="left"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-4 left-4 w-24 h-32 sm:w-32 sm:h-40 lg:w-48 lg:h-64 hidden md:block"
        >
          <Image
            src="/Pic1.jpeg"
            alt="Hero Image 1"
            fill
            sizes="(max-width: 768px) 96px, (max-width: 1024px) 128px, 192px"
            className="object-cover rounded-lg shadow-2xl"
          />
        </motion.div>
        <motion.div
          custom="right"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-4 right-4 w-28 h-36 sm:w-36 sm:h-44 lg:w-56 lg:h-72 hidden md:block"
        >
          <Image
            src="/Pic.jpeg"
            alt="Hero Image 2"
            fill
            sizes="(max-width: 768px) 112px, (max-width: 1024px) 144px, 224px"
            className="object-cover rounded-lg shadow-2xl"
          />
        </motion.div>
        <motion.div
          custom="top"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-16 right-8 w-20 h-28 sm:w-28 sm:h-36 lg:w-40 lg:h-56 hidden md:block"
        >
          <Image
            src="/vid.jpeg"
            alt="Hero Image 3"
            fill
            sizes="(max-width: 768px) 80px, (max-width: 1024px) 112px, 160px"
            className="object-cover rounded-lg shadow-2xl"
          />
        </motion.div>

        <motion.div
          variants={heroContentVariants}
          className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
        >
          <motion.h1
            variants={heroChildVariants}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-4 sm:mb-6"
          >
            Immortalize Your Moments
          </motion.h1>
          <motion.p
            variants={heroChildVariants}
            className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 max-w-xl sm:max-w-2xl mx-auto opacity-80"
          >
            Transform your story into breathtaking visuals with our expert photography and videography.
          </motion.p>
          <motion.div
            variants={heroChildVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link href="/portfolio">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-teal-500 text-white hover:bg-teal-600 text-sm sm:text-base font-semibold py-3 sm:py-4 px-6 sm:px-8"
                >
                  Discover Our Work
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </motion.div>
            </Link>
            <Link href="/booking">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-teal-500 text-sm sm:text-base font-semibold py-3 sm:py-4 px-6 sm:px-8"
                >
                  Start Your Journey
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Services Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16 sm:py-20 lg:py-24 bg-teal-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={heroChildVariants}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-teal-900">Our Craft</h2>
            <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4 max-w-xl mx-auto">
              Tailored services to capture your vision with creativity and precision.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {[
              {
                icon: Camera,
                title: 'Photography',
                description: 'Stunning images that freeze your moments in time.',
                link: '/photography',
                image: '/Pic1.jpeg',
              },
              {
                icon: Video,
                title: 'Videography',
                description: 'Cinematic videos that bring your story to life.',
                link: '/videography',
                image: '/Pic3.jpeg',
              },
              {
                icon: Star,
                title: 'Custom Creations',
                description: 'Unique projects crafted for your specific needs.',
                link: '/custom',
                image: '/service-custom.jpg',
              },
            ].map((service, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                variants={cardVariants}
              >
                <Link href={service.link}>
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300">
                    <motion.div
                      className="relative w-full h-32 sm:h-40 mb-4"
                      whileHover={{ scale: 1.03 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Image
                        src={service.image}
                        alt={`${service.title} preview`}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover rounded-md"
                        onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                      />
                    </motion.div>
                    <motion.div
                      className="flex items-center justify-center mb-3 sm:mb-4"
                      whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                    >
                      <service.icon className="h-10 w-10 sm:h-12 sm:w-12 text-teal-500" />
                    </motion.div>
                    <h3 className="text-lg sm:text-xl font-semibold text-teal-900 text-center">
                      {service.title}
                    </h3>
                    <p className="text-sm sm:text-base text-gray-600 text-center mt-2">
                      {service.description}
                    </p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Featured Work Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16 sm:py-20 lg:py-24 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={heroChildVariants}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-teal-900">Our Masterpieces</h2>
            <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4 max-w-xl mx-auto">
              A glimpse into our portfolio of unforgettable moments.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {[
              { image: '/image.jpg', title: 'Timeless Wedding', link: '/portfolio/wedding' },
              { image: '/brand.jpg', title: 'Brand Campaign', link: '/portfolio/corporate' },
            ].map((work, index) => (
              <motion.div
                key={index}
                custom={index}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
                variants={imageVariants}
              >
                <Link href={work.link}>
                  <div className="relative group overflow-hidden rounded-xl">
                    <Image
                      src={work.image}
                      alt={work.title}
                      width={600}
                      height={400}
                      sizes="(max-width: 640px) 100vw, 50vw"
                      className="object-cover w-full h-64 sm:h-80"
                      onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
                    />
                    <motion.div
                      className="absolute inset-0 bg-teal-500/60 flex items-center justify-center"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <p className="text-white text-base sm:text-lg font-semibold">{work.title}</p>
                    </motion.div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          <motion.div
            variants={heroChildVariants}
            className="text-center mt-6 sm:mt-8"
          >
            <Link href="/portfolio">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button className="bg-teal-500 text-white hover:bg-teal-600 text-sm sm:text-base py-3 sm:py-4 px-6 sm:px-8">
                  Explore Full Portfolio
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Testimonials Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16 sm:py-20 lg:py-24 bg-teal-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={heroChildVariants}
            className="text-center mb-8 sm:mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-teal-900">Client Testimonials</h2>
            <p className="text-base sm:text-lg text-gray-600 mt-3 sm:mt-4 max-w-xl mx-auto">
              Hear what our clients have to say about their experience with us.
            </p>
          </motion.div>
          {loading ? (
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-500 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading testimonials...</p>
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-center text-gray-600">No testimonials available.</p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {reviews.map((review, index) => (
                <motion.div
                  key={review.id}
                  custom={index}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  variants={cardVariants}
                >
                  <Card className="border-gray-200">
                    <CardHeader>
                      <div className="flex items-center gap-4">
                        {review.clientImage ? (
                          <Image
                            src={review.clientImage}
                            alt={review.clientName}
                            width={50}
                            height={50}
                            className="rounded-full object-cover"
                            onError={(e) => (e.currentTarget.src = '/images/profile-placeholder.jpg')}
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-teal-100 flex items-center justify-center">
                            <span className="text-teal-500 font-semibold text-lg">
                              {review.clientName.charAt(0)}
                            </span>
                          </div>
                        )}
                        <div>
                          <CardTitle className="text-lg text-teal-900">{review.clientName}</CardTitle>
                          <p className="text-sm text-gray-600">{review.serviceType}</p>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center gap-1 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-sm text-gray-700 mb-4">{review.reviewText}</p>
                      {review.adminResponse && (
                        <div className="p-3 bg-teal-50 border border-teal-200 rounded-md">
                          <p className="text-sm font-semibold text-teal-500">Our Response:</p>
                          <p className="text-sm text-gray-700">{review.adminResponse}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="relative py-16 sm:py-20 lg:py-24 bg-gradient-to-br from-teal-600 to-teal-500 text-white overflow-hidden"
      >
        <motion.div
          initial={{ opacity: 0, scale: 1.3 }}
          animate={{ opacity: 0.2, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/cta-bg.jpg"
            alt="CTA Background"
            fill
            sizes="100vw"
            className="object-cover opacity-20"
            onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
          />
        </motion.div>

        <motion.div
          custom="left"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-4 left-4 w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 hidden md:block"
        >
          <Image
            src="/Pic3.jpeg"
            alt="CTA Decor 1"
            fill
            sizes="(max-width: 768px) 80px, (max-width: 1024px) 96px, 128px"
            className="object-cover rounded-full shadow-lg"
          />
        </motion.div>
        <motion.div
          custom="right"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-4 right-4 w-24 h-24 sm:w-28 sm:h-28 lg:w-40 lg:h-40 hidden md:block"
        >
          <Image
            src="/wed.jpeg"
            alt="CTA Decor 2"
            fill
            sizes="(max-width: 768px) 96px, (max-width: 1024px) 112px, 160px"
            className="object-cover rounded-full shadow-lg"
          />
        </motion.div>

        <motion.div
          variants={ctaVariants}
          className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8 z-10"
        >
          <motion.h2
            custom={0}
            variants={ctaChildVariants}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-6 drop-shadow-lg"
          >
            Begin Your Visual Story
          </motion.h2>
          <motion.p
            custom={1}
            variants={ctaChildVariants}
            className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8 text-gray-100 drop-shadow-md"
          >
            Let’s craft something extraordinary. Book your session or reach out now.
          </motion.p>
          <motion.div
            custom={2}
            variants={ctaChildVariants}
            className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-6"
          >
            <Link href="/booking">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  className="w-full sm:w-auto bg-teal-900 text-white hover:bg-teal-800 text-sm sm:text-base font-semibold py-3 sm:py-4 px-6 sm:px-8 shadow-md"
                >
                  Book a Session
                </Button>
              </motion.div>
            </Link>
            <Link href="/contact">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto border-white text-white hover:bg-white hover:text-teal-500 text-sm sm:text-base font-semibold py-3 sm:py-4 px-6 sm:px-8 shadow-md"
                >
                  Get in Touch
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>
    </Layout>
  );
}