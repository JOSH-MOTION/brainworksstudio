'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, X, Download } from 'lucide-react';

interface LightboxProps {
  images: string[];          // all images (for navigation)
  initialIndex: number;      // start index
  onClose: () => void;
  onPrev?: () => void;
  onNext?: () => void;
  onDownload?: () => void;
}

export default function Lightbox({
  images,
  initialIndex,
  onClose,
  onPrev,
  onNext,
  onDownload,
}: LightboxProps) {
  const total = images.length;
  const current = initialIndex + 1;

  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-95 flex items-center justify-center z-50 p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div
        className="relative w-full h-full flex flex-col items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          className="absolute top-4 right-4 text-white bg-white/10 hover:bg-white/20 rounded-full p-2 transition"
          onClick={onClose}
        >
          <X className="w-6 h-6" />
        </button>

        {/* Counter */}
        {total > 1 && (
          <div className="absolute top-4 left-4 bg-white/10 backdrop-blur text-white px-4 py-1.5 rounded-full text-sm font-medium">
            {current} / {total}
          </div>
        )}

        {/* Download */}
        {onDownload && (
          <button
            className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition"
            onClick={onDownload}
          >
            <Download className="w-5 h-5" />
          </button>
        )}

        {/* Prev / Next */}
        {total > 1 && onPrev && (
          <button
            className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
            onClick={onPrev}
          >
            <ChevronLeft className="w-8 h-8" />
          </button>
        )}
        {total > 1 && onNext && (
          <button
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white rounded-full p-3 transition"
            onClick={onNext}
          >
            <ChevronRight className="w-8 h-8" />
          </button>
        )}

        {/* Full Image */}
        <Image
          src={images[initialIndex]}
          alt={`Image ${current}`}
          width={0}
          height={0}
          sizes="100vw"
          className="max-w-full max-h-full object-contain"
          priority
        />
      </div>
    </motion.div>
  );
}