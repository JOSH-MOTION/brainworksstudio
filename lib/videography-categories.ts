// lib/videography-categories.ts
// Maps URL-friendly category slugs (used in /videography/[category]) to the
// exact category values stored on portfolio items in Firestore.
import { categorySlug } from './portfolio-category-slug';

export const VIDEOGRAPHY_CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  corporate: 'Corporate',
  event: 'Event',
  'music-videos': 'Music Videos',
  'commercials-adverts': 'Commercials & Adverts',
  documentary: 'Documentary',
  'short-films-creative-projects': 'Short Films / Creative Projects',
  promotional: 'Promotional',
  'social-media': 'Social Media',
  others: 'Others',
};

export { categorySlug };

export function getCategoryLabel(slug: string): string {
  return VIDEOGRAPHY_CATEGORY_LABELS[slug] || slug.replace(/-/g, ' ');
}
