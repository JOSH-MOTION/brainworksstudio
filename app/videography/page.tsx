'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import VideoPlayer from '@/components/VideoPlayer';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' as const } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' as const },
  }),
};

const categories = [
  {
    title: 'Corporate',
    image: '/images/corporate-video.jpg',
    slug: 'corporate',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-1',
  },
  {
    title: 'Event',
    image: '/images/event-video.jpg',
    slug: 'event',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-2',
  },
  {
    title: 'Music Videos',
    image: '/images/music-video.jpg',
    slug: 'music-videos',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-3',
  },
  {
    title: 'Commercials & Adverts',
    image: '/images/commercial.jpg',
    slug: 'commercials-adverts',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-4',
  },
  {
    title: 'Documentary',
    image: '/images/documentary-video.jpg',
    slug: 'documentary',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-5',
  },
  {
    title: 'Short Films / Creative Projects',
    image: '/images/short-film.jpg',
    slug: 'short-films-creative',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-6',
  },
  {
    title: 'Promotional',
    image: '/images/promotional.jpg',
    slug: 'promotional',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-7',
  },
  {
    title: 'Social Media',
    image: '/images/social-media.jpg',
    slug: 'social-media',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-8',
  },
  {
    title: 'Others',
    image: '/images/others-video.jpg',
    slug: 'others',
    youtubeUrl: 'https://www.youtube.com/embed/your-video-id-9',
  },
];

export default function VideographyCategories() {
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
            src="/images/videography-hero.jpg"
            alt="Videography Hero"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </motion.div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <motion.h1
            className="text-3xl md:text-5xl font-bold mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            Videography Categories
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Discover our cinematic videography services, from corporate to creative projects.
          </motion.p>
        </div>
      </motion.section>

      {/* Category Grid with Video Previews */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-20 bg-gray-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.slug}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="relative">
                  <Link href={`/videography/${category.slug}`}>
                    <Card className="group border-none shadow-md hover:shadow-xl transition-all duration-300 bg-white">
                      <CardHeader className="p-0">
                        <Image
                          src={category.image}
                          alt={`${category.title} preview`}
                          width={400}
                          height={300}
                          className="object-cover w-full h-48 group-hover:scale-105 transition-transform duration-300"
                        />
                      </CardHeader>
                      <CardContent className="p-4">
                        <CardTitle className="text-xl text-gray-900">{category.title}</CardTitle>
                      </CardContent>
                    </Card>
                  </Link>
                  <div
                    className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black bg-opacity-50 cursor-pointer"
                    onClick={() => setSelectedVideo(category.youtubeUrl)}
                  >
                    <span className="text-white text-lg font-semibold">Play Preview</span>
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