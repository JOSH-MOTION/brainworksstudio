'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PortfolioItem } from '@/types';
import { Filter, Play, Camera, Video } from 'lucide-react';
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
  const [selectedType, setSelectedType] = useState<'all' | 'photography' | 'videography'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, selectedType, selectedCategory, selectedTag]);

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
    
    // Filter by type
    if (selectedType !== 'all') {
      filtered = filtered.filter((item) => item.type === selectedType);
    }
    
    // Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    
    // Filter by tag
    if (selectedTag !== 'all') {
      filtered = filtered.filter((item) => item.tags.includes(selectedTag));
    }
    
    setFilteredItems(filtered);
  };

  // Get unique categories based on selected type
  const getCategories = () => {
    const relevantItems = selectedType === 'all' 
      ? portfolioItems 
      : portfolioItems.filter(item => item.type === selectedType);
    return ['all', ...Array.from(new Set(relevantItems.map((item) => item.category).filter(Boolean)))];
  };

  const categories = getCategories();
  const tags = ['all', ...Array.from(new Set(portfolioItems.flatMap((item) => item.tags)))];

  // Count items by type
  const photographyCount = portfolioItems.filter(item => item.type === 'photography').length;
  const videographyCount = portfolioItems.filter(item => item.type === 'videography').length;

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
        {/* Header */}
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

        {/* Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex justify-center mb-8"
        >
          <div className="inline-flex bg-white rounded-full p-1 shadow-md">
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedCategory('all');
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedType === 'all'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              All
              <span className="text-xs opacity-75">({portfolioItems.length})</span>
            </button>
            <button
              onClick={() => {
                setSelectedType('photography');
                setSelectedCategory('all');
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedType === 'photography'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              <Camera className="h-4 w-4" />
              Photography
              <span className="text-xs opacity-75">({photographyCount})</span>
            </button>
            <button
              onClick={() => {
                setSelectedType('videography');
                setSelectedCategory('all');
              }}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 flex items-center gap-2 ${
                selectedType === 'videography'
                  ? 'bg-teal-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-teal-600'
              }`}
            >
              <Video className="h-4 w-4" />
              Videography
              <span className="text-xs opacity-75">({videographyCount})</span>
            </button>
          </div>
        </motion.div>

        {/* Category and Tag Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-8 items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-[#001F44]" />
            <span className="font-medium text-[#001F44]">Refine by:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px] bg-white border-teal-200 focus:ring-teal-500 rounded-full shadow-sm">
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

          {tags.length > 1 && (
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
          )}

          {(selectedType !== 'all' || selectedCategory !== 'all' || selectedTag !== 'all') && (
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white transition-colors rounded-full px-6 py-2 shadow-sm"
                onClick={() => {
                  setSelectedType('all');
                  setSelectedCategory('all');
                  setSelectedTag('all');
                }}
              >
                Clear All
              </Button>
            </motion.div>
          )}
        </motion.div>

        {/* Results count */}
        <div className="text-center mb-8">
          <p className="text-gray-600">
            Showing <span className="font-semibold text-teal-600">{filteredItems.length}</span> {filteredItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-[minmax(200px,auto)]"
          style={{ gridTemplateRows: 'masonry' }}
          variants={sectionVariants}
        >
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => (
              <motion.div
                key={item.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
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
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                      {item.videoUrl && (
                        <div className="absolute inset-0 flex items-center justify-center bg-[#001F44]/40">
                          <Play className="h-12 w-12 text-white" />
                        </div>
                      )}
                      {item.featured && (
                        <div className="absolute top-3 left-3">
                          <Badge className="bg-amber-400 text-black">Featured</Badge>
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
                          {item.type === 'photography' ? '📷 Photo' : '🎥 Video'}
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
          </AnimatePresence>
        </motion.div>

        {/* Empty State */}
        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <div className="mb-4">
              {selectedType === 'photography' ? (
                <Camera className="h-16 w-16 text-gray-400 mx-auto" />
              ) : selectedType === 'videography' ? (
                <Video className="h-16 w-16 text-gray-400 mx-auto" />
              ) : (
                <Filter className="h-16 w-16 text-gray-400 mx-auto" />
              )}
            </div>
            <p className="text-[#001F44] text-lg font-medium mb-2">No items found</p>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                className="border-teal-600 text-teal-600 hover:bg-teal-500 hover:text-white transition-colors rounded-full px-6 py-2"
                onClick={() => {
                  setSelectedType('all');
                  setSelectedCategory('all');
                  setSelectedTag('all');
                }}
              >
                Clear All Filters
              </Button>
            </motion.div>
          </motion.div>
        )}
      </motion.section>
    </Layout>
  );
}