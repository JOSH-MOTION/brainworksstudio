import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

interface RotatingBadgeProps {
  text: string;
  href?: string;
  className?: string;
  /** 'light' text for dark backgrounds, 'dark' text for light backgrounds. */
  tone?: 'light' | 'dark';
}

// A continuously-spinning circular text badge with a fixed centre icon —
// the "stamp" motif used near calls to action.
export default function RotatingBadge({ text, href = '/contact', className = '', tone = 'light' }: RotatingBadgeProps) {
  const repeated = `${text} • `.repeat(2);
  const id = `rotating-badge-path-${text.replace(/\s+/g, '-').toLowerCase()}`;
  const textColor = tone === 'light' ? 'text-white/70 group-hover:text-white' : 'text-navy-900/70 group-hover:text-navy-900';

  return (
    <Link
      href={href}
      aria-label={text}
      className={`group relative inline-flex h-28 w-28 shrink-0 items-center justify-center ${className}`}
    >
      <svg viewBox="0 0 100 100" className={`absolute inset-0 h-full w-full animate-[spin_9s_linear_infinite] ${textColor}`}>
        <defs>
          <path id={id} d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0" />
        </defs>
        <text fill="currentColor" fontSize="8.2" fontWeight="700" letterSpacing="1.5">
          <textPath href={`#${id}`} startOffset="0%">
            {repeated}
          </textPath>
        </text>
      </svg>
      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-gold-500 text-white transition-transform duration-300 group-hover:scale-110">
        <ArrowUpRight className="h-4 w-4" />
      </span>
    </Link>
  );
}
