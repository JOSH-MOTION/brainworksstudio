import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_RATE_CARDS = [
  {
    serviceType: 'photography',
    category: 'Event Photography',
    serviceName: 'Basic Event Coverage',
    description: 'Perfect for small gatherings and private events',
    price: '₵1,500.00',
    duration: '3 hours',
    includes: ['Up to 100 edited photos', 'Online gallery', 'High-resolution downloads', '1 photographer'],
    featured: false,
    order: 1,
  },
  {
    serviceType: 'photography',
    category: 'Event Photography',
    serviceName: 'Premium Event Coverage',
    description: 'Comprehensive coverage for weddings and corporate events',
    price: '₵3,500.00',
    duration: '6 hours',
    includes: ['Up to 300 edited photos', 'Online gallery', 'High-resolution downloads', '2 photographers', 'Highlight video (2-3 mins)'],
    featured: true,
    order: 2,
  },
  {
    serviceType: 'both',
    category: 'Wedding',
    serviceName: 'Essential Wedding Package',
    description: 'Capture your special day with professional elegance',
    price: '₵5,000.00',
    duration: 'Full day',
    includes: ['Up to 500 edited photos', 'Engagement shoot', 'Online gallery', 'High-resolution downloads', '2 photographers', 'Photo album (20 pages)'],
    featured: true,
    order: 3,
  },
  {
    serviceType: 'photography',
    category: 'Portrait',
    serviceName: 'Individual Portrait Session',
    description: 'Professional headshots and personal portraits',
    price: '₵800.00',
    duration: '1 hour',
    includes: ['15-20 edited photos', 'Online gallery', 'High-resolution downloads', '2 outfit changes'],
    featured: false,
    order: 4,
  },
  {
    serviceType: 'photography',
    category: 'Product',
    serviceName: 'Product Shoot',
    description: 'High-quality product images for e-commerce and marketing',
    price: 'Starting from ₵500.00',
    duration: '2 hours',
    includes: ['Up to 20 product shots', 'White background editing', 'High-resolution files', 'Lifestyle shots (optional)'],
    featured: false,
    order: 5,
  },
  {
    serviceType: 'videography',
    category: 'Event',
    serviceName: 'Event Videography',
    description: 'Cinematic video coverage for any occasion',
    price: '₵2,500.00',
    duration: '4 hours',
    includes: ['4K video recording', 'Highlight video (3-5 mins)', 'Full event footage', 'Background music', 'Color grading'],
    featured: true,
    order: 6,
  },
];

export async function GET(req: NextRequest) {
  try {
    const snapshot = await adminDb?.collection('rate-cards').orderBy('order', 'asc').get();
    
    if (!snapshot || snapshot.empty) {
      return NextResponse.json(DEFAULT_RATE_CARDS, { status: 200 });
    }

    const rateCards = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data(),
      // Handle missing serviceType for backward compatibility
      serviceType: doc.data().serviceType || 'photography',
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    return NextResponse.json(rateCards, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching rate cards:', error);
    return NextResponse.json(DEFAULT_RATE_CARDS, { status: 200 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth?.verifyIdToken(token);
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const userDoc = await adminDb?.collection('users').doc(decodedToken.uid).get();
    if (!userDoc?.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const data = await req.json();
    const rateCard = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const docRef = await adminDb?.collection('rate-cards').add(rateCard);
    return NextResponse.json({ id: docRef?.id, ...rateCard }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating rate card:', error);
    return NextResponse.json({ error: 'Failed to create rate card' }, { status: 500 });
  }
}