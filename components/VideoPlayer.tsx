'use client';

import { motion } from 'framer-motion';

interface VideoPlayerProps {
  videoSrc: string; // YouTube embed URL
  onClose: () => void;
}

export default function VideoPlayer({ videoSrc, onClose }: VideoPlayerProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full">
        <iframe
          src={videoSrc}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-auto max-h-[90vh] aspect-video"
        ></iframe>
        <button
          className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2"
          onClick={onClose}
        >
          ✕
        </button>
      </div>
    </motion.div>
  );
}