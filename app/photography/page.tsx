'use client';

import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: 'easeOut' as const }
  },
};

const heroImageVariants: Variants = {
  hidden: { opacity: 0, scale: 1.1 },
  visible: { 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 1, ease: 'easeOut' as const }
  },
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
  { title: 'Corporate', image: '/images/corporate.jpg', slug: 'corporate' },
  { title: 'Event', image: '/images/event.jpg', slug: 'event' },
  { title: 'Portrait', image: '/images/portrait.jpg', slug: 'portrait' },
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
        className="relative min-h-[60vh] flex items-center justify-center text-white"
      >
        <motion.div
          variants={heroImageVariants}
          initial="hidden"
          animate="visible"
          className="absolute inset-0"
        >
          <Image
            src="/Pic.jpeg"
            alt="Photography Hero"
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
            Photography Categories
          </motion.h1>
          <motion.p
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto opacity-90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Explore our diverse range of photography services, from corporate to creative.
          </motion.p>
        </div>
      </motion.section>

      {/* Category Grid */}
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
                <Link href={`/photography/${category.slug}`}>
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
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}