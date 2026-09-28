import { ReactNode } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight } from 'lucide-react';
import MotionCard from '@/components/MotionCard';

interface ImageCardProps {
  href: string;
  image: string;
  imageAlt: string;
  title: string;
  summary: string;
  index?: number;
  kicker?: string;
  cta?: string;
  /** Extra content revealed under the summary (e.g. an "includes" list). */
  children?: ReactNode;
  headingLevel?: 'h2' | 'h3';
}

// Single-layer photo card: the text sits directly on the image over a navy
// gradient. On hover the photo zooms, the gradient deepens, and the summary/CTA
// slide up into view.
export default function ImageCard({
  href,
  image,
  imageAlt,
  title,
  summary,
  index = 0,
  kicker,
  cta = 'Explore',
  children,
  headingLevel = 'h3',
}: ImageCardProps) {
  const Heading = headingLevel;
  return (
    <MotionCard index={index} lift={8} className="h-full rounded-2xl bg-navy-900">
      <Link href={href} className="relative block aspect-[3/4] h-full min-h-[340px] overflow-hidden rounded-2xl">
        <Image
          src={image}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
        />
        {/* Gradient keeps the text readable on any photo */}
        <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/55 to-navy-950/5 transition-all duration-500 group-hover:via-navy-950/75" />

        {kicker && (
          <span className="absolute left-5 top-5 rounded-full bg-navy-950/50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-gold-200 backdrop-blur-sm">
            {kicker}
          </span>
        )}

        <div className="absolute inset-x-0 bottom-0 p-6 text-white">
          <span className="mb-3 block h-[2px] w-10 bg-gold-400 transition-all duration-500 group-hover:w-16" />
          <Heading className="font-serif text-xl font-bold leading-snug">{title}</Heading>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/80">{summary}</p>
          {children && (
            <div className="grid grid-rows-[0fr] opacity-0 transition-all duration-500 group-hover:grid-rows-[1fr] group-hover:opacity-100">
              <div className="overflow-hidden">{children}</div>
            </div>
          )}
          <span className="mt-4 inline-flex items-center text-sm font-semibold text-gold-300">
            {cta} <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-2" />
          </span>
        </div>
      </Link>
    </MotionCard>
  );
}
