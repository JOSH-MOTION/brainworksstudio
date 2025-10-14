'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock, Download } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

// Animation variants
const itemVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  hover: { scale: 1.05 },
};

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

export default function ClientPortfolioPage() {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isDownloadAuthorized, setIsDownloadAuthorized] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const params = useParams();
  const router = useRouter();
  const { user, isAdmin, firebaseUser } = useAuth();
  const id = params.id as string;

  useEffect(() => {
    const fetchPortfolioItem = async () => {
      try {
        const response = await fetch(`/api/portfolio/${id}`);
        if (!response.ok) {
          throw new Error('Portfolio item not found');
        }
        const data = await response.json();
        setItem(data);
        
        // Admins are automatically authorized for downloads
        if (isAdmin) {
          setIsDownloadAuthorized(true);
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio item:', error);
        setLoading(false);
        router.push('/404');
      }
    };
    
    fetchPortfolioItem();
  }, [id, router, isAdmin]);

  const handlePinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    
    try {
      const token = await firebaseUser?.getIdToken();
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          pin, 
          adminBypass: true 
        }),
      });

      if (response.ok) {
        setIsDownloadAuthorized(true);
        setShowPinModal(false);
        setPin('');
        
        // If there was a pending download, trigger it
        if (downloadUrl) {
          triggerDownload(downloadUrl);
          setDownloadUrl(null);
        }
      } else {
        const errorData = await response.json();
        setPinError(errorData.error || 'Invalid PIN');
      }
    } catch (error) {
      console.error('Error validating PIN:', error);
      setPinError('Failed to validate PIN');
    }
  };

  const triggerDownload = (url: string, filename?: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename || url.split('/').pop() || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownload = async (url: string, filename?: string) => {
    // If user is admin OR already authorized, download immediately
    if (isAdmin || isDownloadAuthorized) {
      triggerDownload(url, filename);
      return;
    }

    // If no PIN is set on the item, download immediately
    if (!item?.pin) {
      triggerDownload(url, filename);
      return;
    }

    // For non-admin users with PIN-protected items, show PIN modal
    setDownloadUrl(url);
    setShowPinModal(true);
  };

  const downloadAllMedia = async () => {
    if (!item) return;

    // If user is admin OR already authorized, download all immediately
    if (isAdmin || isDownloadAuthorized) {
      // Create zip or download all files
      item.imageUrls.forEach((url, index) => {
        handleDownload(url, `${item.title}-image-${index + 1}.jpg`);
      });
      if (item.videoUrl) {
        handleDownload(item.videoUrl, `${item.title}-video.mp4`);
      }
      return;
    }

    // If no PIN is set, download all immediately
    if (!item.pin) {
      item.imageUrls.forEach((url, index) => {
        handleDownload(url, `${item.title}-image-${index + 1}.jpg`);
      });
      if (item.videoUrl) {
        handleDownload(item.videoUrl, `${item.title}-video.mp4`);
      }
      return;
    }

    // For non-admin users with PIN-protected items, show PIN modal
    setShowPinModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-coral-500"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-teal-900">Portfolio Item Not Found</h2>
          <p className="text-sm text-gray-600 mt-2">The requested portfolio item does not exist.</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-4 border-coral-100 text-coral-500 hover:bg-coral-50"
            onClick={() => router.push('/')}
          >
            Return to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 15 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 0.4, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="bg-white rounded-lg p-6 mb-6 shadow-sm border border-coral-100">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-teal-900 mb-2">{item.title}</h1>
                {item.caption && (
                  <p className="text-sm text-gray-600 mb-3">{item.caption}</p>
                )}
                <div className="flex flex-wrap gap-4 text-sm">
                  <span className="text-coral-500 font-medium">Client: {item.clientName}</span>
                  <span className="text-gray-600">Category: {item.category}</span>
                  <span className="text-gray-600">Type: {item.type}</span>
                </div>
              </div>
              
              {/* Download All Button */}
              <Button
                onClick={downloadAllMedia}
                className="bg-coral-500 text-white hover:bg-coral-600"
                size="sm"
              >
                <Download className="h-4 w-4 mr-2" />
                Download All
              </Button>
            </div>
            
            {/* Admin Info */}
            {isAdmin && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <h3 className="text-sm font-semibold text-blue-900 mb-1">Admin Information</h3>
                <p className="text-xs text-blue-700">
                  Client URL: {typeof window !== 'undefined' ? `${window.location.origin}/client/portfolio/${item.id}` : ''}
                  {item.pin && ` | PIN: ${item.pin}`}
                </p>
              </div>
            )}
          </div>

          {/* Media Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {item.imageUrls.map((url, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                whileHover="hover"
                className="bg-white border border-coral-100 rounded-lg p-4 shadow-sm relative group"
              >
                {item.type === 'videography' && item.videoUrl && index === 0 ? (
                  // Show video for first item if it's videography
                  <div className="relative">
                    <video
                      src={item.videoUrl}
                      className="w-full h-48 object-cover rounded-md"
                      controls
                      muted
                    />
                    <button
                      onClick={() => handleDownload(item.videoUrl!, `${item.title}-video.mp4`)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Download video"
                    >
                      <Download className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                ) : (
                  // Show images
                  <div className="relative">
                    <img
                      src={url}
                      alt={`${item.title} - Image ${index + 1}`}
                      className="w-full h-48 object-cover rounded-md"
                      onError={(e) => {
                        e.currentTarget.src = '/images/image-placeholder.jpg';
                      }}
                    />
                    <button
                      onClick={() => handleDownload(url, `${item.title}-image-${index + 1}.jpg`)}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
                      title="Download image"
                    >
                      <Download className="h-4 w-4 text-gray-700" />
                    </button>
                  </div>
                )}
                
                <div className="mt-3">
                  <p className="text-xs text-gray-600">
                    {item.type === 'videography' && index === 0 ? 'Video' : `Image ${index + 1}`}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* PIN Modal for Downloads */}
        {showPinModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full"
            >
              <div className="flex items-center justify-center mb-4">
                <Lock className="h-6 w-6 text-coral-500" />
                <h2 className="ml-2 text-lg font-semibold text-teal-900">Enter PIN to Download</h2>
              </div>
              <p className="text-sm text-gray-600 text-center mb-4">
                This portfolio requires a PIN to download media files.
              </p>
              <form onSubmit={handlePinSubmit}>
                <Input
                  type="password"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="Enter PIN"
                  className="border-coral-100 text-teal-900 text-sm mb-2"
                  required
                />
                {pinError && <p className="text-xs text-red-500 text-center mb-2">{pinError}</p>}
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1 border-coral-100 text-coral-500 hover:bg-coral-50"
                    onClick={() => {
                      setShowPinModal(false);
                      setPin('');
                      setDownloadUrl(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-coral-500 text-white hover:bg-coral-600"
                  >
                    Unlock Downloads
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}