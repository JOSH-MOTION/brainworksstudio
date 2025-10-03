'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PortfolioItem } from '@/types';
import Image from 'next/image';
import { Download, Lock, X, Eye, EyeOff, CheckCircle } from 'lucide-react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const galleryVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { staggerChildren: 0.1, ease: 'easeOut' },
  },
};

const galleryItemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const lightboxVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } },
};

export default function ClientPortfolioPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [pinError, setPinError] = useState('');
  const [downloading, setDownloading] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isPinValidated, setIsPinValidated] = useState(false);

  useEffect(() => {
    fetchItem();
  }, [id]);

  const fetchItem = async () => {
    try {
      console.log(`Fetching portfolio item: /api/portfolio/${id}`);
      const response = await fetch(`/api/portfolio/${id}`, { cache: 'no-store' });
      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = `Server returned ${response.status}`;
        if (contentType?.includes('application/json')) {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        }
        throw new Error(errorMessage);
      }
      const data: PortfolioItem = await response.json();
      console.log('Fetched portfolio item:', data);
      setItem(data);
      if (!data.pin) {
        setIsPinValidated(true); // No PIN required
      }
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const validatePin = async () => {
    if (!enteredPin || enteredPin.length < 4) {
      setPinError('Please enter a PIN (minimum 4 characters)');
      return;
    }
    try {
      console.log(`Validating PIN for /api/portfolio/${id}`);
      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pin: enteredPin }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        setPinError(errorData.error || 'Invalid PIN');
        return;
      }
      setIsPinValidated(true);
      setPinError('');
      setPinDialogOpen(false);
      setEnteredPin('');
    } catch (error: any) {
      console.error('PIN validation error:', error);
      setPinError('Failed to validate PIN. Please try again.');
    }
  };

  const handleDownloadClick = () => {
    if (item?.pin && !isPinValidated) {
      setPinDialogOpen(true);
      setEnteredPin('');
      setPinError('');
    } else {
      downloadMedia();
    }
  };

  const downloadMedia = async () => {
    if (!item) return;
    setDownloading(true);

    try {
      if (item.type === 'videography' && item.videoUrl) {
        if (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('vimeo.com')) {
          window.open(item.videoUrl, '_blank');
        } else {
          window.location.href = item.videoUrl;
        }
      } else if (item.imageUrls.length > 0) {
        const zip = new JSZip();
        const folder = zip.folder(item.title || 'portfolio-item');

        for (let i = 0; i < item.imageUrls.length; i++) {
          const url = item.imageUrls[i];
          try {
            const response = await fetch(url);
            if (!response.ok) {
              console.error(`Failed to fetch image: ${url}`);
              continue;
            }
            const blob = await response.blob();
            const fileName = url.split('/').pop()?.split('?')[0] || `image-${i + 1}.jpg`;
            folder?.file(fileName, blob);
          } catch (err) {
            console.error(`Error fetching image ${url}:`, err);
          }
        }

        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${item.title || 'portfolio-item'}.zip`);
      } else {
        throw new Error('No downloadable media available');
      }
    } catch (error: any) {
      console.error('Download error:', error);
      alert('Failed to download media. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const openLightbox = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-navy-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-gold-500 mx-auto"></div>
            <p className="mt-4 text-navy-900 text-lg font-medium">Loading your portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error || !item) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-navy-50">
          <div className="text-center">
            <p className="text-red-600 text-lg mb-4">{error || 'Portfolio not found'}</p>
            <p className="text-navy-200 mb-4">Please check your link or contact the photographer</p>
            <Button
              onClick={() => router.push('/')}
              className="bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900 rounded-lg px-6 py-2"
            >
              Return Home
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  if (item.pin && !isPinValidated) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="min-h-screen flex items-center justify-center bg-navy-50"
        >
          <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-navy-900 mb-4">Enter PIN</h2>
            <p className="text-navy-200 mb-4">Please enter the PIN provided by your photographer to view your portfolio.</p>
            <div className="relative mb-4">
              <Input
                type={showPin ? 'text' : 'password'}
                placeholder="Enter PIN"
                value={enteredPin}
                onChange={(e) => setEnteredPin(e.target.value)}
                className="border-navy-200 focus:ring-gold-500 rounded-lg pr-10"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
                onClick={() => setShowPin(!showPin)}
              >
                {showPin ? <EyeOff className="h-4 w-4 text-navy-200" /> : <Eye className="h-4 w-4 text-navy-200" />}
              </Button>
            </div>
            {pinError && <p className="text-red-600 text-sm mb-4">{pinError}</p>}
            <Button
              onClick={validatePin}
              disabled={downloading}
              className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400 rounded-lg px-6 py-2 disabled:bg-gold-200"
            >
              <Lock className="h-5 w-5 mr-2" />
              {downloading ? 'Verifying...' : 'Verify PIN'}
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
        {/* Header */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 bg-gold-100 rounded-full"
          >
            <CheckCircle className="w-5 h-5 text-gold-600" />
            <span className="text-gold-800 font-medium">Your Photos Are Ready!</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-navy-900 mb-4">
            {item.title}
          </h1>

          <div className="flex flex-wrap gap-2 justify-center mb-6">
            <Badge className="bg-gold-500 text-white">{item.category}</Badge>
            <Badge className="bg-navy-100 text-navy-900">{item.type}</Badge>
            {item.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="border-gold-500 text-gold-500">
                {tag}
              </Badge>
            ))}
          </div>

          {item.caption && (
            <p className="text-lg text-navy-200 max-w-2xl mx-auto mb-6">{item.caption}</p>
          )}

          {item.clientName && (
            <p className="text-lg text-navy-200 mb-6">
              <strong>Client:</strong> {item.clientName}
            </p>
          )}

          <Button
            onClick={handleDownloadClick}
            disabled={downloading || (!item.imageUrls.length && !item.videoUrl)}
            className="bg-gold-500 hover:bg-gold-600 text-navy-900 font-semibold px-8 py-6 text-lg rounded-lg shadow-lg hover:shadow-xl transition-all disabled:bg-gold-200 disabled:cursor-not-allowed"
          >
            <Download className="w-5 h-5 mr-2" />
            {downloading ? 'Downloading...' : item.type === 'videography' ? 'Download Video' : 'Download All Photos'}
          </Button>

          {item.pin && (
            <p className="text-sm text-navy-200 mt-3">
              PIN-protected download
            </p>
          )}
        </div>

        {/* Photo/Video Gallery */}
        <motion.div
          variants={galleryVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {item.type === 'videography' && item.videoUrl ? (
            <motion.div
              variants={galleryItemVariants}
              className="relative aspect-video rounded-lg overflow-hidden shadow-lg cursor-pointer"
              onClick={() => openLightbox(item.videoUrl!)}
            >
              <iframe
                src={item.videoUrl}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
                title={item.title}
              />
              <div className="absolute inset-0 flex items-center justify-center bg-navy-900 bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                <Eye className="h-10 w-10 text-white" />
              </div>
            </motion.div>
          ) : (
            item.imageUrls.map((url, index) => (
              <motion.div
                key={url}
                variants={galleryItemVariants}
                className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg cursor-pointer"
                onClick={() => openLightbox(url)}
              >
                <Image
                  src={url}
                  alt={`${item.title} image ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.error(`Failed to load image: ${url}`);
                    e.currentTarget.src = '/placeholder-image.jpg';
                  }}
                  onLoad={() => console.log(`Successfully loaded image: ${url}`)}
                />
                <div className="absolute inset-0 flex items-center justify-center bg-navy-900 bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </motion.div>
            ))
          )}
        </motion.div>

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxOpen && selectedImage && (
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
                  {selectedImage.includes('youtube.com') || selectedImage.includes('vimeo.com') ? (
                    <iframe
                      src={selectedImage}
                      className="w-full h-[80vh] rounded-t-lg"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title="Video preview"
                    />
                  ) : (
                    <Image
                      src={selectedImage}
                      alt="Enlarged image"
                      width={1200}
                      height={900}
                      className="w-full h-auto max-h-[80vh] object-contain rounded-t-lg"
                      onError={(e) => {
                        console.error(`Failed to load lightbox image: ${selectedImage}`);
                        e.currentTarget.src = '/placeholder-image.jpg';
                      }}
                      onLoad={() => console.log(`Successfully loaded lightbox image: ${selectedImage}`)}
                    />
                  )}
                </motion.div>
              </DialogContent>
            </Dialog>
          )}
        </AnimatePresence>

        {/* PIN Dialog */}
        <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
          <DialogContent className="bg-white rounded-lg">
            <DialogHeader>
              <DialogTitle>Enter PIN to Download</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="pin" className="text-navy-900 mb-2 block">
                Please enter the PIN provided by your photographer
              </Label>
              <div className="relative">
                <Input
                  id="pin"
                  type={showPin ? 'text' : 'password'}
                  placeholder="Enter PIN"
                  value={enteredPin}
                  onChange={(e) => setEnteredPin(e.target.value)}
                  className="border-navy-200 focus:ring-gold-500 rounded-lg pr-10"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPin(!showPin)}
                >
                  {showPin ? <EyeOff className="h-4 w-4 text-navy-200" /> : <Eye className="h-4 w-4 text-navy-200" />}
                </Button>
              </div>
              {pinError && <p className="text-red-600 text-sm mt-2">{pinError}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setPinDialogOpen(false)}
                className="border-navy-200 text-navy-900 hover:bg-navy-100 rounded-lg"
              >
                Cancel
              </Button>
              <Button
                onClick={validatePin}
                disabled={downloading}
                className="bg-gold-500 text-navy-900 hover:bg-gold-400 rounded-lg disabled:bg-gold-200"
              >
                <Lock className="h-5 w-5 mr-2" />
                {downloading ? 'Verifying...' : 'Verify and Download'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </motion.section>
    </Layout>
  );
}