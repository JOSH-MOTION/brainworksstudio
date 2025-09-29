'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import VideoPlayer from '@/components/VideoPlayer';
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

// Mock data with YouTube links (replace with your actual YouTube URLs)
const portfolioItems = {
  corporate: Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`, // Replace with actual video IDs
    thumbnail: `/images/corporate-video-${i + 1}.jpg`,
    alt: `Corporate video ${i + 1}`,
  })),
  event: Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`, // Replace with actual video IDs
    thumbnail: `/images/event-video-${i + 1}.jpg`,
    alt: `Event video ${i + 1}`,
  })),
  'music-videos': Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    thumbnail: `/images/music-video-${i + 1}.jpg`,
    alt: `Music video ${i + 1}`,
  })),
  'commercials-adverts': Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    thumbnail: `/images/commercial-${i + 1}.jpg`,
    alt: `Commercial video ${i + 1}`,
  })),
  documentary: Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    thumbnail: `/images/documentary-video-${i + 1}.jpg`,
    alt: `Documentary video ${i + 1}`,
  })),
  'short-films-creative': Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    thumbnail: `/images/short-film-${i + 1}.jpg`,
    alt: `Short film ${i + 1}`,
  })),
  promotional: Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    thumbnail: `/images/promotional-${i + 1}.jpg`,
    alt: `Promotional video ${i + 1}`,
  })),
  'social-media': Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    thumbnail: `/images/social-media-${i + 1}.jpg`,
    alt: `Social media video ${i + 1}`,
  })),
  others: Array(6).fill(null).map((_, i) => ({
    id: i,
    youtubeUrl: `https://www.youtube.com/embed/dQw4w9WgXcQ`,
    thumbnail: `/images/others-video-${i + 1}.jpg`,
    alt: `Other video ${i + 1}`,
  })),
};

export default function VideographyPortfolio({ params }: { params: { category: string } }) {
  const { category } = params;
  const items = portfolioItems[category as keyof typeof portfolioItems] || [];
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

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
            src={`/images/${category}-video-hero.jpg`}
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
            {category.replace('-', ' ')} Videography
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore our captivating portfolio of {category.replace('-', ' ')} videography.
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
                onClick={() => setSelectedVideo(item.youtubeUrl)}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <Image
                    src={item.thumbnail}
                    alt={item.alt}
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                    <span className="text-white text-lg font-semibold">Play</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
      {selectedVideo && (
        <VideoPlayer videoSrc={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </Layout>
  );
}