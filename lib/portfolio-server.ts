import { adminDb } from '@/lib/firebase-admin';
import { PortfolioItem } from '@/types';

/**
 * Server-only fetch of portfolio items directly from Firestore.
 * Used by the Portfolio page (Server Component) so real content is present
 * in the initial HTML for search engines, instead of relying on a client-side
 * fetch that only resolves after JavaScript runs in the browser.
 */
export async function getPortfolioItems(): Promise<PortfolioItem[]> {
  if (!adminDb) {
    console.error('getPortfolioItems: Firebase Admin not initialized');
    return [];
  }

  try {
    const snapshot = await adminDb.collection('portfolio').orderBy('createdAt', 'desc').get();

    const items = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        title: data.title || '',
        type: data.type || 'photography',
        category: data.category || '',
        tags: data.tags || [],
        imageUrls: data.imageUrls || [],
        videoUrl: data.videoUrl || null,
        caption: data.caption || null,
        clientName: data.clientName || null,
        featured: data.featured || false,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
        createdBy: data.createdBy || '',
        clientId: data.clientId || null,
        pin: data.pin || data.downloadPin || null,
      } as PortfolioItem;
    });

    items.sort((a, b) => (a.featured === b.featured ? 0 : a.featured ? -1 : 1));
    return items;
  } catch (error) {
    console.error('getPortfolioItems: Error fetching portfolio items:', error);
    return [];
  }
}

export async function getPortfolioItemById(id: string): Promise<PortfolioItem | null> {
  if (!adminDb) {
    console.error('getPortfolioItemById: Firebase Admin not initialized');
    return null;
  }

  try {
    const doc = await adminDb.collection('portfolio').doc(id).get();
    if (!doc.exists) return null;
    const data = doc.data()!;
    return {
      id: doc.id,
      title: data.title || '',
      type: data.type || 'photography',
      category: data.category || '',
      tags: data.tags || [],
      imageUrls: data.imageUrls || [],
      videoUrl: data.videoUrl || null,
      caption: data.caption || null,
      clientName: data.clientName || null,
      featured: data.featured || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
      createdBy: data.createdBy || '',
      clientId: data.clientId || null,
      pin: data.pin || data.downloadPin || null,
    } as PortfolioItem;
  } catch (error) {
    console.error('getPortfolioItemById: Error fetching portfolio item:', error);
    return null;
  }
}
