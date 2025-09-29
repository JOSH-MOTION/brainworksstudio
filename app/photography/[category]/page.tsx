'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Lightbox from '@/components/Lightbox';
import Image from 'next/image';

const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const heroImageVariants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' as const } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

// Mock data (replace with CMS or API)
const portfolioItems = {
  corporate: Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/corporate-${i + 1}.jpg`,
    alt: `Corporate photo ${i + 1}`,
  })),
  event: Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/event-${i + 1}.jpg`,
    alt: `Event photo ${i + 1}`,
  })),
  portrait: Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/portrait-${i + 1}.jpg`,
    alt: `Portrait photo ${i + 1}`,
  })),
  fashion: Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/fashion-${i + 1}.jpg`,
    alt: `Fashion photo ${i + 1}`,
  })),
  product: Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/product-${i + 1}.jpg`,
    alt: `Product photo ${i + 1}`,
  })),
  'travel-landscape': Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/travel-${i + 1}.jpg`,
    alt: `Travel photo ${i + 1}`,
  })),
  'documentary-lifestyle': Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/documentary-${i + 1}.jpg`,
    alt: `Documentary photo ${i + 1}`,
  })),
  'creative-artistic': Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/creative-${i + 1}.jpg`,
    alt: `Creative photo ${i + 1}`,
  })),
  others: Array(6).fill(null).map((_, i) => ({
    id: i,
    src: `/images/others-${i + 1}.jpg`,
    alt: `Other photo ${i + 1}`,
  })),
};

export default function PhotographyPortfolio({ params }: { params: { category: string } }) {
  const { category } = params;
  const items = portfolioItems[category as keyof typeof portfolioItems] || [];
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[60vh] flex items-center justify-center text-white"
      >
        <motion.div
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <Image
            src={`/images/${category}-hero.jpg`}
            alt={`${category} Hero`}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 tracking-tight capitalize"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {category.replace('-', ' ')} Photography
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover our stunning portfolio of {category.replace('-', ' ')} photography.
          </motion.p>
        </div>
      </motion.section>

      {/* Portfolio Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="group cursor-pointer"
                onClick={() => setSelectedImage(item.src)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {selectedImage && (
        <Lightbox image={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </Layout>
  );
}