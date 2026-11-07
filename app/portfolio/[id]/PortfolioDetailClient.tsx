'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { PortfolioItem } from '@/types';
import Image from 'next/image';
import Link from 'next/link';
import { X, Play, ArrowDown, Eye, EyeOff, Lock, Download, Heart, Share2, Loader2, MapPin, Calendar, Briefcase } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import logo from "../../../public/newlogo1.png";
import { SITE } from '@/lib/site-config';
import { getYouTubeThumbnail } from '@/lib/youtube-helper';

// ---------------------------------------------------
//  Animation Variants
// ---------------------------------------------------
const heroVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 1, ease: 'easeOut' } },
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

// ---------------------------------------------------
//  Types
// ---------------------------------------------------
interface MediaItem {
  type: 'image' | 'video';
  url: string;
  filename: string;
}

// Builds the downloadable media list (video first, then images) for an item.
function buildMediaList(data: PortfolioItem): MediaItem[] {
  const media: MediaItem[] = [];
  if (data.videoUrl && data.type === 'videography') {
    media.push({ type: 'video', url: data.videoUrl, filename: `${data.title}-video.mp4` });
  }
  data.imageUrls.forEach((url, i) => {
    media.push({ type: 'image', url, filename: `${data.title}-image-${i + 1}.jpg` });
  });
  return media;
}

export default function PortfolioDetailClient({
  id,
  initialItem,
  relatedItems = [],
}: {
  id: string;
  initialItem?: PortfolioItem | null;
  relatedItems?: PortfolioItem[];
}) {
  const router = useRouter();
  // The server page passes the item in so the project renders in the initial HTML
  // (headline, images) instead of a loading spinner — important for SEO.
  const [item, setItem] = useState<PortfolioItem | null>(initialItem ?? null);
  const [loading, setLoading] = useState(!initialItem);
  const [error, setError] = useState('');
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isDownloadAuthorized, setIsDownloadAuthorized] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pendingDownload, setPendingDownload] = useState<MediaItem | null>(null);
  const [mediaList, setMediaList] = useState<MediaItem[]>(initialItem ? buildMediaList(initialItem) : []);
  const [showPin, setShowPin] = useState(false);

  // ZIP state
  const [isZipping, setIsZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(0);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [selectedMedia, setSelectedMedia] = useState<string | null>(null);

  // ---------------------------------------------------
  //  Fetch portfolio item
  // ---------------------------------------------------
  useEffect(() => {
    if (initialItem) return;
    const fetchItem = async () => {
      try {
        const response = await fetch(`/api/portfolio/${id}`, { cache: 'no-store' });
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
        setItem(data);
        setMediaList(buildMediaList(data));
      } catch (err: any) {
        console.error('Fetch error:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, initialItem]);

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
    if (isDownloadAuthorized || !item?.hasPin) {
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

    if (isDownloadAuthorized || !item.hasPin) {
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
  //  PIN handling
  // ---------------------------------------------------
  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');

    if (!pin || pin.length < 4) {
      setPinError('Please enter a valid PIN (minimum 4 characters)');
      return;
    }

    try {
      const res = await fetch(`/api/portfolio/${id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ pin }),
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
    setSelectedMedia(mediaList[index].url);
    setLightboxOpen(true);
  };
  const closeLightbox = () => {
    setLightboxOpen(false);
    setSelectedMedia(null);
  };

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
  //  Render: Loading
  // ---------------------------------------------------
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

  // ---------------------------------------------------
  //  Render: Not Found
  // ---------------------------------------------------
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
              onClick={() => router.push('/portfolio')}
              className="bg-gray-900 text-white hover:bg-gray-800 transition-colors rounded-lg px-6 py-2"
            >
              Back to Portfolio
            </Button>
          </div>
        </motion.div>
      </Layout>
    );
  }

  // ---------------------------------------------------
  //  Render: Main Content
  // ---------------------------------------------------
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
          {/* Hero Image — a video's raw url is a YouTube embed link, not an
              image, so it needs its real thumbnail instead. */}
          <div className="absolute inset-0">
            <Image
              src={
                mediaList[0]?.type === 'video'
                  ? getYouTubeThumbnail(mediaList[0].url, 'hq') || '/placeholder-image.jpg'
                  : mediaList[0]?.url || '/placeholder-image.jpg'
              }
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
              {/* Badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {item.featured && (
                  <Badge className="bg-gold-500 text-navy-900">Featured</Badge>
                )}
                {item.hasPin && (
                  <Badge className="bg-navy-800 text-white">
                    <Lock className="h-3 w-3 mr-1" />
                    PIN Protected
                  </Badge>
                )}
                <Badge className="bg-white/10 backdrop-blur-sm border border-white text-white">
                  {item.category}
                </Badge>
                <Badge className="bg-white/10 backdrop-blur-sm border border-white text-white">
                  {item.type}
                </Badge>
                <Badge className="bg-white/10 backdrop-blur-sm border border-white text-white">
                  {new Date(item.createdAt).getFullYear()}
                </Badge>
              </div>

              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 tracking-tight">
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
              className="absolute bottom-6 left-1/2 transform -translate-x-1/2"
            >
              <ArrowDown className="h-6 w-6 text-white animate-bounce" />
            </motion.div>
          </div>

          {/* Studio Branding */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="absolute bottom-24 left-1/2 transform -translate-x-1/2 text-center sm:bottom-28"
          >
            <div className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm">
              <Image
                src={logo}
                alt="Brain Works Studio"
                width={32}
                height={32}
                className="object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
            <p className="text-white text-sm tracking-widest font-medium">
              BRAIN WORKS STUDIO AFRICA
            </p>
          </motion.div>
        </motion.div>

        {/* Case Study Strip — Location / Service / Year, plus the brief, when present */}
        <div className="border-b border-gray-200 bg-slate-50">
          <div className="mx-auto max-w-7xl px-4 py-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 flex-none text-gold-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Location</p>
                  <p className="mt-1 text-sm font-medium text-navy-900">{item.location || SITE.location}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Briefcase className="mt-0.5 h-5 w-5 flex-none text-gold-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Service</p>
                  <p className="mt-1 text-sm font-medium capitalize text-navy-900">
                    {item.category} &middot; {item.type}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar className="mt-0.5 h-5 w-5 flex-none text-gold-600" />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Year</p>
                  <p className="mt-1 text-sm font-medium text-navy-900">{new Date(item.createdAt).getFullYear()}</p>
                </div>
              </div>
            </div>
            {(item.brief || item.caption) && (
              <p className="mt-8 max-w-3xl font-serif text-xl leading-relaxed text-navy-900">
                {item.brief || item.caption}
              </p>
            )}
          </div>
        </div>

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
                {item.caption && (
                  <p className="text-sm text-gray-600 mt-2">{item.caption}</p>
                )}
              </div>

              <div className="flex items-center gap-2">
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
                  className="bg-gray-900 text-white hover:bg-gray-800"
                >
                  {isZipping ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {zipProgress}%
                    </>
                  ) : (
                    <>
                      <Download className="h-4 w-4 mr-2" />
                      Download All
                    </>
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

            {/* Tags */}
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

          {/* Gallery — editorial layout: images keep their natural portrait/landscape
              proportions in a masonry flow instead of being cropped to squares. */}
          <div className="max-w-7xl mx-auto px-4">
            {item.videoUrl ? (
              <motion.div
                variants={mediaVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="relative aspect-video w-full overflow-hidden rounded-lg cursor-pointer group"
                onClick={() => openLightbox(0)}
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
              <>
                {/* Lead image — full width, sets the editorial tone for the gallery */}
                {mediaList[0] && (
                  <motion.div
                    variants={mediaVariants}
                    initial="hidden"
                    animate="visible"
                    whileHover="hover"
                    className="relative mb-3 aspect-[16/9] w-full overflow-hidden rounded-lg cursor-pointer group sm:mb-4"
                    onClick={() => openLightbox(0)}
                  >
                    {mediaList[0].type === 'video' ? (
                      <video src={mediaList[0].url} className="w-full h-full object-cover" muted loop playsInline />
                    ) : (
                      <img
                        src={mediaList[0].url}
                        alt={`${item.title} - 1`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                        onError={(e) => {
                          e.currentTarget.src = '/placeholder-image.jpg';
                        }}
                      />
                    )}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
                  </motion.div>
                )}

                <div className="columns-2 gap-3 sm:columns-3 sm:gap-4 md:columns-4 lg:columns-5">
                  {mediaList.slice(1).map((media, offsetIndex) => {
                    const index = offsetIndex + 1;
                    return (
                      <motion.div
                        key={index}
                        variants={mediaVariants}
                        initial="hidden"
                        animate="visible"
                        whileHover="hover"
                        className="relative mb-3 overflow-hidden rounded-lg cursor-pointer group break-inside-avoid sm:mb-4"
                        onClick={() => openLightbox(index)}
                      >
                        {media.type === 'video' ? (
                          <video src={media.url} className="w-full h-auto" muted loop playsInline />
                        ) : (
                          <img
                            src={media.url}
                            alt={`${item.title} - ${index + 1}`}
                            className="block w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                        )}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />

                        {/* Overlay buttons */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                openLightbox(index);
                              }}
                              className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                              title="View"
                            >
                              <Eye className="h-4 w-4 text-gray-900" />
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                requestDownload(media);
                              }}
                              className="p-2 bg-white/90 rounded-full shadow-lg hover:bg-white transition"
                              title="Download"
                            >
                              <Download className="h-4 w-4 text-gray-900" />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </>
            )}
          </div>

        </div>

        {/* Related Projects — real work only, same category first then same type */}
        {relatedItems.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 mt-20">
            <h2 className="font-serif text-2xl font-bold text-navy-900 mb-6 sm:text-3xl">Related Projects</h2>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-6">
              {relatedItems.map((related) => (
                <Link key={related.id} href={`/portfolio/${related.id}`} className="group block">
                  <div className="relative aspect-[4/5] w-full overflow-hidden rounded-lg bg-slate-100">
                    <Image
                      src={related.imageUrls[0] || '/placeholder-image.jpg'}
                      alt={`${related.title} — ${related.category} by Brain Works Studio Africa`}
                      fill
                      sizes="(max-width: 640px) 50vw, 25vw"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-gold-600">{related.category}</p>
                  <h3 className="font-serif text-base font-bold leading-snug text-navy-900">{related.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Closing CTA */}
        <section className="mt-20 bg-navy-950 py-20 text-center text-white sm:py-24">
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

                  {mediaList.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 bg-gray-900/50 text-white hover:bg-gray-900"
                        onClick={goToPrev}
                      >
                        ←
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Next image"
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
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                    />
                  )}

                  <div className="absolute bottom-4 left-4 text-white/80 text-sm font-medium bg-black/20 backdrop-blur-sm px-4 py-2 rounded-full">
                    {lightboxIndex + 1} / {mediaList.length}
                  </div>

                  <button
                    onClick={() => requestDownload(mediaList[lightboxIndex])}
                    className="absolute bottom-4 right-4 p-3 bg-white hover:bg-gray-100 rounded-full shadow-lg transition"
                    title="Download"
                  >
                    <Download className="h-5 w-5 text-gray-900" />
                  </button>
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* PIN Modal */}
        <AnimatePresence>
          {showPinModal && (
            <Dialog open={showPinModal} onOpenChange={setShowPinModal}>
              <DialogContent className="bg-white rounded-2xl max-w-md">
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
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
                    <div className="relative">
                      <Input
                        type={showPin ? 'text' : 'password'}
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        placeholder="••••"
                        className="text-center text-lg tracking-widest border-gray-300 focus:border-gray-900 pr-10"
                        maxLength={6}
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => setShowPin(!showPin)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-900"
                      >
                        {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
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
                          setPinError('');
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
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
