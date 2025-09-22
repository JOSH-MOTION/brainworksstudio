// app/api/admin/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getFirestore, CollectionReference, Query, DocumentData } from 'firebase-admin/firestore';
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
  console.log('GET /api/admin/users called with URL:', req.url);
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
    const role = searchParams.get('role');
    console.log('Role filter:', role);

    let usersQuery: CollectionReference<DocumentData> | Query<DocumentData> = db.collection('users');
    if (role) {
      usersQuery = usersQuery.where('role', '==', role);
    }

    const usersSnapshot = await usersQuery.get();
    console.log('Users fetched:', usersSnapshot.size);
    const users = usersSnapshot.docs.map((doc) => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt ? doc.data().createdAt.toDate().toISOString() : null,
    }));

    return NextResponse.json(users, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users', debug: error.message },
      { status: 500 }
    );
  }
}