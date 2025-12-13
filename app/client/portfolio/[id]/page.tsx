'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Lock,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  Eye,
  Loader2,
  Heart,
  Share2,
  ArrowDown,
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import Image from 'next/image';

// ---------------------------------------------------
//  Types & Variants
// ---------------------------------------------------
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
};

const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
};

interface MediaItem {
  type: 'image' | 'video';
  url: string;
  filename: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  type: string;
  category: string;
  tags: string[];
  imageUrls: string[];
  videoUrl: string | null;
  caption: string;
  clientName: string;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  clientId: string | null;
  pin?: string;
}

// ---------------------------------------------------
//  Component
// ---------------------------------------------------
export default function ClientPortfolioPage() {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isDownloadAuthorized, setIsDownloadAuthorized] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<MediaItem | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);

  // ZIP state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const params = useParams();
  const router = useRouter();
  const { user, isAdmin, firebaseUser } = useAuth();
  const id = params.id as string;

  // ---------------------------------------------------
  //  Fetch portfolio item
  // ---------------------------------------------------
  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const response = await fetch(`/api/portfolio/${id}`);
        if (!response.ok) throw new Error('Not found');
        const data: PortfolioItem = await response.json();
        setItem(data);

        const media: MediaItem[] = [];
        if (data.videoUrl && data.type === 'videography') {
          media.push({
            type: 'video',
            url: data.videoUrl,
            filename: `${data.title}-video.mp4`,
          });
        }
        data.imageUrls.forEach((url, i) => {
          media.push({
            type: 'image',
            url,
            filename: `${data.title}-image-${i + 1}.jpg`,
          });
        });
        setMediaList(media);

        if (isAdmin) setIsDownloadAuthorized(true);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
        router.push('/404');
      }
    };

    if (id) fetchPortfolioItem();
  }, [id, router, isAdmin]);

  // ---------------------------------------------------
  //  Single file download
  // ---------------------------------------------------
  const triggerDownload = async (url: string, filename: string) => {
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Network error');
      const blob = await res.blob();
      const objUrl = URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = objUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(objUrl);
    } catch (e) {
      console.error(e);
      alert('Download failed. Please try again.');
    }
  };

  const requestDownload = async (media: MediaItem) => {
    if (isAdmin || isDownloadAuthorized || !item?.pin) {
      await triggerDownload(media.url, media.filename);
      return;
    }
    setPendingDownload(media);
    setShowPinModal(true);
  };

  // ---------------------------------------------------
  //  Download All → ZIP
  // ---------------------------------------------------
  const downloadAllAsZip = async () => {
    if (!item || mediaList.length === 0) return;

    if (isAdmin || isDownloadAuthorized || !item.pin) {
      await createZip();
      return;
    }

    setShowPinModal(true);
  };

  const createZip = async () => {
    setIsZipping(true);
    setZipProgress(0);

    const zip = new JSZip();
    const total = mediaList.length;
    let loaded = 0;

    try {
      for (const media of mediaList) {
        const res = await fetch(media.url);
        if (!res.ok) throw new Error(`Failed to fetch ${media.filename}`);
        const blob = await res.blob();
        zip.file(media.filename, blob);
        loaded++;
        setZipProgress(Math.round((loaded / total) * 100));
      }

      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const safeTitle = (item?.title ?? 'portfolio')
        .replace(/[^a-z0-9]/gi, '_')
        .toLowerCase();
      const zipName = `${safeTitle}_portfolio.zip`;
      saveAs(zipBlob, zipName);
    } catch (err) {
      console.error(err);
      alert('Failed to create ZIP. Try downloading files individually.');
    } finally {
      setIsZipping(false);
      setZipProgress(0);
    }
  };

  // ---------------------------------------------------
  //  PIN handling (single file OR zip)
  // ---------------------------------------------------
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    try {
      const token = await firebaseUser?.getIdToken();
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ pin, adminBypass: true }),
      });

      if (res.ok) {
        setIsDownloadAuthorized(true);
        setShowPinModal(false);
        setPin('');

        if (pendingDownload) {
          await triggerDownload(pendingDownload.url, pendingDownload.filename);
          setPendingDownload(null);
        } else {
          await createZip();
        }
      } else {
        const err = await res.json();
        setPinError(err.error || 'Invalid PIN');
      }
    } catch (err) {
      setPinError('Validation failed');
    }
  };

  // ---------------------------------------------------
  //  Lightbox navigation
  // ---------------------------------------------------
  const goToPrev = () =>
    setLightboxIndex((i) => (i - 1 + mediaList.length) % mediaList.length);
  const goToNext = () =>
    setLightboxIndex((i) => (i + 1) % mediaList.length);
  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };
  const closeLightbox = () => setLightboxOpen(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') goToPrev();
      if (e.key === 'ArrowRight') goToNext();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightboxOpen, mediaList.length]);

  // Scroll to gallery
  const scrollToGallery = () => {
    const gallerySection = document.getElementById('gallery-section');
    if (gallerySection) {
      gallerySection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }).toUpperCase();
  };

  // ---------------------------------------------------
  //  Render
  // ---------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-gray-300 border-t-gray-800 rounded-full"
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-xl max-w-md"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">
            This portfolio item doesn't exist.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-gray-900 hover:bg-gray-800 text-white"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
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
              src={mediaList[0]?.url || '/placeholder-image.jpg'}
              alt={item.title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-black/30" />
          </div>

          {/* Hero Content */}
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="text-center text-white max-w-4xl"
            >
              <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
                {item.title.toUpperCase()}
              </h1>
              <p className="text-lg md:text-xl mb-8 tracking-widest">
                {formatDate(item.createdAt)}
              </p>
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
                <h2 className="text-2xl font-bold text-gray-900 mb-1">
                  {item.title}
                </h2>
                <p className="text-sm text-gray-600 uppercase tracking-wide">
                  {item.clientName ? `${item.clientName} • ` : ''}Brain Works Studio
                </p>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                  title="Favorite"
                >
                  <Heart className="h-5 w-5" />
                </Button>
                <Button
                  onClick={downloadAllAsZip}
                  disabled={isZipping}
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                  title="Download All"
                >
                  {isZipping ? (
                    <Loader2 className="h-5 w-5 animate-spin" />
                  ) : (
                    <Download className="h-5 w-5" />
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-600 hover:text-gray-900"
                  title="Share"
                >
                  <Share2 className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* Admin Info */}
            {isAdmin && item.pin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg"
              >
                <p className="text-sm text-blue-900 font-mono">
                  <Lock className="inline h-4 w-4 mr-2" />
                  Download PIN: {item.pin}
                </p>
              </motion.div>
            )}
          </div>

          {/* Gallery Grid */}
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {mediaList.map((media, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="group relative bg-gray-100 aspect-square overflow-hidden cursor-pointer"
                  onClick={() => openLightbox(index)}
                >
                  {media.type === 'video' ? (
                    <video
                      src={media.url}
                      className="w-full h-full object-cover"
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={media.url}
                      alt={`${item.title} - ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openLightbox(index);
                        }}
                        className="p-2 bg-white/90 rounded-full shadow-lg"
                        title="View"
                      >
                        <Eye className="h-4 w-4 text-gray-900" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          requestDownload(media);
                        }}
                        className="p-2 bg-white/90 rounded-full shadow-lg"
                        title="Download"
                      >
                        <Download className="h-4 w-4 text-gray-900" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
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
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-50 flex items-center justify-center"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-7xl w-full h-full p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute top-8 right-8 text-white/80 hover:text-white p-2 transition z-10"
                >
                  <X className="h-8 w-8" />
                </button>

                {mediaList[lightboxIndex].type === 'video' ? (
                  <video
                    src={mediaList[lightboxIndex].url}
                    className="w-full h-full object-contain"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={mediaList[lightboxIndex].url}
                    alt=""
                    className="w-full h-full object-contain"
                  />
                )}

                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-8 top-1/2 -translate-y-1/2 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full text-white transition"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => requestDownload(mediaList[lightboxIndex])}
                  className="absolute bottom-8 right-8 p-4 bg-white hover:bg-gray-100 rounded-full shadow-lg transition"
                >
                  <Download className="h-5 w-5 text-gray-900" />
                </button>

                <div className="absolute bottom-8 left-8 text-white/80 text-sm font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                  {lightboxIndex + 1} / {mediaList.length}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* PIN Modal */}
        <AnimatePresence>
          {showPinModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => {
                setShowPinModal(false);
                setPendingDownload(null);
                setPin('');
              }}
            >
              <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center mb-6">
                  <div className="p-4 bg-gray-100 rounded-full">
                    <Lock className="h-6 w-6 text-gray-900" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                  Enter PIN
                </h2>
                <p className="text-sm text-center text-gray-600 mb-6">
                  Please enter the PIN provided by your photographer
                </p>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="text-center text-lg tracking-widest border-gray-300 focus:border-gray-900"
                    maxLength={6}
                    autoFocus
                  />
                  {pinError && (
                    <p className="text-xs text-red-500 text-center">
                      {pinError}
                    </p>
                  )}

                  <div className="flex gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 border-gray-300 text-gray-900"
                      onClick={() => {
                        setShowPinModal(false);
                        setPendingDownload(null);
                        setPin('');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1 bg-gray-900 hover:bg-gray-800 text-white"
                    >
                      Unlock
                    </Button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}