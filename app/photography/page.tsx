'use client';

import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
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

// Animation variants for category cards
const cardVariants: Variants = {
  hidden: (i: number) => ({
    opacity: 0,
    scale: 0.8,
    x: i % 2 === 0 ? -50 : 50,
    rotateX: 20,
  }),
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    rotateX: 0,
    transition: { duration: 0.8, delay: i * 0.15, type: 'spring', stiffness: 90 },
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
  hover: { scale: 1.15, rotate: 5, transition: { duration: 0.3 } },
  tap: { scale: 0.9 },
};

// Animation variants for card overlay
const overlayVariants: Variants = {
  initial: { opacity: 0 },
  hover: { opacity: 0.5, transition: { duration: 0.3 } },
};

const categories = [
  { title: 'Corporate', image: '/Corperate1.jpg', slug: 'corporate' },
  { title: 'Event', image: '/event.jpg', slug: 'event' },
  { title: 'Portrait', image: '/potrait.jpg', slug: 'portrait' },
  { title: 'Fashion', image: '/images/fashion.jpg', slug: 'fashion' },
  { title: 'Product', image: '/images/product.jpg', slug: 'product' },
  { title: 'Travel & Landscape', image: '/images/travel.jpg', slug: 'travel-landscape' },
  { title: 'Documentary & Lifestyle', image: '/images/documentary.jpg', slug: 'documentary-lifestyle' },
  { title: 'Creative/Artistic', image: '/images/creative.jpg', slug: 'creative-artistic' },
  { title: 'Others', image: '/images/others.jpg', slug: 'others' },
];

export default function PhotographyCategories() {
  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[80vh] flex items-center justify-center text-white overflow-hidden"
      >
        {/* Background Image */}
        <motion.div
          initial={{ opacity: 0, scale: 1.2 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
          className="absolute inset-0"
        >
          <Image
            src="/hero-bg.jpg"
            alt="Photography Hero Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-teal-900 bg-opacity-60" />
        </motion.div>

        {/* Floating Images */}
        <motion.div
          custom="left"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-10 left-10 w-48 h-64 hidden lg:block"
        >
          <Image
            src="/photography-hero-img1.jpg"
            alt="Photography Hero Image 1"
            fill
            className="object-cover rounded-lg shadow-2xl"
          />
        </motion.div>
        <motion.div
          custom="right"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute bottom-20 right-10 w-56 h-72 hidden lg:block"
        >
          <Image
            src="/photography-hero-img2.jpg"
            alt="Photography Hero Image 2"
            fill
            className="object-cover rounded-lg shadow-2xl"
          />
        </motion.div>
        <motion.div
          custom="top"
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute top-20 right-1/3 w-40 h-56 hidden lg:block"
        >
          <Image
            src="/photography-hero-img3.jpg"
            alt="Photography Hero Image 3"
            fill
            className="object-cover rounded-lg shadow-2xl"
          />
        </motion.div>

        {/* Hero Content */}
        <motion.div
          variants={heroContentVariants}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
        >
          <motion.h1
            variants={heroChildVariants}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white drop-shadow-lg"
          >
            Discover Our Photography
          </motion.h1>
          <motion.p
            variants={heroChildVariants}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-100 drop-shadow-md"
          >
            From corporate elegance to creative artistry, explore our diverse photography services.
          </motion.p>
          <motion.div variants={heroChildVariants}>
            <Link href="/booking">
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  size="lg"
                  className="bg-coral-400 text-white hover:bg-coral-500 font-semibold shadow-md"
                >
                  Book a Session
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Category Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-24 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={heroChildVariants}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-teal-900">Our Categories</h2>
            <p className="text-lg text-gray-600 mt-4 max-w-xl mx-auto">
              Browse our specialized photography services tailored to your vision.
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                whileHover="hover"
                viewport={{ once: true }}
              >
                <Link href={`/photography/${category.slug}`}>
                  <div className="relative bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                    <motion.div
                      className="relative w-full h-48"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={category.image}
                        alt={`${category.title} preview`}
                        fill
                        className="object-cover"
                      />
                      <motion.div
                        className="absolute inset-0 bg-teal-500"
                        variants={overlayVariants}
                        initial="initial"
                        whileHover="hover"
                      >
                        <p className="text-white text-lg font-semibold flex items-center justify-center h-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          {category.title}
                        </p>
                      </motion.div>
                    </motion.div>
                    <div className="p-4">
                      <h3 className="text-xl font-semibold text-teal-900 text-center">
                        {category.title}
                      </h3>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}