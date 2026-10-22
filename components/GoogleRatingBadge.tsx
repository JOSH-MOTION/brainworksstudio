import { Star } from 'lucide-react';
import { SITE } from '@/lib/site-config';
import GoogleG from '@/components/GoogleG';

export default function GoogleRatingBadge({ className = '' }: { className?: string }) {
  const fillPct = Math.max(0, Math.min(1, SITE.googleRating / 5)) * 100;

  return (
    <a
      href={SITE.googleReviewUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-3 rounded-full border border-gray-200 bg-white px-5 py-2.5 shadow-sm transition-shadow hover:shadow-md ${className}`}
    >
      <GoogleG className="h-5 w-5 flex-shrink-0" />
      <span className="h-5 w-px bg-gray-200" />
      <span className="relative inline-flex" aria-hidden="true">
        <span className="flex gap-0.5 text-gray-300">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 fill-current" />
          ))}
        </span>
        <span className="absolute inset-0 flex gap-0.5 overflow-hidden text-gold-500" style={{ width: `${fillPct}%` }}>
          {Array.from({ length: 5 }).map((_, i) => (
            <Star key={i} className="h-4 w-4 flex-shrink-0 fill-current" />
          ))}
        </span>
      </span>
      <span className="text-sm font-semibold text-navy-900">
        {SITE.googleRating.toFixed(1)}{' '}
        <span className="font-normal text-gray-500">({SITE.googleReviewCount} Google reviews)</span>
      </span>
    </a>
  );
}
