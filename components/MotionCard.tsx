'use client';

import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface MotionCardProps {
  children: ReactNode;
  /** Position in its grid — staggers the entrance so cards cascade in. */
  index?: number;
  className?: string;
  /** Gold accent line that sweeps across the top edge on hover. */
  accent?: boolean;
  /** Pixels the card lifts on hover. */
  lift?: number;
}

// Shared card motion: staggered fade/slide-in on scroll, lift + shadow on hover.
// Children can react to hover with Tailwind `group-hover:` classes.
export default function MotionCard({ children, index = 0, className = '', accent = true, lift = 6 }: MotionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.97 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.09, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -lift, transition: { type: 'spring', stiffness: 300, damping: 20 } }}
      whileTap={{ scale: 0.98 }}
      className={`group relative overflow-hidden transition-shadow duration-300 hover:z-10 hover:shadow-[0_24px_48px_-20px_rgba(26,48,80,0.45)] ${className}`}
    >
      {accent && (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-[3px] origin-left scale-x-0 bg-gold-500 transition-transform duration-500 ease-out group-hover:scale-x-100"
        />
      )}
      {children}
    </motion.div>
  );
}
