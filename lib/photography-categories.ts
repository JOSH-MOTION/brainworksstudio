// lib/photography-categories.ts
// Maps URL-friendly category slugs (used in /photography/[category]) to the
// exact category values stored on portfolio items in Firestore.
import { categorySlug } from './portfolio-category-slug';

export const PHOTOGRAPHY_CATEGORY_LABELS: Record<string, string> = {
  corporate: 'Corporate',
  event: 'Event',
  portrait: 'Portrait',
  fashion: 'Fashion',
  product: 'Product',
  'travel-landscape': 'Travel & Landscape',
  'documentary-lifestyle': 'Documentary & Lifestyle',
  'creative-artistic': 'Creative/Artistic',
  others: 'Others',
};

export { categorySlug };

export function getCategoryLabel(slug: string): string {
  return PHOTOGRAPHY_CATEGORY_LABELS[slug] || slug.replace(/-/g, ' ');
}
