// app/api/newsletter/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  if (!adminDb) {
    console.error('Firebase Admin not initialized');
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }

  try {
    const { email } = await request.json();
    const normalized = typeof email === 'string' ? email.trim().toLowerCase() : '';

    if (!EMAIL_RE.test(normalized) || normalized.length > 254) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    // Use the email as the doc id so repeat sign-ups don't create duplicates.
    await adminDb
      .collection('newsletter')
      .doc(normalized)
      .set({ email: normalized, subscribedAt: new Date() }, { merge: true });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error subscribing to newsletter:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}
