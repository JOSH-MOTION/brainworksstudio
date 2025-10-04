'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import VideoPlayer from '@/components/VideoPlayer';
import Image from 'next/image';
import { PortfolioItem } from '@/types';
import { useRouter } from 'next/navigation';
import { Play } from 'lucide-react';

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

export default function VideographyPortfolio({ params }: { params: { category?: string } }) {
  const router = useRouter();
  const category = params.category || 'all';
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Client-side redirect for missing category
  useEffect(() => {
    if (!params.category) {
      console.warn('No category provided, redirecting to /videography/all');
      router.push('/videography/all');
    }
  }, [params.category, router]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch(`/api/portfolio?type=videography&category=${encodeURIComponent(category)}`);
        if (!response.ok) throw new Error(`Failed to fetch portfolio items: ${response.statusText}`);
        const data = await response.json();
        console.log('Fetched videography items:', data);
        if (!Array.isArray(data)) {
          console.error('API returned non-array data:', data);
          throw new Error('Invalid data format from API');
        }
        setItems(data);
      } catch (err: any) {
        console.error('Fetch failed:', err.message);
        setError('Failed to load portfolio items. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [category]);

  // Skip rendering during SSR if no category (handled by client-side redirect)
  if (!params.category && typeof window === 'undefined') {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-[80vh] sm:min-h-screen flex items-center justify-center bg-teal-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 sm:h-16 sm:w-16 border-b-2 border-coral-500 mx-auto"></div>
            <p className="mt-4 text-sm text-teal-900">Loading...</p>
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
            src={`/images/${category}-video-hero.jpg`}
            alt={`${category} Hero`}
            fill
            sizes="100vw"
            className="object-cover"
            priority
            onError={(e) => {
              console.error(`Failed to load hero image: /images/${category}-video-hero.jpg`);
              e.currentTarget.src = '/images/video-hero-placeholder.jpg';
            }}
          />
          <div className="absolute inset-0 bg-teal-900/50"></div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 text-center">
          <motion.h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight capitalize text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {category.replace(/-/g, ' ')} Videography
          </motion.h1>
          <motion.p
            className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-xl sm:max-w-3xl mx-auto opacity-90 text-white"
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
        className="py-16 sm:py-20 bg-teal-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-teal-900 text-sm sm:text-base">No videos found in this category.</p>
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
                        console.log(`Opening video: ${item.videoUrl}`);
                        setSelectedVideo(item.videoUrl);
                      } else {
                        console.warn(`No videoUrl for ${item.title}, falling back to imageUrls[0]`);
                        if (item.imageUrls.length > 0) {
                          setSelectedVideo(item.imageUrls[0]);
                        } else {
                          console.error(`No videoUrl or imageUrls for ${item.title}`);
                          setError(`No media available for ${item.title}`);
                        }
                      }
                    }}
                  >
                    <Image
                      src={item.imageUrls[0] || item.videoUrl || '/video-placeholder.jpg'}
                      alt={item.title}
                      width={400}
                      height={300}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="object-cover w-full h-48 sm:h-64 group-hover:scale-105 transition-transform duration-300"
                      onError={(e) => {
                        console.error(`Failed to load thumbnail for ${item.title}: ${item.imageUrls[0] || item.videoUrl}`);
                        e.currentTarget.src = '/video-placeholder.jpg';
                      }}
                    />
                    {item.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-teal-900/50">
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