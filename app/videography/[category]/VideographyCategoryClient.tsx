'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { PortfolioItem } from '@/types';
import { Play } from 'lucide-react';
import { categorySlug, getCategoryLabel } from '@/lib/videography-categories';

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
  hover: { scale: 1.05, transition: { duration: 0.3 } },
};

export default function VideographyCategoryClient({ category }: { category: string }) {
  const displayCategory = getCategoryLabel(category);
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('/api/portfolio?type=videography');
        if (!response.ok) throw new Error(`Failed to fetch portfolio items: ${response.statusText}`);
        const data: PortfolioItem[] = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid data format from API');
        setItems(
          category === 'all' ? data : data.filter((item) => categorySlug(item.category) === category)
        );
      } catch (err: any) {
        console.error('Fetch failed:', err.message);
        setError('Failed to load portfolio items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] sm:min-h-screen flex items-center justify-center bg-teal-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-coral-500 mx-auto"></div>
            <p className="mt-4 text-sm text-[#001F44]">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-[80vh] sm:min-h-screen flex items-center justify-center bg-teal-50">
          <p className="text-red-600 text-sm sm:text-base">{error}</p>
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
        className="relative min-h-[60vh] sm:min-h-[80vh] flex items-center justify-center text-white"
      >
        <motion.div
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <Image
            src="/hero/photography-brain.jpg"
            alt={`${displayCategory} Videography Hero`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-[#001F44]/50"></div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <motion.h1
            className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight capitalize text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {displayCategory} Videography
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl sm:max-w-3xl mx-auto opacity-90 text-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore our captivating portfolio of {displayCategory.toLowerCase()} videography in Accra, Ghana.
          </motion.p>
        </div>
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-16 sm:py-20 bg-teal-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-[#001F44] text-sm sm:text-base">No videos found in this category yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  whileInView="visible"
                  whileHover="hover"
                  viewport={{ once: true }}
                  className="group cursor-pointer"
                >
                  <div
                    className="relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                    onClick={() => {
                      if (item.videoUrl) {
                        setSelectedVideo(item.videoUrl);
                      } else if (item.imageUrls.length > 0) {
                        setSelectedVideo(item.imageUrls[0]);
                      } else {
                        setError(`No media available for ${item.title}`);
                      }
                    }}
                  >
                    <Image
                      src={item.imageUrls[0] || item.videoUrl || '/video-placeholder.jpg'}
                      alt={`${item.title} — ${item.category} videography by Brain Works Studio Africa, Accra, Ghana`}
                      width={400}
                      height={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-48 sm:h-64 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        e.currentTarget.src = '/video-placeholder.jpg';
                      }}
                    />
                    {item.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-[#001F44]/50">
                        <Play className="h-8 w-8 text-white" />
                      </div>
                    )}
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold text-sm sm:text-base truncate">{item.title}</h3>
                      <p className="text-xs sm:text-sm truncate">{item.clientName || 'Unknown Client'}</p>
                      {item.pin && (
                        <p className="text-xs text-coral-200">PIN Protected</p>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </motion.section>

      {selectedVideo && (
        <VideoPlayer videoSrc={selectedVideo} onClose={() => setSelectedVideo(null)} />
      )}
    </Layout>
  );
}
