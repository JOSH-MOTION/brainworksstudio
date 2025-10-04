'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { PortfolioItem } from '@/types';
import { useRouter } from 'next/navigation';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

export default function VideographyPortfolio({ params }: { params: { category?: string } }) {
  const router = useRouter();
  const category = params.category || 'all'; // Fallback to 'all' if category is undefined
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/portfolio?type=videography&category=${encodeURIComponent(category)}`);
        if (!response.ok) throw new Error('Failed to fetch portfolio items');
        const data = await response.json();
        console.log('Fetched videography items:', data);
        setItems(data);
      } catch (err: any) {
        console.error('Fetch failed:', err);
        setError('Failed to load portfolio items.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  if (!params.category) {
    console.warn('No category provided, redirecting to /videography/all');
    router.push('/videography/all');
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-coral-500 mx-auto"></div>
            <p className="mt-4 text-sm text-teal-900">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
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
            onError={() => `/images/video-hero-placeholder.jpg`}
          />
          <div className="absolute inset-0 bg-teal-900 bg-opacity-50"></div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 tracking-tight capitalize text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {category.replace(/-/g, ' ')} Videography
          </motion.h1>
          <motion.p
            className="text-sm md:text-base mb-8 max-w-3xl mx-auto opacity-90 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore our captivating portfolio of {category.replace(/-/g, ' ')} videography.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-20 bg-teal-50"
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
                onClick={() => {
                  if (item.videoUrl) {
                    setSelectedVideo(item.videoUrl);
                  } else if (item.imageUrls.length > 0) {
                    console.warn(`No videoUrl for ${item.title}, falling back to imageUrls[0]`);
                    setSelectedVideo(item.imageUrls[0]);
                  }
                }}
              >
                <div className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300">
                  <Image
                    src={item.imageUrls[0] || '/video-placeholder.jpg'}
                    alt={item.title}
                    width={400}
                    height={300}
                    className="object-cover w-full h-64 group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      console.error(`Failed to load thumbnail for ${item.title}: ${item.imageUrls[0]}`);
                      e.currentTarget.src = '/video-placeholder.jpg';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50">
                    <span className="text-white text-sm font-semibold">Play</span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-sm">{item.title}</h3>
                    <p className="text-xs">{item.clientName}</p>
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