'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PortfolioItem } from '@/types';
import Image from 'next/image';
import { X, Play, ArrowDown, Edit, Trash2, Eye, Lock, Download, Share2 } from 'lucide-react';
import Link from 'next/link';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const mediaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
};

const lightboxVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
};

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        console.log(`Fetching portfolio item: /api/portfolio/${id}`);
        const response = await fetch(`/api/portfolio/${id}`, { cache: 'no-store' });
        console.log(`Response status: ${response.status}, OK: ${response.ok}`);
        if (!response.ok) {
          const contentType = response.headers.get('content-type');
          console.log(`Content-Type: ${contentType}`);
          let errorMessage = `Server returned ${response.status}: ${response.statusText}`;
          if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            console.log('Error data:', errorData);
            errorMessage = errorData.error || errorMessage;
          } else {
            const text = await response.text();
            console.error(`Non-JSON response: ${text.slice(0, 100)}...`);
          }
          throw new Error(errorMessage);
        }
        const data: PortfolioItem = await response.json();
        console.log('Fetched portfolio item:', data);
        setItem(data);
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const openLightbox = (mediaUrl: string, index: number) => {
    setSelectedMedia(mediaUrl);
    setSelectedIndex(index);
    setLightboxOpen(true);
  };

  const goToPrev = () => {
    const newIndex = selectedIndex === 0 ? (item?.imageUrls.length || 1) - 1 : selectedIndex - 1;
    setSelectedIndex(newIndex);
    setSelectedMedia(item?.imageUrls[newIndex] || null);
  };

  const goToNext = () => {
    const newIndex = selectedIndex === (item?.imageUrls.length || 1) - 1 ? 0 : selectedIndex + 1;
    setSelectedIndex(newIndex);
    setSelectedMedia(item?.imageUrls[newIndex] || null);
  };

  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).toUpperCase();
  };

  if (loading) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-white"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-gray-900 mx-auto"></div>
            <p className="mt-4 text-gray-900 text-lg font-medium">Loading portfolio item...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-white"
        >
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Portfolio item not found'}</p>
            <Button
              onClick={() => router.push('/admin/portfolio')}
              className="bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-lg px-6 py-2"
            >
              Back to Portfolio
            </Button>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-white">
        {/* Hero Section */}
        <motion.div
          variants={heroVariants}
          initial="hidden"
          animate="visible"
          className="relative h-screen w-full overflow-hidden"
        >
          {/* Hero Image */}
          <div className="absolute inset-0">
            <Image
              src={item.imageUrls?.[0] || '/placeholder-image.jpg'}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Admin Controls */}
          <div className="absolute top-6 right-6 z-20 flex gap-2">
            <Link href={`/admin/portfolio/edit/${item.id}`}>
              <Button
                size="sm"
                className="bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </Button>
            </Link>
            <Link href={`/client/portfolio/${item.id}`}>
              <Button
                size="sm"
                className="bg-white/10 backdrop-blur-sm border border-white text-white hover:bg-white hover:text-gray-900"
              >
                <Eye className="h-4 w-4 mr-2" />
                Client View
              </Button>
            </Link>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center text-white max-w-4xl"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {item.featured && (
                  <Badge className="bg-amber-400 text-black">Featured</Badge>
                )}
                {item.pin && (
                  <Badge className="bg-blue-500 text-white">
                    <Lock className="h-3 w-3 mr-1" />
                    PIN: {item.pin}
                  </Badge>
                )}
                <Badge className="bg-white/10 backdrop-blur-sm border border-white text-white">
                  {item.category}
                </Badge>
                <Badge className="bg-white/10 backdrop-blur-sm border border-white text-white">
                  {item.type}
                </Badge>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {item.title.toUpperCase()}
              </h1>
              <p className="text-lg md:text-xl mb-2 tracking-widest">
                {formatDate(item.createdAt)}
              </p>
              {item.clientName && (
                <p className="text-base md:text-lg mb-8 text-white/80">
                  Client: {item.clientName}
                </p>
              )}
              <Button
                onClick={scrollToGallery}
                size="lg"
                className="bg-white/10 backdrop-blur-sm border-2 border-white text-white hover:bg-white hover:text-gray-900 transition-all duration-300 px-8 py-6 text-lg tracking-wider"
              >
                VIEW GALLERY
              </Button>
            </motion.div>

            {/* Scroll Indicator */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            >
              <ArrowDown className="h-8 w-8 text-white animate-bounce" />
            </motion.div>
          </div>

          {/* Studio Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 text-center"
          >
            <div className="bg-white/90 backdrop-blur-sm rounded-full px-6 py-3 mb-2">
              <Image
                src="/logo.png"
                alt="Brain Works Studio"
                width={40}
                height={40}
                className="mx-auto"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="text-white text-sm tracking-widest font-medium">
              BRAIN WORKS STUDIO
            </p>
          </motion.div>
        </motion.div>

        {/* Gallery Section - Below Hero */}
        <div id="gallery-section" className="bg-white py-12">
          {/* Gallery Header */}
          <div className="max-w-7xl mx-auto px-4 mb-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-gray-200 pb-6">
              <div>
                <Button
                  variant="ghost"
                  onClick={() => router.push('/admin/portfolio')}
                  className="text-gray-600 hover:text-gray-900 mb-4 -ml-4"
                >
                  ← Back to Portfolio
                </Button>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  {item.clientName ? `${item.clientName} • ` : ''}Brain Works Studio
                </p>
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-2">{item.caption}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Link href={`/admin/portfolio/edit/${item.id}`}>
                  <Button className="bg-gray-900 text-white hover:bg-gray-800">
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </Link>
                <Link href={`/client/portfolio/${item.id}`}>
                  <Button variant="outline" className="border-gray-300 text-gray-900">
                    <Eye className="h-4 w-4 mr-2" />
                    Client View
                  </Button>
                </Link>
              </div>
            </div>

            {/* Tags and Info */}
            {item.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-4">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="border-gray-300 text-gray-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {item.videoUrl ? (
                <motion.div
                  variants={mediaVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="relative aspect-square overflow-hidden cursor-pointer group col-span-2 row-span-2"
                  onClick={() => openLightbox(item.videoUrl!, 0)}
                >
                  <iframe
                    src={item.videoUrl}
                    className="w-full h-full"
                    allow="autoplay; encrypted-media"
                    allowFullScreen
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <Play className="h-10 w-10 text-white" />
                  </div>
                </motion.div>
              ) : (
                item.imageUrls.map((url, index) => (
                  <motion.div
                    key={url}
                    variants={mediaVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="relative aspect-square overflow-hidden cursor-pointer group"
                    onClick={() => openLightbox(url, index)}
                  >
                    <img
                      src={url}
                      alt={`${item.title} - ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </motion.div>
                ))
              )}
            </div>
          </div>

          {/* Studio Footer */}
          <div className="max-w-7xl mx-auto px-4 mt-16 pt-8 border-t border-gray-200 text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <Image
                src="/logo.png"
                alt="Brain Works Studio"
                width={32}
                height={32}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-gray-900 font-semibold tracking-wide">
                BRAIN WORKS STUDIO
              </span>
            </div>
            <p className="text-gray-600 text-sm">
              Professional Photography & Videography
            </p>
          </div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && selectedMedia && (
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-gray-900 border-none shadow-2xl rounded-lg">
                <motion.div
                  variants={lightboxVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 bg-gray-900/50 text-white hover:bg-gray-900"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>

                  {!item.videoUrl && item.imageUrls.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-900/50 text-white hover:bg-gray-900"
                        onClick={goToPrev}
                      >
                        ←
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 bg-gray-900/50 text-white hover:bg-gray-900"
                        onClick={goToNext}
                      >
                        →
                      </Button>
                    </>
                  )}

                  {selectedMedia.includes('youtube.com') ||
                  selectedMedia.includes('vimeo.com') ? (
                    <iframe
                      src={selectedMedia}
                      className="w-full h-[80vh] rounded-t-lg"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                    />
                  ) : (
                    <Image
                      src={selectedMedia}
                      alt="Enlarged media"
                      width={1200}
                      height={900}
                      className="w-full h-auto max-h-[80vh] object-contain rounded-t-lg"
                      onError={(e) => {
                        console.error(`Failed to load lightbox image: ${selectedMedia}`);
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                      onLoad={() => console.log(`Successfully loaded lightbox image: ${selectedMedia}`)}
                    />
                  )}

                  <div className="absolute bottom-4 left-4 text-white/80 text-sm font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {selectedIndex + 1} / {item.imageUrls.length || 1}
                  </div>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}