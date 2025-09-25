import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  console.log('Handling GET request for /api/bookings/user');
  try {
    if (!adminAuth || !adminDb) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    console.log('Authorization header:', authHeader);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('Token length:', token.length);

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
      console.log('Decoded token UID:', decodedToken.uid);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    console.log('Querying Firestore for userId:', decodedToken.uid);
    const bookingsSnapshot = await adminDb
      .collection('bookings')
      .where('userId', '==', decodedToken.uid)
      .orderBy('createdAt', 'desc')
      .get();
    console.log('Bookings found:', bookingsSnapshot.size);

    const bookings = bookingsSnapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        bookingId: data.bookingId,
        userId: data.userId,
        serviceCategory: data.serviceCategory,
        startDateTime: data.startDateTime?.toDate?.()
          ? data.startDateTime.toDate().toISOString()
          : data.startDateTime,
        endDateTime: data.endDateTime?.toDate?.()
          ? data.endDateTime.toDate().toISOString()
          : data.endDateTime,
        location: data.location,
        attachments: data.attachments || [],
        additionalNotes: data.additionalNotes,
        status: data.status,
        adminNotes: data.adminNotes,
        createdAt: data.createdAt?.toDate?.()
          ? data.createdAt.toDate().toISOString()
          : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.()
          ? data.updatedAt.toDate().toISOString()
          : data.updatedAt,
      };
    });

    console.log('Returning bookings:', bookings.length);
    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching user bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', debug: error.message },
      { status: 500 }
    );
  }
}