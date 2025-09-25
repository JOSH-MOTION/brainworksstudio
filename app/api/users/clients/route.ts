// app/api/users/clients/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    if (!adminAuth || !adminDb) {
      console.error('Firebase Admin not initialized');
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
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const usersSnapshot = await adminDb
      .collection('users')
      .where('role', '==', 'client')
      .get();

    const clients = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      displayName: doc.data().displayName || '',
      email: doc.data().email || '',
    }));

    return NextResponse.json(clients, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching clients:', error);
    return NextResponse.json(
      { error: 'Failed to fetch clients', debug: error.message },
      { status: 500 }
    );
  }
}