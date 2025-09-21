import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/firebase';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';

export async function GET(req: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'No authorization token' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    
    try {
      decodedToken = await auth.verifyIdToken(token);
    } catch (error) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    // Check if user is admin
    const userDoc = await getDocs(query(collection(db, 'users'), where('uid', '==', decodedToken.uid)));
    if (userDoc.empty || userDoc.docs[0].data().role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized - Admin access required' }, { status: 403 });
    }

    // Fetch all bookings
    const bookingsRef = collection(db, 'bookings');
    const bookingsQuery = query(bookingsRef, orderBy('createdAt', 'desc'));
    const bookingsSnapshot = await getDocs(bookingsQuery);

    const bookingsWithUserInfo = [];

    // For each booking, fetch the user information
    for (const doc of bookingsSnapshot.docs) {
      const bookingData = doc.data();
      
      // Fetch user info
      const userQuery = query(collection(db, 'users'), where('uid', '==', bookingData.userId));
      const userSnapshot = await getDocs(userQuery);
      
      const userInfo = userSnapshot.empty ? {
        displayName: 'Unknown User',
        email: 'No email',
        phone: null,
        profileImageUrl: null,
      } : {
        displayName: userSnapshot.docs[0].data().displayName || 'Unknown User',
        email: userSnapshot.docs[0].data().email || 'No email',
        phone: userSnapshot.docs[0].data().phone || null,
        profileImageUrl: userSnapshot.docs[0].data().profileImageUrl || null,
      };

      bookingsWithUserInfo.push({
        id: doc.id,
        bookingId: doc.id,
        userId: bookingData.userId,
        userInfo,
        serviceCategory: bookingData.serviceCategory,
        startDateTime: bookingData.startDateTime,
        endDateTime: bookingData.endDateTime,
        location: bookingData.location || { address: 'No location specified' },
        additionalNotes: bookingData.additionalNotes || '',
        adminNotes: bookingData.adminNotes || '',
        status: bookingData.status || 'pending',
        attachments: bookingData.attachments || [],
        createdAt: bookingData.createdAt,
        updatedAt: bookingData.updatedAt || bookingData.createdAt,
      });
    }

    return NextResponse.json(bookingsWithUserInfo);

  } catch (error) {
    console.error('Error fetching admin bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}