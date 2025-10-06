// app/api/reviews/route.ts
// IMPORTANT: After updating a review's approval status, the home page should automatically
// show it in the testimonials section after a page refresh
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

    console.log('Fetching reviews with params:', { approved, featured });

    let query: Query<DocumentData> | CollectionReference<DocumentData> = adminDb.collection('reviews');

    // Apply filters
    if (approved === 'true') {
      query = query.where('approved', '==', true);
      console.log('Filtering for approved reviews');
    }

    if (featured === 'true') {
      query = query.where('featured', '==', true);
      console.log('Filtering for featured reviews');
    }

    // Order by creation date
    const snapshot = await query.orderBy('createdAt', 'desc').get();
    
    console.log(`Found ${snapshot.size} reviews matching criteria`);

    const reviews = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        // Ensure dates are properly serialized
        createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
        updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
      };
    });

    console.log('Returning reviews:', reviews.length);
    
    // Add cache headers to prevent stale data
    return NextResponse.json(reviews, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0',
      }
    });
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch reviews', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
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

    console.log('Received review submission:', { clientName, clientEmail, serviceType, rating });

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
    if (clientImage && clientImage.size > 0) {
      try {
        const fileBuffer = Buffer.from(await clientImage.arrayBuffer());
        const fileName = `review-${Date.now()}-${clientImage.name || 'image'}`;
        const uploadResponse = await uploadToImageKit(fileBuffer, fileName, '/reviews');
        clientImageUrl = uploadResponse.url;
        console.log('Image uploaded successfully:', clientImageUrl);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image rather than failing the entire review
      }
    }

    // Create review object
    const review = {
      clientName,
      clientEmail,
      clientImage: clientImageUrl || '',
      rating,
      reviewText,
      serviceType,
      approved: false, // Default to false - admin must approve
      featured: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      adminResponse: '',
    };

    // Save to Firestore
    const docRef = await adminDb.collection('reviews').add(review);
    console.log('Review created with ID:', docRef.id);
    
    return NextResponse.json({ 
      id: docRef.id, 
      ...review,
      createdAt: review.createdAt.toISOString(),
      updatedAt: review.updatedAt.toISOString(),
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json({ 
      error: 'Failed to create review', 
      details: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}