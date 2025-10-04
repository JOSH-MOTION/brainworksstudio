'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Lock } from 'lucide-react';

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
  pin?: string; // Optional PIN for access
}

export default function ClientPortfolioPage() {
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [pin, setPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(false);
  const params = useParams();
  const router = useRouter();
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
        // Assume PIN is stored in data.pin or fetched separately
        setLoading(false);
      } catch (error) {
        console.error('Error fetching portfolio item:', error);
        setLoading(false);
        router.push('/404'); // Redirect to custom 404 page
      }
    };
    fetchPortfolioItem();
  }, [id, router]);

  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Replace with actual PIN validation logic (e.g., compare with item.pin or API call)
    if (pin === '1234') { // Example PIN; replace with actual PIN from data or API
      setIsAuthorized(true);
      setPinError('');
    } else {
      setPinError('Invalid PIN');
    }
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

  if (!isAuthorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-teal-50">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="bg-white p-6 rounded-lg shadow-sm border border-coral-100 max-w-md w-full"
        >
          <div className="flex items-center justify-center mb-4">
            <Lock className="h-6 w-6 text-coral-500" />
            <h2 className="ml-2 text-lg font-semibold text-teal-900">Enter PIN</h2>
          </div>
          <form onSubmit={handlePinSubmit}>
            <Input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Enter PIN"
              className="border-coral-100 text-teal-900 text-sm"
            />
            {pinError && <p className="text-xs text-red-500 mt-2">{pinError}</p>}
            <Button
              type="submit"
              className="w-full mt-4 bg-coral-500 text-white hover:bg-coral-600 text-sm"
            >
              Submit
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-teal-50 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, ease: 'easeOut' }}>
          <h1 className="text-2xl font-bold text-teal-900 mb-4">{item.title}</h1>
          <p className="text-sm text-gray-600 mb-4">{item.caption}</p>
          <p className="text-sm text-coral-500 font-medium mb-4">Client: {item.clientName}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {item.imageUrls.map((url, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover="hover"
                className="bg-white border border-coral-100 rounded-lg p-4 shadow-sm"
              >
                {url.endsWith('.mp4') ? (
                  <video
                    src={url}
                    className="w-full h-48 object-contain rounded-md"
                    controls
                    muted
                    autoPlay
                    loop
                    onError={(e) => {
                      console.error('Error loading video:', url);
                      e.currentTarget.poster = '/images/video-placeholder.jpg';
                    }}
                  />
                ) : (
                  <img
                    src={url}
                    alt={item.caption}
                    className="w-full h-48 object-contain rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = '/images/image-placeholder.jpg';
                    }}
                  />
                )}
                <p className="text-xs text-gray-600 mt-2">Type: {item.type}</p>
                <p className="text-xs text-gray-600">Category: {item.category}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}