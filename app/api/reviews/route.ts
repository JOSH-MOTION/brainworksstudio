// app/api/reviews/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { uploadToImageKit } from '@/lib/imagekit';
import { DocumentData, CollectionReference, Query } from 'firebase-admin/firestore';

// Define valid service categories
const photographyCategories = [
  'Corporate', 'Event', 'Portrait', 'Fashion', 'Product', 'Travel & Landscape',
  'Documentary & Lifestyle', 'Creative/Artistic', 'Others'
];
const videographyCategories = [
  'Corporate', 'Event', 'Music Videos', 'Commercials & Adverts', 'Documentary',
  'Short Films / Creative Projects', 'Promotional', 'Social Media', 'Others'
];
const serviceCategories = Array.from(new Set([...photographyCategories, ...videographyCategories]));

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    if (!adminDb) {
      console.error('Firestore database is not initialized');
      return NextResponse.json({ error: 'Firestore database is not initialized' }, { status: 500 });
    }

    const { searchParams } = new URL(req.url);
    const approved = searchParams.get('approved');
    const featured = searchParams.get('featured');

    let query: Query<DocumentData> | CollectionReference<DocumentData> = adminDb.collection('reviews');

    if (approved === 'true') {
      query = query.where('approved', '==', true);
    }

    if (featured === 'true') {
      query = query.where('featured', '==', true);
    }

    const snapshot = await query.orderBy('createdAt', 'desc').get();
    const reviews = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt?.toDate?.() || doc.data().createdAt,
      updatedAt: doc.data().updatedAt?.toDate?.() || doc.data().updatedAt,
    }));

    console.log('Fetched reviews:', reviews); // Debug log
    if (snapshot.empty) {
      console.log('No approved reviews found in Firestore');
    }

    return NextResponse.json(reviews, { status: 200 });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ error: 'Failed to fetch reviews', details: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!adminDb) {
      console.error('Firestore database is not initialized');
      return NextResponse.json({ error: 'Firestore database is not initialized' }, { status: 500 });
    }

    // Parse FormData
    const formData = await req.formData();

    // Extract fields
    const clientName = formData.get('clientName') as string;
    const clientEmail = formData.get('clientEmail') as string;
    const serviceType = formData.get('serviceType') as string;
    const rating = parseInt(formData.get('rating') as string);
    const reviewText = formData.get('reviewText') as string;
    const clientImage = formData.get('clientImage') as File | null;

    // Validate required fields
    if (!clientName || !clientEmail || !serviceType || !reviewText || isNaN(rating)) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate serviceType
    if (!serviceCategories.includes(serviceType)) {
      return NextResponse.json(
        { error: `Invalid service type. Must be one of: ${serviceCategories.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate rating
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
    }

    // Handle file upload to ImageKit
    let clientImageUrl = '';
    if (clientImage) {
      const fileBuffer = Buffer.from(await clientImage.arrayBuffer());
      const fileName = `review-${Date.now()}-${clientImage.name || 'image'}`;
      const uploadResponse = await uploadToImageKit(fileBuffer, fileName, '/reviews');
      clientImageUrl = uploadResponse.url;
    }

    // Create review object
    const review = {
      clientName,
      clientEmail,
      clientImage: clientImageUrl || '',
      rating,
      reviewText,
      serviceType,
      approved: false,
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      adminResponse: '',
    };

    // Save to Firestore
    const docRef = await adminDb.collection('reviews').add(review);
    console.log('Review created:', { id: docRef.id, ...review }); // Debug log
    return NextResponse.json({ id: docRef.id, ...review }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ error: 'Failed to create review', details: error.message }, { status: 500 });
  }
}