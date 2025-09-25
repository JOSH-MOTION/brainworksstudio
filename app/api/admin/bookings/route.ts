// app/api/admin/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!)),
  });
}

const db = getFirestore();
const auth = getAuth();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(token);

    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Get all bookings
    const bookingsSnapshot = await db.collection('bookings').orderBy('createdAt', 'desc').get();
    
    // Get all unique user IDs from bookings
    const userIdsSet = new Set<string>();
    bookingsSnapshot.docs.forEach((doc: any) => {
      const data = doc.data();
      if (data.userId) {
        userIdsSet.add(data.userId);
      }
    });
    const userIds = Array.from(userIdsSet);
    
    // Fetch user information for all users
    const userInfoPromises = userIds.map(async (userId: string) => {
      const userDoc = await db.collection('users').doc(userId).get();
      return { 
        userId, 
        userData: userDoc.exists ? userDoc.data() : null 
      };
    });
    
    const userInfoResults = await Promise.all(userInfoPromises);
    const userInfoMap = new Map<string, any>();
    userInfoResults.forEach(({ userId, userData }) => {
      userInfoMap.set(userId, userData);
    });

    // Combine booking data with user information
    const bookings = bookingsSnapshot.docs.map((doc: any) => {
      const data = doc.data();
      const userData = userInfoMap.get(data.userId);
      
      return {
        id: doc.id,
        bookingId: data.bookingId,
        userId: data.userId,
        userInfo: userData ? {
          displayName: userData.displayName || 'Unknown User',
          email: userData.email || 'No email',
          phone: userData.phone || null,
          profileImageUrl: userData.profileImageUrl || null,
        } : {
          displayName: 'Unknown User',
          email: 'No email',
          phone: null,
          profileImageUrl: null,
        },
        serviceCategory: data.serviceCategory,
        startDateTime: data.startDateTime?.toDate?.() ? data.startDateTime.toDate() : data.startDateTime,
        endDateTime: data.endDateTime?.toDate?.() ? data.endDateTime.toDate() : data.endDateTime,
        location: data.location,
        attachments: data.attachments || [],
        additionalNotes: data.additionalNotes,
        status: data.status,
        adminNotes: data.adminNotes,
        createdAt: data.createdAt?.toDate?.() ? data.createdAt.toDate() : data.createdAt,
        updatedAt: data.updatedAt?.toDate?.() ? data.updatedAt.toDate() : data.updatedAt,
      };
    });

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', debug: error.message },
      { status: 500 }
    );
  }
}