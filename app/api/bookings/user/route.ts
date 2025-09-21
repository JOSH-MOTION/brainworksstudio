import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      console.error('Firebase Admin not properly initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }
    
    console.log('User requesting bookings:', decodedToken.uid);

    // Fetch bookings for this user
    const bookingsSnapshot = await adminDb.collection('bookings')
      .where('userId', '==', decodedToken.uid)
      .orderBy('createdAt', 'desc')
      .get();
    
    const bookings = bookingsSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        bookingId: data.bookingId || doc.id,
        userId: data.userId,
        serviceCategory: data.serviceCategory,
        startDateTime: data.startDateTime?.toDate?.() || data.startDateTime,
        endDateTime: data.endDateTime?.toDate?.() || data.endDateTime,
        location: data.location,
        additionalNotes: data.additionalNotes,
        adminNotes: data.adminNotes,
        status: data.status,
        attachments: data.attachments || [],
        createdAt: data.createdAt?.toDate?.() || data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() || data.updatedAt,
      };
    });

    console.log(`Found ${bookings.length} bookings for user ${decodedToken.uid}`);

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}