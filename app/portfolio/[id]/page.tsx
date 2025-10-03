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
import { X, Play } from 'lucide-react';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const mediaVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
};

const lightboxVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function PortfolioDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

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

  const openLightbox = (mediaUrl: string) => {
    setSelectedMedia(mediaUrl);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-navy-50"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-gold-500 mx-auto"></div>
            <p className="mt-4 text-navy-900 text-lg font-medium">Loading portfolio item...</p>
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
          className="min-h-screen flex items-center justify-center bg-navy-50"
        >
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Portfolio item not found'}</p>
            <Button
              onClick={() => router.push('/portfolio')}
              className="bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900 transition-colors rounded-lg px-6 py-2"
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
      <motion.section
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:px-8 bg-navy-50"
      >
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => router.push('/portfolio')}
            className="text-navy-900 hover:text-gold-500 mb-4"
          >
            ← Back to Portfolio
          </Button>
          <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">{item.title}</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            <Badge className="bg-gold-500 text-white">{item.category}</Badge>
            <Badge className="bg-navy-100 text-navy-900">{item.type}</Badge>
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-gold-500 text-gold-500">
                {tag}
              </Badge>
            ))}
          </div>
          {item.caption && <p className="text-navy-200 text-lg mb-4">{item.caption}</p>}
          {item.clientName && (
            <p className="text-navy-200 text-lg">
              <strong>Client:</strong> {item.clientName}
            </p>
          )}
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={sectionVariants}
        >
          {item.videoUrl ? (
            <motion.div
              variants={mediaVariants}
              className="relative aspect-video rounded-lg overflow-hidden shadow-lg"
              onClick={() => openLightbox(item.videoUrl!)}
            >
              <iframe
                src={item.videoUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300 cursor-pointer">
                <Play className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          ) : (
            item.imageUrls.map((url, index) => (
              <motion.div
                key={url}
                variants={mediaVariants}
                className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg"
                onClick={() => openLightbox(url)}
              >
                <Image
                  src={url}
                  alt={`${item.title} image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                  onError={(e) => {
                    console.error(`Failed to load image: ${url}`);
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                  onLoad={() => console.log(`Successfully loaded image: ${url}`)}
                />
              </motion.div>
            ))
          )}
        </motion.div>

        <AnimatePresence>
          {lightboxOpen && selectedMedia && (
            <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
              <DialogContent className="max-w-5xl max-h-[90vh] p-0 bg-navy-900 border-none shadow-2xl rounded-lg">
                <motion.div
                  variants={lightboxVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-4 right-4 z-10 bg-navy-900/50 text-white hover:bg-navy-900"
                    onClick={() => setLightboxOpen(false)}
                  >
                    <X className="h-5 w-5" />
                  </Button>
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
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </motion.section>
    </Layout>
  );
}