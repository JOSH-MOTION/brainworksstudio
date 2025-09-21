import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const portfolioSnapshot = await adminDb.collection('portfolio')
      .orderBy('featured', 'desc')
      .orderBy('createdAt', 'desc')
      .get();
    
    const portfolioItems = portfolioSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
    }));

    return NextResponse.json(portfolioItems);
  } catch (error) {
    console.error('Error fetching portfolio items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Verify admin authentication
    const authHeader = request.headers.get('authorization');
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      const decodedToken = await adminAuth?.verifyIdToken(token);
      
      // Check if user is admin
      const userDoc = await adminDb?.collection('users').doc(decodedToken?.uid || '').get();
      if (!userDoc?.exists || userDoc.data()?.role !== 'admin') {
        return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
      }
    }

    const portfolioData = await request.json();
    
    const newItem = {
      ...portfolioData,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb?.collection('portfolio').add(newItem);
    
    return NextResponse.json({ 
      success: true, 
      portfolioId: docRef?.id 
    });
  } catch (error) {
    console.error('Error creating portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to create portfolio item' },
      { status: 500 }
    );
  }
}