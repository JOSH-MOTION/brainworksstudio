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
} from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

// ---------------------------------------------------
//  Types & Variants
// ---------------------------------------------------
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  hover: { scale: 1.03, transition: { duration: 0.2 } },
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

  // ---------------------------------------------------
  //  Render
  // ---------------------------------------------------
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
          className="h-12 w-12 border-4 border-coral-500 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white p-8 rounded-xl shadow-lg max-w-md"
        >
          <h2 className="text-2xl font-bold text-[#001F44] mb-2">Not Found</h2>
          <p className="text-gray-600 mb-6">
            This portfolio item doesn't exist.
          </p>
          <Button
            onClick={() => router.push('/')}
            className="bg-coral-500 hover:bg-coral-600 text-white"
          >
            Back to Home
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-blue-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-8 shadow-xl border border-coral-100">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <h1 className="text-3xl md:text-4xl font-bold text-[#001F44] mb-3">
                    {item.title}
                  </h1>
                  {item.caption && (
                    <p className="text-base text-gray-700 mb-4 leading-relaxed">
                      {item.caption}
                    </p>
                  )}
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="px-3 py-1 bg-coral-100 text-coral-700 rounded-full font-medium">
                      {item.clientName}
                    </span>
                    <span className="text-gray-600">• {item.category}</span>
                    <span className="text-gray-600">• {item.type}</span>
                  </div>
                </div>

                {/* Download All as ZIP */}
                <Button
                  onClick={downloadAllAsZip}
                  size="lg"
                  disabled={isZipping}
                  className="bg-coral-500 hover:bg-coral-600 text-teal-700 shadow-lg relative"
                >
                  {isZipping ? (
                    <>
                      <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                      Zipping... {zipProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="h-5 w-5 mr-2" />
                      Download All as ZIP
                    </>
                  )}
                </Button>
              </div>

              {/* Admin Panel */}
              {isAdmin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl"
                >
                  <h3 className="font-semibold text-blue-900 mb-1">
                    Download Pin
                  </h3>
                  <p className="text-xs text-blue-700 font-mono break-all">
                    
                    {item.pin && `PIN: ${item.pin}`}
                  </p>
                </motion.div>
              )}
            </div>

            {/* Media Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaList.map((media, index) => (
                <motion.div
                  key={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-coral-100 cursor-pointer transition-all duration-300"
                  onClick={() => openLightbox(index)}
                >
                  <div className="aspect-video relative overflow-hidden">
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
                        alt={`${item.title} - ${media.type} ${index + 1}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = '/images/image-placeholder.jpg';
                        }}
                      />
                    )}

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex gap-3">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            openLightbox(index);
                          }}
                          className="p-3 bg-white/90 hover:bg-white rounded-full shadow-lg backdrop-blur-sm"
                          title="View Fullscreen"
                        >
                          <Eye className="h-5 w-5 text-[#001F44]" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            requestDownload(media);
                          }}
                          className="p-3 bg-coral-500/90 hover:bg-coral-500 text-white rounded-full shadow-lg backdrop-blur-sm"
                          title="Download"
                        >
                          <Download className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="p-4">
                    <p className="text-sm font-medium text-gray-700">
                      {media.type === 'video' ? 'Video' : `Image ${index + 1}`}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4"
              onClick={closeLightbox}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-6xl w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={closeLightbox}
                  className="absolute -top-12 right-0 text-white/80 hover:text-white p-2 transition"
                >
                  <X className="h-8 w-8" />
                </button>

                {mediaList[lightboxIndex].type === 'video' ? (
                  <video
                    src={mediaList[lightboxIndex].url}
                    className="w-full h-auto max-h-[90vh] rounded-lg"
                    controls
                    autoPlay
                  />
                ) : (
                  <img
                    src={mediaList[lightboxIndex].url}
                    alt=""
                    className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                  />
                )}

                {mediaList.length > 1 && (
                  <>
                    <button
                      onClick={goToPrev}
                      className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm text-white transition"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </button>
                    <button
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/20 hover:bg-white/40 rounded-full backdrop-blur-sm text-white transition"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </button>
                  </>
                )}

                <button
                  onClick={() => requestDownload(mediaList[lightboxIndex])}
                  className="absolute bottom-4 right-4 p-3 bg-coral-500 hover:bg-coral-600 text-white rounded-full shadow-lg transition"
                >
                  <Download className="h-5 w-5" />
                </button>

                <div className="absolute bottom-4 left-4 text-white/80 text-sm font-medium">
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
              className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4"
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
                className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-center mb-5">
                  <div className="p-3 bg-coral-100 rounded-full">
                    <Lock className="h-6 w-6 text-coral-600" />
                  </div>
                </div>
                <h2 className="text-xl font-bold text-center text-[#001F44] mb-2">
                  PIN Required
                </h2>
                <p className="text-sm text-center text-gray-600 mb-5">
                  Enter the PIN to download media files.
                </p>

                <form onSubmit={handlePinSubmit} className="space-y-4">
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••"
                    className="text-center text-lg tracking-widest border-coral-200 focus:border-coral-500"
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
                      className="flex-1 border-coral-200 text-coral-600 hover:bg-coral-50"
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
                      className="flex-1 bg-coral-500 hover:bg-coral-600 text-white"
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