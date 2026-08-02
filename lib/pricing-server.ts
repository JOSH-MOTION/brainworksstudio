import { adminDb } from '@/lib/firebase-admin';

export interface ServerPricingPackage {
  name: string;
  price: string;
  duration?: string;
  description: string;
  includes: string[];
  featured: boolean;
  order: number;
}

export interface ServerPricingCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  published: boolean;
  order: number;
  packages: ServerPricingPackage[];
}

/**
 * Server-only fetch of published pricing categories directly from Firestore,
 * used so the Pricing page has real, crawlable content in its initial HTML.
 */
export async function getPublishedPricingCategories(): Promise<ServerPricingCategory[]> {
  if (!adminDb) {
    console.error('getPublishedPricingCategories: Firebase Admin not initialized');
    return [];
  }

  try {
    let docs;
    try {
      const snapshot = await adminDb
        .collection('pricing-categories')
        .where('published', '==', true)
        .orderBy('order', 'asc')
        .get();
      docs = snapshot.docs;
    } catch (indexError) {
      // Fallback if a composite index isn't set up yet: filter/sort in memory.
      const allDocs = await adminDb.collection('pricing-categories').get();
      docs = allDocs.docs
        .filter((doc) => doc.data().published === true)
        .sort((a, b) => (a.data().order || 0) - (b.data().order || 0));
    }

    return docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data.name || '',
        slug: data.slug || '',
        description: data.description || '',
        longDescription: data.longDescription || '',
        imageUrl: data.imageUrl || '',
        published: data.published !== undefined ? data.published : true,
        order: data.order || 0,
        packages: (data.packages || []).sort((a: any, b: any) => (a.order || 0) - (b.order || 0)),
      } as ServerPricingCategory;
    });
  } catch (error) {
    console.error('getPublishedPricingCategories: Error fetching categories:', error);
    return [];
  }
}

export async function getPricingCategoryBySlug(slug: string): Promise<ServerPricingCategory | null> {
  const categories = await getPublishedPricingCategories();
  return categories.find((c) => c.slug === slug) || null;
}
