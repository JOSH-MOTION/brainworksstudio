'use client';

import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface VideoPlayerProps {
  videoSrc: string;
  onClose: () => void;
}

export default function VideoPlayer({ videoSrc, onClose }: VideoPlayerProps) {
  const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be');

  useEffect(() => {
    console.log('VideoPlayer mounted with videoSrc:', videoSrc);
    return () => console.log('VideoPlayer unmounted');
  }, [videoSrc]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-teal-900/80 flex items-center justify-center z-50"
    >
      <div className="relative w-full max-w-4xl mx-4 sm:mx-6">
        <button
          onClick={onClose}
          className="absolute -top-8 sm:-top-10 right-0 text-white hover:text-coral-500"
        >
          <X className="h-6 w-6" />
        </button>
        {isYouTube ? (
          <iframe
            src={`${videoSrc}${videoSrc.includes('?') ? '&' : '?'}autoplay=0&controls=1&mute=0`}
            title="Video Player"
            className="w-full h-[40vh] sm:h-[60vh] rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={(e) => console.error('Iframe error:', e)}
          />
        ) : (
          <video
            src={videoSrc}
            controls
            autoPlay={false}
            muted={false}
            className="w-full h-[40vh] sm:h-[60vh] object-contain rounded-lg bg-black"
            onError={(e) => console.error('Video playback error:', e)}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </motion.div>
  );
}