import { adminDb } from '@/lib/firebase-admin';

export interface ServerReview {
  id: string;
  clientName: string;
  clientImage?: string;
  rating: number;
  reviewText: string;
  serviceType: string;
  approved: boolean;
  adminResponse?: string;
  createdAt: string;
}

/**
 * Server-only fetch of approved reviews directly from Firestore, used so the
 * homepage testimonials section has real, crawlable content (and real
 * Review/AggregateRating signals for Google) in its initial HTML instead of
 * a "Loading testimonials..." spinner that never resolves for crawlers.
 */
export async function getApprovedReviews(): Promise<ServerReview[]> {
  if (!adminDb) {
    console.error('getApprovedReviews: Firebase Admin not initialized');
    return [];
  }

  try {
    const snapshot = await adminDb
      .collection('reviews')
      .where('approved', '==', true)
      .orderBy('createdAt', 'desc')
      .get();

    return snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        clientName: data.clientName || 'Anonymous',
        clientImage: data.clientImage || undefined,
        rating: data.rating || 5,
        reviewText: data.reviewText || '',
        serviceType: data.serviceType || '',
        approved: data.approved || false,
        adminResponse: data.adminResponse || undefined,
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
      } as ServerReview;
    });
  } catch (error) {
    console.error('getApprovedReviews: Error fetching reviews:', error);
    return [];
  }
}
