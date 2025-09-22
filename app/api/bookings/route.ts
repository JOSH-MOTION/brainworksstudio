// app/api/bookings/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, QueryDocumentSnapshot, DocumentData, CollectionReference, Query } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  try {
    initializeApp({
      credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!)),
    });
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
    throw new Error('Firebase Admin initialization failed');
  }
}

const db = getFirestore();
const auth = getAuth();

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    console.log('Authorization header:', authHeader ? 'Present' : 'Missing');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    let decodedToken;
    try {
      decodedToken = await auth.verifyIdToken(token);
      console.log('Token verified for user:', decodedToken.uid);
    } catch (error) {
      console.error('Token verification error:', error);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401 });
    }

    const userDoc = await db.collection('users').doc(decodedToken.uid).get();
    console.log('User doc exists:', userDoc.exists, 'Role:', userDoc.data()?.role);
    if (!userDoc.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    console.log('Status filter:', status);

    let bookingsQuery: CollectionReference<DocumentData> | Query<DocumentData> = db.collection('bookings');
    if (status) {
      bookingsQuery = bookingsQuery.where('status', '==', status);
    }

    const bookingsSnapshot = await bookingsQuery.get();
    console.log('Bookings fetched:', bookingsSnapshot.size);
    const bookings = bookingsSnapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date ? doc.data().date.toDate().toISOString() : null,
    }));

    return NextResponse.json(bookings, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings', debug: error.message },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decodedToken = await auth.verifyIdToken(token);

    const { date, type, clientId, status = 'pending' } = await req.json();
    if (!date || !type || !clientId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const bookingRef = await db.collection('bookings').add({
      date: new Date(date),
      type,
      clientId,
      userId: decodedToken.uid,
      status,
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({ id: bookingRef.id, message: 'Booking created successfully' }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking', debug: error.message },
      { status: 500 }
    );
  }
}