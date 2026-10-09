import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

// Shared admin-auth check used by the sms-contacts / sms routes — same
// bearer-token + users/{uid}.role==='admin' pattern as the rest of /api/admin.
export async function requireAdmin(request: NextRequest): Promise<{ uid: string } | NextResponse> {
  if (!adminAuth || !adminDb) {
    return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
  }

  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
  }

  const token = authHeader.replace('Bearer ', '');
  let decodedToken;
  try {
    decodedToken = await adminAuth.verifyIdToken(token);
  } catch {
    return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
  }

  const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
  if (userDoc.data()?.role !== 'admin') {
    return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
  }

  return { uid: decodedToken.uid };
}
