// lib/portfolio-access.ts
// Download PINs must never reach the public: anyone could read them from the
// API response or page HTML and unlock client galleries. Public responses get
// `hasPin` instead; only verified admins receive the PIN itself.
import { NextRequest } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export async function isAdminRequest(request: NextRequest): Promise<boolean> {
  const authHeader = request.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ') || !adminAuth || !adminDb) return false;
  try {
    const decoded = await adminAuth.verifyIdToken(authHeader.slice('Bearer '.length));
    const userDoc = await adminDb.collection('users').doc(decoded.uid).get();
    return userDoc.data()?.role === 'admin';
  } catch {
    return false;
  }
}

/** Replace the PIN with a boolean flag unless the caller is an admin. */
export function withPinAccess<T extends { pin?: string | null }>(item: T, includePin: boolean) {
  const { pin, ...rest } = item;
  return includePin ? { ...rest, pin: pin ?? null, hasPin: !!pin } : { ...rest, hasPin: !!pin };
}
