// app/portfolio/page.tsx (key changes for Google Drive; full code for completeness)
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card'; // Added CardFooter for button
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PortfolioItem } from '@/types';
import { Filter, Play, X, ExternalLink } from 'lucide-react'; // Added ExternalLink
import Image from 'next/image';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: 'easeOut',
    },
  },
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

const lightboxVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

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
      console.log('Portfolio items fetched:', data.length);
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

  const openLightbox = (item: PortfolioItem) => {
    setSelectedItem(item);
    setLightboxOpen(true);
  };

  // New: Generate Google Drive thumbnail URL from folder ID (pick first image or use a default)
  const getGoogleDriveThumbnail = (folderId: string) => {
    // Note: For simplicity, assume the folder has images; in production, use Google Drive API to list and pick one.
    // For now, use a placeholder or fetch via API. Example with a known file ID in folder.
    return `https://drive.google.com/thumbnail?id=${folderId}&sz=w500`; // Replace with actual file ID if needed
  };

  // New: Get Google Drive folder link
  const getGoogleDriveLink = (folderId: string) => {
    return `https://drive.google.com/drive/folders/${folderId}`;
  };

  // New: Handle "View More" for Google Drive
  const handleViewMore = (item: PortfolioItem) => {
    if (item.googleDriveFolderId) {
      window.open(getGoogleDriveLink(item.googleDriveFolderId), '_blank');
    } else {
      openLightbox(item); // Fallback to lightbox for Cloudinary
    }
  };

  if (error) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex items-center justify-center bg-white"
        >
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error}</p>
            <Button
              variant="outline"
              onClick={fetchPortfolioItems}
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
            >
              Retry
            </Button>
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
          className="min-h-screen flex items-center justify-center bg-white"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="rounded-full h-16 w-16 border-t-2 border-blue-600 mx-auto"
            />
            <p className="mt-4 text-gray-600 text-lg">Loading portfolio...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8"
      >
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1
            className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 tracking-tight"
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
            Explore our curated collection of stunning photography and videography work.
          </motion.p>
        </div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 mb-12 items-center justify-center"
        >
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-600" />
            <span className="font-medium text-gray-900">Filters:</span>
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px] bg-white border-blue-600 focus:ring-blue-600">
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
            <SelectTrigger className="w-[180px] bg-white border-blue-600 focus:ring-blue-600">
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
              className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white transition-colors"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag('all');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        </motion.div>

        {/* Portfolio Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
        >
          {filteredItems.map((item, index) => {
            const thumbnailUrl = item.googleDriveFolderId 
              ? getGoogleDriveThumbnail(item.googleDriveFolderId) 
              : item.imageUrl || '/placeholder-image.jpg';
            const isGoogleDrive = !!item.googleDriveFolderId;

            return (
              <motion.div
                key={item.id}
                custom={index}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{ scale: 1.03, transition: { duration: 0.2 } }}
              >
                <Card
                  className="group cursor-pointer overflow-hidden border-none shadow-lg hover:shadow-xl transition-all duration-300 bg-white"
                  onClick={() => handleViewMore(item)}
                >
                  <CardContent className="p-0 relative">
                    <div className="relative aspect-[4/3] overflow-hidden">
                      <Image
                        src={thumbnailUrl}
                        alt={item.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {item.videoUrl && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                          initial={{ opacity: 0 }}
                          whileHover={{ opacity: 1 }}
                        >
                          <Play className="h-10 w-10 text-white" />
                        </motion.div>
                      )}
                      {isGoogleDrive && (
                        <div className="absolute top-2 right-2">
                          <Badge variant="secondary" className="bg-blue-500/80 text-white">
                            Google Drive
                          </Badge>
                        </div>
                      )}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                        initial={{ opacity: 0 }}
                        whileHover={{ opacity: 1 }}
                      >
                        <div className="absolute bottom-4 left-4 right-4 text-white">
                          <h3 className="font-semibold mb-1">{item.title}</h3>
                          <div className="flex flex-wrap gap-2">
                            <Badge className="bg-blue-600 text-white">{item.category}</Badge>
                            {item.tags.slice(0, 2).map((tag) => (
                              <Badge
                                key={tag}
                                variant="outline"
                                className="border-violet-500 text-violet-500"
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent card click
                        handleViewMore(item);
                      }}
                    >
                      {isGoogleDrive ? 'View More on Google Drive' : 'View Details'}
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {filteredItems.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12"
          >
            <p className="text-gray-500 text-lg">No items found matching your filters.</p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                className="mt-4 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white"
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

        {/* Lightbox Modal (for Cloudinary items only) */}
        <AnimatePresence>
          {lightboxOpen && selectedItem && !selectedItem.googleDriveFolderId && (
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent className="max-w-4xl max-h-[90vh] p-0 bg-white border-none shadow-2xl rounded-lg">
                <motion.div
                  variants={lightboxVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="relative"
                >
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-4 right-4 z-10 bg-violet-500/50 text-white hover:bg-violet-600"
                      onClick={() => setLightboxOpen(false)}
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </motion.div>
                  {selectedItem.videoUrl ? (
                    <video
                      src={selectedItem.videoUrl}
                      controls
                      className="w-full h-auto max-h-[70vh] rounded-t-lg"
                      autoPlay
                    />
                  ) : (
                    <Image
                      src={selectedItem.imageUrl || '/placeholder-image.jpg'}
                      alt={selectedItem.title}
                      width={800}
                      height={600}
                      className="w-full h-auto max-h-[70vh] object-contain rounded-t-lg"
                    />
                  )}
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedItem.title}</h2>
                    {selectedItem.caption && (
                      <p className="text-gray-600 mb-4">{selectedItem.caption}</p>
                    )}
                    <div className="flex flex-wrap gap-2">
                      <Badge className="bg-blue-600 text-white">{selectedItem.category}</Badge>
                      {selectedItem.tags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="outline"
                          className="border-violet-500 text-violet-500"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </motion.div>
    </Layout>
  );
}