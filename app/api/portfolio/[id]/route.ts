// app/api/portfolio/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { uploadToImageKit } from '@/lib/imagekit';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminDb) {
      console.error('GET /api/portfolio/[id]: Firebase Admin not initialized');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { id } = params;
    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.error(`GET /api/portfolio/${id}: Portfolio item not found`);
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const data = doc.data();
    const item = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt || new Date().toISOString(),
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt || new Date().toISOString(),
      pin: data?.pin || data?.downloadPin || null, // Map pin or downloadPin for consistency
    };

    console.log(`GET /api/portfolio/${id}: Returning item`, item);
    return NextResponse.json(item);
  } catch (error: any) {
    console.error(`GET /api/portfolio/[id]: Error fetching item:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio item', debug: error.message },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminDb) {
      console.error('POST /api/portfolio/[id]: Firebase Admin not initialized');
      return NextResponse.json(
        { error: 'Service temporarily unavailable' },
        { status: 503 }
      );
    }

    const { id } = params;
    const { pin } = await request.json();

    if (!pin) {
      console.error(`POST /api/portfolio/${id}: PIN is required`);
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    console.log(`POST /api/portfolio/${id}: Validating PIN for portfolio item`);
    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.error(`POST /api/portfolio/${id}: Portfolio item not found`);
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const data = doc.data();
    const storedPin = data?.pin || data?.downloadPin || null;

    if (storedPin && storedPin !== pin) {
      console.error(`POST /api/portfolio/${id}: Invalid PIN provided`);
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    console.log(`POST /api/portfolio/${id}: PIN validated successfully`);
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error(`POST /api/portfolio/[id]: Error validating PIN:`, error);
    return NextResponse.json(
      { error: 'Failed to validate PIN', debug: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminAuth || !adminDb) {
      console.error('PUT /api/portfolio/[id]: Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    // Admin authentication
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('PUT /api/portfolio/[id]: Missing authorization header');
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('PUT /api/portfolio/[id]: Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      console.error('PUT /api/portfolio/[id]: User is not admin');
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const formData = await request.formData();
    
    // Get existing document first
    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();
    
    if (!doc.exists) {
      console.error(`PUT /api/portfolio/${id}: Portfolio item not found`);
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const existingData = doc.data();
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Handle text fields - only update if provided
    if (formData.has('title')) {
      updateData.title = (formData.get('title') as string).trim();
    }
    if (formData.has('type')) {
      updateData.type = formData.get('type') as string;
    }
    if (formData.has('category')) {
      updateData.category = formData.get('category') as string;
    }
    if (formData.has('tags')) {
      const tags = formData.get('tags') as string;
      updateData.tags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
    }
    if (formData.has('caption')) {
      const caption = (formData.get('caption') as string).trim();
      updateData.caption = caption || null;
    }
    if (formData.has('clientName')) {
      const clientName = (formData.get('clientName') as string).trim();
      updateData.clientName = clientName || null;
    }
    if (formData.has('clientId')) {
      const clientId = (formData.get('clientId') as string).trim();
      updateData.clientId = clientId || null;
    }
    if (formData.has('featured')) {
      updateData.featured = formData.get('featured') === 'true';
    }
    if (formData.has('pin')) {
      const pin = (formData.get('pin') as string).trim();
      if (pin) {
        updateData.pin = pin;
        updateData.downloadPin = pin;
      } else {
        // If empty PIN, remove it
        updateData.pin = null;
        updateData.downloadPin = null;
      }
    }

    // Handle video URL
    if (formData.has('videoUrl')) {
      const videoUrl = (formData.get('videoUrl') as string).trim();
      updateData.videoUrl = videoUrl || null;
    }

    // Handle file uploads - APPEND to existing files
    const files = formData.getAll('files') as File[];
    
    if (files && files.length > 0 && files[0].size > 0) {
      console.log(`PUT /api/portfolio/${id}: Processing ${files.length} new files`);
      
      const newImageUrls: string[] = [];
      let newVideoUrl: string | null = null;

      const itemType = updateData.type || existingData?.type || 'photography';

      if (itemType === 'photography') {
        // Upload new images and APPEND to existing ones
        for (const file of files) {
          if (file.size > 0 && file.type.startsWith('image/')) {
            console.log(`PUT /api/portfolio/${id}: Uploading image - ${file.name}`);
            const result = await uploadToImageKit(file, file.name, '/brain-works-studio');
            newImageUrls.push(result.url);
          }
        }

        if (newImageUrls.length > 0) {
          const existingImages = existingData?.imageUrls || [];
          // APPEND new images to existing ones
          updateData.imageUrls = [...existingImages, ...newImageUrls];
          console.log(`PUT /api/portfolio/${id}: Appended ${newImageUrls.length} images, now have ${updateData.imageUrls.length} total images`);
        }
      } else if (itemType === 'videography') {
        // Handle video file upload
        for (const file of files) {
          if (file.size > 0 && file.type.startsWith('video/')) {
            console.log(`PUT /api/portfolio/${id}: Uploading video - ${file.name}`);
            const result = await uploadToImageKit(
              file, 
              `${updateData.title || existingData?.title || 'video'}-${Date.now()}.mp4`, 
              '/brain-works-studio'
            );
            newVideoUrl = result.url;
          } else if (file.size > 0 && file.type.startsWith('image/')) {
            // Handle thumbnail upload for videos
            console.log(`PUT /api/portfolio/${id}: Uploading thumbnail - ${file.name}`);
            const result = await uploadToImageKit(
              file,
              `${updateData.title || existingData?.title || 'thumbnail'}-${Date.now()}.jpg`,
              '/brain-works-studio/thumbnails'
            );
            newImageUrls.push(result.url);
          }
        }

        // Update video URL if new video was uploaded
        if (newVideoUrl) {
          updateData.videoUrl = newVideoUrl;
          console.log(`PUT /api/portfolio/${id}: Updated video URL`);
        }

        // Update thumbnails if new ones were uploaded
        if (newImageUrls.length > 0) {
          const existingThumbnails = existingData?.imageUrls || [];
          updateData.imageUrls = [...existingThumbnails, ...newImageUrls];
          console.log(`PUT /api/portfolio/${id}: Updated thumbnails, now have ${updateData.imageUrls.length} total`);
        }
      }
    }

    console.log(`PUT /api/portfolio/${id}: Updating with data:`, Object.keys(updateData));

    // Update the document
    await docRef.update(updateData);

    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
    const updatedItem = {
      id: updatedDoc.id,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
      updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || updatedData?.updatedAt,
      pin: updatedData?.pin || updatedData?.downloadPin || null,
    };

    console.log(`PUT /api/portfolio/${id}: Item updated successfully`);
    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error(`PUT /api/portfolio/[id]: Error updating item:`, error);
    return NextResponse.json(
      { error: 'Failed to update portfolio item', debug: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminAuth || !adminDb) {
      console.error('DELETE /api/portfolio/[id]: Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('DELETE /api/portfolio/[id]: Missing authorization header');
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('DELETE /api/portfolio/[id]: Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      console.error('DELETE /api/portfolio/[id]: User is not admin');
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    console.log(`DELETE /api/portfolio/${id}: Attempting to delete portfolio item`);

    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      console.error(`DELETE /api/portfolio/${id}: Portfolio item not found`);
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const data = doc.data();
    const imageUrls = data?.imageUrls || [];
    const videoUrl = data?.videoUrl || null;

    console.log(`DELETE /api/portfolio/${id}: Found ${imageUrls.length} images and ${videoUrl ? '1 video' : 'no video'}`);

    // Optional cleanup for ImageKit files
    if (imageUrls.length > 0) {
      for (const url of imageUrls) {
        try {
          const urlParts = url.split('/');
          const fileNameWithQuery = urlParts[urlParts.length - 1];
          const fileName = fileNameWithQuery.split('?')[0];
          
          console.log(`DELETE /api/portfolio/${id}: Attempting to delete image: ${fileName}`);
          // await deleteFromImageKit(fileName); // Uncomment if ImageKit cleanup is implemented
        } catch (error) {
          console.error(`DELETE /api/portfolio/${id}: Failed to delete image from ImageKit:`, error);
        }
      }
    }

    if (videoUrl && !videoUrl.includes('youtube.com') && !videoUrl.includes('vimeo.com')) {
      try {
        const urlParts = videoUrl.split('/');
        const fileNameWithQuery = urlParts[urlParts.length - 1];
        const fileName = fileNameWithQuery.split('?')[0];
        
        console.log(`DELETE /api/portfolio/${id}: Attempting to delete video: ${fileName}`);
        // await deleteFromImageKit(fileName); // Uncomment if ImageKit cleanup is implemented
      } catch (error) {
        console.error(`DELETE /api/portfolio/${id}: Failed to delete video from ImageKit:`, error);
      }
    }

    await docRef.delete();

    console.log(`DELETE /api/portfolio/${id}: Portfolio item deleted successfully from Firestore`);
    return NextResponse.json({ 
      success: true, 
      message: 'Portfolio item deleted successfully',
      id 
    });
  } catch (error: any) {
    console.error(`DELETE /api/portfolio/[id]: Error deleting item:`, error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item', debug: error.message },
      { status: 500 }
    );
  }
}