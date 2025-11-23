'use client';

import { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';

interface VideoPlayerProps {
  videoSrc: string;
  onClose: () => void;
}

export default function VideoPlayer({ videoSrc, onClose }: VideoPlayerProps) {
  const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be');
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    console.log('VideoPlayer mounted with videoSrc:', videoSrc);
    if (!isYouTube && videoRef.current) {
      // Ensure video is not muted and attempt to play after user interaction
      videoRef.current.muted = false;
      videoRef.current.play().catch((err) => {
        console.error('Video playback failed:', err.message);
        setError('Failed to play video. Please try clicking play manually.');
      });
    }
    return () => console.log('VideoPlayer unmounted');
  }, [videoSrc, isYouTube]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-[#001F44]/80 flex items-center justify-center z-50"
    >
      <div className="relative w-full max-w-4xl mx-4 sm:mx-6">
        <button
          onClick={() => {
            console.log('Closing VideoPlayer');
            onClose();
          }}
          className="absolute -top-8 sm:-top-10 right-0 text-white hover:text-coral-500 z-60"
        >
          <X className="h-6 w-6" />
        </button>
        {error && (
          <div className="absolute top-4 left-4 right-4 bg-red-600 text-white text-sm sm:text-base p-2 rounded-lg">
            {error}
          </div>
        )}
        {isYouTube ? (
          <iframe
            src={`${videoSrc}${videoSrc.includes('?') ? '&' : '?'}autoplay=0&controls=1&mute=0&rel=0`}
            title="Video Player"
            className="w-full h-[40vh] sm:h-[60vh] rounded-lg"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            onError={(e) => {
              console.error('Iframe error:', e);
              setError('Failed to load YouTube video. Check the URL or try again.');
            }}
            onLoad={() => console.log('YouTube iframe loaded successfully')}
          />
        ) : (
          <video
            ref={videoRef}
            src={videoSrc}
            controls
            autoPlay={false}
            muted={false}
            className="w-full h-[40vh] sm:h-[60vh] object-contain rounded-lg bg-black"
            onError={(e) => {
              console.error('Video playback error:', e);
              setError('Failed to play video. Ensure the video has an audio track and is accessible.');
            }}
            onCanPlay={() => {
              console.log('Video can play:', videoSrc);
              setError(null);
            }}
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
      </div>
    </motion.div>
  );
}