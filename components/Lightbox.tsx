'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface LightboxProps {
  image: string;
  onClose: () => void;
}

export default function Lightbox({ image, onClose }: LightboxProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full">
        <Image
          src={image}
          alt="Full-screen image"
          width={1200}
          height={800}
          className="object-contain w-full h-auto max-h-[90vh]"
        />
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