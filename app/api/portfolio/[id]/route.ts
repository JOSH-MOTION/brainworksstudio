import { NextResponse, NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';
import { uploadToImageKit, deleteFromImageKit } from '@/lib/imagekit';
import { PortfolioItem } from '@/types';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  console.log(`GET /api/portfolio/${id}: Fetching item by ID`);

  try {
    if (!adminDb) {
      console.error('GET /api/portfolio: Firebase Admin not initialized');
      return NextResponse.json(
        { error: 'Service temporarily unavailable', debug: 'Firebase Admin not initialized' },
        { status: 503 }
      );
    }

    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();
    
    console.log(`GET /api/portfolio/${id}: Document exists: ${doc.exists}, ID: ${doc.id}`);
    
    if (!doc.exists) {
      console.log(`GET /api/portfolio/${id}: Item not found`);
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const data = doc.data();
    if (!data) {
      console.log(`GET /api/portfolio/${id}: No data found for item`);
      return NextResponse.json({ error: 'Portfolio item data is empty' }, { status: 404 });
    }

    const portfolioItem: PortfolioItem = {
      id: doc.id,
      title: data.title || '',
      type: data.type || 'photography',
      category: data.category || '',
      tags: data.tags || [],
      imageUrls: data.imageUrls || [],
      videoUrl: data.videoUrl || null,
      caption: data.caption || null,
      clientName: data.clientName || null,
      featured: data.featured || false,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || data.createdAt || new Date().toISOString(),
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || data.updatedAt || new Date().toISOString(),
      createdBy: data.createdBy || '',
      clientId: data.clientId || null,
    };

    console.log(`GET /api/portfolio/${id}: Returning item`, portfolioItem);
    return NextResponse.json(portfolioItem, { status: 200 });
  } catch (error: any) {
    console.error(`GET /api/portfolio/${id}: Error fetching item`, error);
    return NextResponse.json(
      { error: 'Failed to fetch portfolio item', debug: error.message },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    if (!adminAuth || !adminDb) {
      console.error('PUT /api/portfolio: Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('PUT /api/portfolio: Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const formData = await request.formData();
    const title = formData.get('title') as string;
    const type = formData.get('type') as 'photography' | 'videography';
    const category = formData.get('category') as string;
    const tags = formData.get('tags') as string;
    const caption = formData.get('caption') as string;
    const clientName = formData.get('clientName') as string;
    const featured = formData.get('featured') === 'true';
    const clientId = formData.get('clientId') as string | null;
    const files = formData.getAll('files') as File[];
    const videoUrl = formData.get('videoUrl') as string | null;

    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }
    if (!type) {
      return NextResponse.json({ error: 'Type is required' }, { status: 400 });
    }
    if (!category) {
      return NextResponse.json({ error: 'Category is required' }, { status: 400 });
    }

    const portfolioRef = adminDb.collection('portfolio').doc(id);
    const doc = await portfolioRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const existingData = doc.data() as PortfolioItem;
    const imageUrls = [...existingData.imageUrls];

    if (files && files.length > 0) {
      for (const file of files) {
        const result = await uploadToImageKit(file, file.name);
        imageUrls.push(result.url);
      }
    }

    const updatedPortfolioItem = {
      title: title.trim(),
      type,
      category,
      tags: tags ? tags.split(',').map(t => t.trim()) : existingData.tags,
      imageUrls,
      videoUrl: videoUrl?.trim() || existingData.videoUrl || null,
      caption: caption?.trim() || existingData.caption || null,
      clientName: clientName?.trim() || existingData.clientName || null,
      featured: Boolean(featured),
      updatedAt: new Date().toISOString(),
      createdAt: existingData.createdAt,
      createdBy: existingData.createdBy,
      clientId: clientId || existingData.clientId || null,
    };

    await portfolioRef.update(updatedPortfolioItem);
    console.log('PUT /api/portfolio: Portfolio item updated successfully:', id);
    return NextResponse.json({ id, ...updatedPortfolioItem });
  } catch (error: any) {
    console.error('PUT /api/portfolio: Error updating portfolio item:', error);
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
  const { id } = params;
  
  try {
    if (!adminAuth || !adminDb) {
      console.error('DELETE /api/portfolio: Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Authorization header required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('DELETE /api/portfolio: Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const portfolioRef = adminDb.collection('portfolio').doc(id);
    const doc = await portfolioRef.get();
    if (!doc.exists) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const { imageUrls, videoUrl } = doc.data() as PortfolioItem;
    if (imageUrls?.length) {
      for (const url of imageUrls) {
        const fileId = url.split('/').pop()?.split('?')[0];
        if (fileId) {
          try {
            await deleteFromImageKit(fileId);
            console.log(`DELETE /api/portfolio: Deleted file ${fileId} from ImageKit`);
          } catch (error) {
            console.error(`DELETE /api/portfolio: Failed to delete file ${fileId} from ImageKit:`, error);
          }
        }
      }
    }
    if (videoUrl && !videoUrl.includes('youtube.com')) {
      const fileId = videoUrl.split('/').pop()?.split('?')[0];
      if (fileId) {
        try {
          await deleteFromImageKit(fileId);
          console.log(`DELETE /api/portfolio: Deleted video file ${fileId} from ImageKit`);
        } catch (error) {
          console.error(`DELETE /api/portfolio: Failed to delete video file ${fileId} from ImageKit:`, error);
        }
      }
    }

    await portfolioRef.delete();
    console.log('DELETE /api/portfolio: Portfolio item deleted successfully:', id);
    return NextResponse.json({ message: 'Portfolio item deleted' });
  } catch (error: any) {
    console.error('DELETE /api/portfolio: Error deleting portfolio item:', error);
    return NextResponse.json(
      { error: 'Failed to delete portfolio item', debug: error.message },
      { status: 500 }
    );
  }
}