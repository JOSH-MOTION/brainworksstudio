import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth } from 'firebase-admin/auth';
import { initializeApp, getApps, cert } from 'firebase-admin/app';

if (!getApps().length) {
  initializeApp({
    credential: cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON!)),
  });
}

const adminAuth = getAuth();

export async function GET(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { uid } = params;
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    const userData = userDoc.data();
    // Only return public fields for team members
    if (userData.role !== 'client' && userData.role !== 'user') {
      return NextResponse.json({
        uid,
        displayName: userData.displayName,
        role: userData.role,
        description: userData.description,
        profileImageUrl: userData.profileImageUrl,
        socials: userData.socials,
      });
    }
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: { params: { uid: string } }) {
  try {
    const { uid } = params;
    const token = req.headers.get('authorization')?.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const decodedToken = await adminAuth.verifyIdToken(token);
    if (decodedToken.uid !== uid && !decodedToken.role?.includes('admin')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const data = await req.json();
    const updatedData = {
      displayName: data.displayName || '',
      role: decodedToken.role?.includes('admin') ? data.role || 'user' : undefined,
      description: data.description || '',
      profileImageUrl: data.profileImageUrl || '',
      socials: data.socials || [],
      updatedAt: new Date().toISOString(),
    };
    await setDoc(doc(db, 'users', uid), updatedData, { merge: true });
    return NextResponse.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}