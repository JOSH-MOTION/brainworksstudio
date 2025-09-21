import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth?.verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if user is admin
    const userDoc = await adminDb?.collection('users').doc(decodedToken.uid).get();
    if (!userDoc?.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    const bookingsSnapshot = await adminDb?.collection('bookings')
      .orderBy('createdAt', 'desc')
      .get();
    
    const bookings = bookingsSnapshot?.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
      startDateTime: doc.data().startDateTime?.toDate?.() || doc.data().startDateTime,
      endDateTime: doc.data().endDateTime?.toDate?.() || doc.data().endDateTime,
    })) || [];

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}