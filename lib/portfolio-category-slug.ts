// lib/portfolio-category-slug.ts
// Normalizes a Firestore category value (e.g. "Travel & Landscape") into the
// slug format used in category page URLs (e.g. "travel-landscape"), so items
// can be matched to a category page regardless of exact casing/punctuation.
export function categorySlug(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}
