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
    
    // Check if user is admin
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }
    
    console.log('Admin fetching all bookings');

    // Fetch all bookings with user information
    const bookingsSnapshot = await adminDb.collection('bookings')
      .orderBy('createdAt', 'desc')
      .get();
    
    const bookingsWithUserInfo = [];
    
    for (const doc of bookingsSnapshot.docs) {
      const bookingData = doc.data();
      
      // Fetch user information for each booking
      let userInfo = null;
      if (bookingData.userId) {
        try {
          const userDoc = await adminDb.collection('users').doc(bookingData.userId).get();
          if (userDoc.exists) {
            const userData = userDoc.data();
            userInfo = {
              displayName: userData.displayName || 'Unknown User',
              email: userData.email || 'No email',
              phone: userData.phone || '',
              profileImageUrl: userData.profileImageUrl || null,
            };
          }
        } catch (error) {
          console.error('Error fetching user info for booking:', doc.id, error);
          userInfo = {
            displayName: 'Unknown User',
            email: 'Error loading email',
            phone: '',
            profileImageUrl: null,
          };
        }
      }

      bookingsWithUserInfo.push({
        id: doc.id,
        bookingId: bookingData.bookingId || doc.id,
        userId: bookingData.userId,
        userInfo: userInfo,
        serviceCategory: bookingData.serviceCategory,
        startDateTime: bookingData.startDateTime?.toDate?.() || bookingData.startDateTime,
        endDateTime: bookingData.endDateTime?.toDate?.() || bookingData.endDateTime,
        location: bookingData.location,
        additionalNotes: bookingData.additionalNotes,
        adminNotes: bookingData.adminNotes,
        status: bookingData.status,
        attachments: bookingData.attachments || [],
        createdAt: bookingData.createdAt?.toDate?.() || bookingData.createdAt,
        updatedAt: bookingData.updatedAt?.toDate?.() || bookingData.updatedAt,
      });
    }

    console.log(`Found ${bookingsWithUserInfo.length} total bookings for admin view`);

    return NextResponse.json(bookingsWithUserInfo);
  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}