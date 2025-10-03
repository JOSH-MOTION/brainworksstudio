'use client';

import { motion, Variants } from 'framer-motion';
import { X } from 'lucide-react';

interface VideoPlayerProps {
  videoSrc: string; // YouTube embed URL or ImageKit video URL
  onClose: () => void;
}

const videoPlayerVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3, ease: 'easeOut' as const } },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.3, ease: 'easeOut' as const } },
};

export default function VideoPlayer({ videoSrc, onClose }: VideoPlayerProps) {
  const isYouTube = videoSrc.includes('youtube.com') || videoSrc.includes('youtu.be');

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // Prevent closing when clicking inside the video container
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <motion.div
      className="fixed inset-0 bg-navy-900 bg-opacity-75 flex items-center justify-center z-50"
      variants={videoPlayerVariants}
      initial="hidden"
      animate="visible"
      exit="hidden"
      onClick={handleOverlayClick}
    >
      <div className="relative max-w-5xl w-full bg-navy-900 rounded-lg overflow-hidden">
        {isYouTube ? (
          <iframe
            src={videoSrc}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-auto max-h-[90vh] aspect-video"
          ></iframe>
        ) : (
          <video
            controls
            className="w-full h-auto max-h-[90vh] aspect-video"
            title="Portfolio video"
          >
            <source src={videoSrc} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        <button
          className="absolute top-4 right-4 text-white hover:text-gold-500 bg-navy-800 rounded-full p-2"
          onClick={onClose}
          aria-label="Close video player"
        >
          <X className="w-6 h-6" />
        </button>
      </div>
    </motion.div>
  );
}