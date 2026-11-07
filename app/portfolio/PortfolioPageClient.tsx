'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PortfolioItem } from '@/types';
import { Filter, Play, Camera, Video, Star, ArrowUpRight, X } from 'lucide-react';
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

const cardShadowVariants: Variants = {
  rest: { boxShadow: '0 8px 30px -14px rgba(0,31,68,0.35)' },
  hover: { boxShadow: '0 24px 48px -16px rgba(0,31,68,0.45)', transition: { duration: 0.4, ease: 'easeOut' } },
};

const cardImageVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.06, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
};

const cardRevealVariants: Variants = {
  rest: { opacity: 0, y: 6 },
  hover: { opacity: 1, y: 0, transition: { duration: 0.25, ease: 'easeOut' } },
};

const cardPlayVariants: Variants = {
  rest: { scale: 1 },
  hover: { scale: 1.1, transition: { duration: 0.3, ease: 'easeOut' } },
};

interface PortfolioPageClientProps {
  initialItems: PortfolioItem[];
}

export default function PortfolioPageClient({ initialItems }: PortfolioPageClientProps) {
  const [portfolioItems] = useState<PortfolioItem[]>(initialItems);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>(initialItems);
  // getPortfolioItems() already sorts featured-first, so the first item with
  // a photo is the strongest real image to use as the hero backdrop.
  const heroImage = portfolioItems.find((item) => item.imageUrls.length > 0)?.imageUrls[0];
  const [selectedType, setSelectedType] = useState<'all' | 'photography' | 'videography'>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  // Which card (if any) is playing its video inline, right in the grid.
  const [playingItemId, setPlayingItemId] = useState<string | null>(null);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, selectedType, selectedCategory, selectedTag]);

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

  return (
    <Layout>
      {/* Editorial hero — real featured work as the backdrop, not stock photography */}
      <section className="relative overflow-hidden bg-navy-950 text-white">
        {heroImage && (
          <div className="absolute inset-0">
            <Image
              src={heroImage}
              alt="Brain Works Studio Africa — selected work"
              fill
              sizes="100vw"
              priority
              className="object-cover opacity-50"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/70 to-navy-950/40" />
          </div>
        )}
        <div className="relative mx-auto max-w-5xl px-6 py-20 text-center sm:py-24">
          <motion.p
            className="mb-5 text-xs font-semibold uppercase tracking-[0.3em] text-gold-300"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Our Selected Work · 2019–{new Date().getFullYear()}
          </motion.p>
          <motion.h1
            className="font-serif text-4xl font-bold leading-[1.1] tracking-tight sm:text-6xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            Stories told through the lens.
          </motion.h1>
          <motion.p
            className="mx-auto mt-5 max-w-xl text-base text-white/70 sm:text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            Photography, film and live production for weddings, brands and events across Ghana.
          </motion.p>
        </div>
      </section>

      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="w-full bg-white py-12"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Type Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mb-8 flex justify-center overflow-x-auto px-4"
        >
          <div className="inline-flex flex-nowrap items-center gap-1 rounded-full bg-white p-1 shadow-md">
            <button
              onClick={() => {
                setSelectedType('all');
                setSelectedCategory('all');
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-6 sm:py-3 sm:text-base ${
                selectedType === 'all'
                  ? 'bg-gold-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              All
              <span className="hidden text-xs opacity-75 sm:inline">({portfolioItems.length})</span>
            </button>
            <button
              onClick={() => {
                setSelectedType('photography');
                setSelectedCategory('all');
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-6 sm:py-3 sm:text-base ${
                selectedType === 'photography'
                  ? 'bg-gold-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              <Camera className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Photography
              <span className="hidden text-xs opacity-75 sm:inline">({photographyCount})</span>
            </button>
            <button
              onClick={() => {
                setSelectedType('videography');
                setSelectedCategory('all');
              }}
              className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all duration-300 sm:px-6 sm:py-3 sm:text-base ${
                selectedType === 'videography'
                  ? 'bg-gold-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gold-600'
              }`}
            >
              <Video className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              Videography
              <span className="hidden text-xs opacity-75 sm:inline">({videographyCount})</span>
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
            <Filter className="h-5 w-5 text-navy-900" />
            <span className="font-medium text-navy-900">Refine by:</span>
          </div>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[200px] bg-white border-gold-200 focus:ring-gold-500 rounded-full shadow-sm">
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
              <SelectTrigger className="w-[180px] bg-white border-gold-200 focus:ring-gold-500 rounded-full shadow-sm">
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
                className="border-gold-600 text-gold-600 hover:bg-gold-500 hover:text-white transition-colors rounded-full px-6 py-2 shadow-sm"
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
            Showing <span className="font-semibold text-gold-600">{filteredItems.length}</span> {filteredItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        {/* Portfolio Grid — mixed aspect ratios in a masonry layout, editorial pacing instead of a uniform grid */}
        <motion.div className="columns-2 gap-3 sm:columns-3 sm:gap-6 lg:columns-4 lg:gap-8" variants={sectionVariants}>
          <AnimatePresence mode="wait">
            {filteredItems.map((item, index) => {
              // Featured work gets a taller frame so it reads as visually larger
              // within the masonry, instead of just a corner badge.
              const aspect = item.featured
                ? 'aspect-[3/5]'
                : ['aspect-[3/4]', 'aspect-[4/5]', 'aspect-square', 'aspect-[4/5]'][index % 4];
              const year = new Date(item.createdAt).getFullYear();
              const isPlaying = playingItemId === item.id && !!item.videoUrl;
              return (
                <motion.div
                  key={item.id}
                  custom={index}
                  variants={cardVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ delay: index * 0.05 }}
                  className="mb-3 break-inside-avoid sm:mb-6 lg:mb-8"
                >
                  <Link href={`/portfolio/${item.id}`} className="block">
                    <motion.div
                      initial="rest"
                      animate="rest"
                      whileHover="hover"
                      variants={cardShadowVariants}
                      className={`relative ${aspect} w-full overflow-hidden rounded-xl bg-slate-100 sm:rounded-2xl`}
                    >
                      {isPlaying ? (
                        <iframe
                          src={`${item.videoUrl}?autoplay=1`}
                          title={item.title}
                          className="absolute inset-0 h-full w-full"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                        />
                      ) : (
                        <motion.div variants={cardImageVariants} className="absolute inset-0">
                          <Image
                            src={
                              item.imageUrls && item.imageUrls.length > 0
                                ? item.imageUrls[0]
                                : item.videoUrl
                                  ? '/video-placeholder.jpg'
                                  : '/placeholder-image.jpg'
                            }
                            alt={`${item.title} — ${item.category} ${item.type === 'photography' ? 'photography' : 'videography'} by Brain Works Studio Africa, Accra, Ghana`}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        </motion.div>
                      )}

                      {isPlaying ? (
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setPlayingItemId(null);
                          }}
                          aria-label="Close video"
                          className="absolute right-2 top-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-navy-950/80 text-white shadow-sm hover:bg-navy-950 sm:right-4 sm:top-4 sm:h-9 sm:w-9"
                        >
                          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                        </button>
                      ) : (
                        <>
                          {/* Top-left: featured marker */}
                          {item.featured && (
                            <div className="absolute left-2 top-2 flex items-center gap-1 rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold tracking-wide text-navy-900 shadow-sm sm:left-4 sm:top-4 sm:gap-1.5 sm:px-3 sm:py-1 sm:text-xs">
                              <Star className="h-2.5 w-2.5 fill-[#CB9D06] text-[#CB9D06] sm:h-3 sm:w-3" />
                              Featured
                            </div>
                          )}

                          {/* Top-right: media type indicator */}
                          <div className="absolute right-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-navy-900 shadow-sm sm:right-4 sm:top-4 sm:h-9 sm:w-9">
                            {item.type === 'photography' ? (
                              <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                            ) : (
                              <Video className="h-3 w-3 sm:h-4 sm:w-4" />
                            )}
                          </div>

                          {/* Video play affordance — only the circle itself is clickable, so the
                              rest of the card still links through to the project detail page. */}
                          {item.videoUrl && (
                            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                              <motion.button
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setPlayingItemId(item.id);
                                }}
                                aria-label={`Play ${item.title}`}
                                variants={cardPlayVariants}
                                className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-full bg-white/95 shadow-lg sm:h-16 sm:w-16"
                              >
                                <Play className="ml-0.5 h-4 w-4 fill-navy-900 text-navy-900 sm:h-6 sm:w-6" />
                              </motion.button>
                            </div>
                          )}

                          {/* Bottom scrim + metadata — category/year always visible, not hover-only */}
                          <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy-900/95 via-navy-900/55 to-transparent px-2.5 pb-2.5 pt-10 sm:px-5 sm:pb-5 sm:pt-16">
                            <div className="mb-0.5 flex items-center justify-between sm:mb-1">
                              <p className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/75 sm:text-xs sm:tracking-[0.12em]">
                                {item.category}
                              </p>
                              <p className="text-[9px] font-semibold text-white/60 sm:text-xs">{year}</p>
                            </div>
                            <h3 className="font-serif text-xs leading-snug text-white sm:text-xl">{item.title}</h3>
                            <motion.div
                              variants={cardRevealVariants}
                              className="mt-1.5 hidden items-center gap-1.5 text-sm font-medium text-white sm:mt-3 sm:flex"
                            >
                              View project
                              <ArrowUpRight className="h-4 w-4" />
                            </motion.div>
                          </div>
                        </>
                      )}
                    </motion.div>
                  </Link>
                </motion.div>
              );
            })}
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
            <p className="text-navy-900 text-lg font-medium mb-2">No items found</p>
            <p className="text-gray-600 mb-6">Try adjusting your filters to see more results</p>
            <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
              <Button
                variant="outline"
                className="border-gold-600 text-gold-600 hover:bg-gold-500 hover:text-white transition-colors rounded-full px-6 py-2"
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
        </div>
      </motion.section>

      {/* Closing CTA */}
      <section className="bg-navy-950 py-20 text-center text-white sm:py-24">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-3xl font-bold tracking-tight sm:text-5xl">
            Let&rsquo;s create something worth remembering.
          </h2>
          <p className="mt-5 text-base text-white/70 sm:text-lg">
            From photography to full-scale productions, we&rsquo;d love to hear what you&rsquo;re planning.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto bg-gold-500 text-white hover:bg-gold-400 rounded-full px-8 py-6 font-bold">
                Start a Project
              </Button>
            </Link>
            <Link href="/booking" className="w-full sm:w-auto">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto rounded-full border-2 border-white/30 bg-transparent px-8 py-6 font-bold text-white hover:bg-white/10"
              >
                Book a Photoshoot
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
