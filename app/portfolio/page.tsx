'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PortfolioItem } from '@/types';
import { Filter, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, selectedCategory, selectedTag]);

  const fetchPortfolioItems = async () => {
    try {
      console.log('Fetching portfolio items from /api/portfolio');
      const response = await fetch('/api/portfolio');
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch portfolio items');
      }
      const data = await response.json();
      console.log('Portfolio items fetched:', data);
      setPortfolioItems(data);
    } catch (error: any) {
      console.error('Error fetching portfolio items:', error);
      setError('Failed to load portfolio. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = portfolioItems;
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    if (selectedTag !== 'all') {
      filtered = filtered.filter((item) => item.tags.includes(selectedTag));
    }
    setFilteredItems(filtered);
  };

  const categories = ['all', ...Array.from(new Set(portfolioItems.map((item) => item.category)))];
  const tags = ['all', ...Array.from(new Set(portfolioItems.flatMap((item) => item.tags)))];

  if (error) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex items-center justify-center bg-gray-100"
        >
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">{error}</p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                onClick={fetchPortfolioItems}
                className="border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white transition-colors rounded-full px-6 py-2"
              >
                Retry
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </Layout>
    );
  }

  if (loading) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex items-center justify-center bg-gray-100"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="rounded-full h-16 w-16 border-t-2 border-teal-500 mx-auto"
            />
            <p className="mt-4 text-[#001F44] text-lg font-medium">Loading portfolio...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-gray-100"
      >
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-[#001F44] mb-4 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Portfolio
          </motion.h1>
          <motion.p
            className="text-lg text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            Discover our collection of stunning photography and videography work.
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-12 items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#001F44]" />
            <span className="font-medium text-[#001F44]">Filters:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white border-teal-200 focus:ring-teal-500 rounded-full shadow-sm">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[180px] bg-white border-teal-200 focus:ring-teal-500 rounded-full shadow-sm">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              {tags.map((tag) => (
                <SelectItem key={tag} value={tag}>
                  {tag === 'all' ? 'All Tags' : tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="outline"
              className="border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white transition-colors rounded-full px-6 py-2 shadow-sm"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]"
          style={{ gridTemplateRows: 'masonry' }}
          variants={sectionVariants}
        >
          {filteredItems.map((item, index) => (
            <motion.div
              key={item.id}
              custom={index}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
            >
              <Link href={`/portfolio/${item.id}`}>
                <Card className="group cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-2xl transition-all duration-300 bg-white rounded-xl">
                  <div className="relative w-full max-h-96 overflow-hidden">
                    <Image
                      src={
                        item.imageUrls && item.imageUrls.length > 0
                          ? item.imageUrls[0]
                          : item.videoUrl
                            ? '/video-placeholder.jpg'
                            : '/placeholder-image.jpg'
                      }
                      alt={item.title}
                      width={400}
                      height={300}
                      className="w-full h-auto object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        console.error(`Failed to load image for ${item.title}: ${item.imageUrls[0] || item.videoUrl}`);
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                      onLoad={() => console.log(`Successfully loaded image: ${item.imageUrls[0] || item.videoUrl}`)}
                    />
                    {item.videoUrl && (
                      <div className="absolute inset-0 flex items-center justify-center bg-[#001F44]/40">
                        <Play className="h-12 w-12 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg text-[#001F44] mb-2">{item.title}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      <Badge className="bg-coral-500 text-white hover:bg-coral-600 transition-colors">
                        {item.category}
                      </Badge>
                      <Badge className="bg-teal-100 text-[#001F44] hover:bg-teal-200 transition-colors">
                        {item.type}
                      </Badge>
                      {item.tags.slice(0, 2).map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-coral-500 text-coral-500 hover:bg-coral-100 transition-colors"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white transition-colors rounded-full"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-[#001F44] text-lg font-medium">No items found matching your filters.</p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                className="mt-4 border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white transition-colors rounded-full px-6 py-2"
                onClick={() => {
                  setSelectedCategory('all');
                  setSelectedTag('all');
                }}
              >
                Clear Filters
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.section>
    </Layout>
  );
}