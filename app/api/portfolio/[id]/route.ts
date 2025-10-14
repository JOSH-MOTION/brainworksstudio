// app/api/portfolio/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// Helper function to safely convert FormDataEntryValue to boolean
function toBoolean(value: FormDataEntryValue | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  
  const stringValue = String(value).toLowerCase();
  return stringValue === 'true' || stringValue === '1' || stringValue === 'yes';
}

// Helper function to safely get string value
function getStringValue(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (value === null || value === undefined) return null;
  return String(value).trim();
}

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
      pin: data?.pin || data?.downloadPin || null,
    };

    console.log(`GET /api/portfolio/${id}: Returning item`);
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

    console.log(`POST /api/portfolio/${id}: Validating PIN`);
    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const data = doc.data();
    const storedPin = data?.pin || data?.downloadPin || null;

    if (storedPin && storedPin !== pin) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

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
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const formData = await request.formData();
    
    console.log('PUT /api/portfolio/[id]: FormData keys:', Array.from(formData.keys()));

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // ✅ FIXED: Proper featured handling without TypeScript error
    const featuredRaw = formData.get('featured');
    const featured = toBoolean(featuredRaw);
    updateData.featured = featured;
    console.log(`PUT: featured = ${featured} (raw: ${featuredRaw})`);

    // Client gallery fields
    const clientId = getStringValue(formData, 'clientId');
    if (clientId) {
      updateData.clientId = clientId;
      console.log(`PUT: clientId = "${clientId}"`);
    }

    const clientName = getStringValue(formData, 'clientName');
    if (clientName) {
      updateData.clientName = clientName;
      console.log(`PUT: clientName = "${clientName}"`);
    }

    // PIN handling
    const pin = getStringValue(formData, 'pin');
    if (pin) {
      updateData.pin = pin;
      updateData.downloadPin = pin; // Backward compatibility
      console.log(`PUT: pin = "${pin}"`);
    }

    // Title
    const title = getStringValue(formData, 'title');
    if (title) {
      updateData.title = title;
      console.log(`PUT: title = "${title}"`);
    }

    // Category
    const category = getStringValue(formData, 'category');
    if (category) {
      updateData.category = category;
      console.log(`PUT: category = "${category}"`);
    }

    // Tags
    const tagsRaw = formData.get('tags');
    if (tagsRaw !== null && tagsRaw !== undefined) {
      const tagsString = String(tagsRaw).trim();
      if (tagsString) {
        updateData.tags = tagsString.split(',').map(t => t.trim()).filter(t => t);
      } else {
        updateData.tags = [];
      }
      console.log(`PUT: tags =`, updateData.tags);
    }

    // Caption
    const caption = getStringValue(formData, 'caption');
    updateData.caption = caption || null;
    console.log(`PUT: caption = "${updateData.caption}"`);

    // Type (photography/videography)
    const type = getStringValue(formData, 'type');
    if (type && (type === 'photography' || type === 'videography')) {
      updateData.type = type;
      console.log(`PUT: type = "${type}"`);
    }

    console.log('PUT: updateData:', updateData);

    // Check for meaningful updates
    const hasUpdates = Object.keys(updateData).some(key => key !== 'updatedAt');
    if (!hasUpdates) {
      return NextResponse.json({ error: 'No valid updates provided' }, { status: 400 });
    }

    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    // Update Firestore
    await docRef.update(updateData);
    console.log(`PUT /api/portfolio/${id}: Successfully updated client gallery`);

    // Return updated item
    const updatedDoc = await docRef.get();
    const updatedData = updatedDoc.data();
    const updatedItem = {
      id: updatedDoc.id,
      ...updatedData,
      createdAt: updatedData?.createdAt?.toDate?.()?.toISOString() || updatedData?.createdAt,
      updatedAt: updatedData?.updatedAt?.toDate?.()?.toISOString() || updatedData?.updatedAt,
      pin: updatedData?.pin || updatedData?.downloadPin || null,
    };

    return NextResponse.json(updatedItem);
  } catch (error: any) {
    console.error(`PUT /api/portfolio/[id]: Error:`, error);
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
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();
    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const docRef = adminDb.collection('portfolio').doc(id);
    
    await docRef.delete();
    console.log(`DELETE /api/portfolio/${id}: Client gallery deleted successfully`);

    return NextResponse.json({ 
      success: true, 
      message: 'Client gallery deleted successfully',
      id 
    });
  } catch (error: any) {
    console.error(`DELETE /api/portfolio/[id]: Error:`, error);
    return NextResponse.json(
      { error: 'Failed to delete item', debug: error.message },
      { status: 500 }
    );
  }
}