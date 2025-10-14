// app/api/portfolio/[id]/route.ts
import { NextResponse, NextRequest } from 'next/server';
import { adminDb, adminAuth } from '@/lib/firebase-admin';

export const dynamic = 'force-dynamic';

// Helper functions
function toBoolean(value: FormDataEntryValue | null | undefined): boolean {
  if (value === null || value === undefined) return false;
  const stringValue = String(value).toLowerCase();
  return stringValue === 'true' || stringValue === '1' || stringValue === 'yes';
}

function getStringValue(formData: FormData, key: string): string | null {
  const value = formData.get(key);
  if (value === null || value === undefined) return null;
  return String(value).trim();
}

// Safe admin auth check
async function isAdminUser(authHeader: string | null): Promise<boolean> {
  if (!authHeader || !adminAuth) return false;
  
  if (!authHeader.startsWith('Bearer ')) return false;
  
  try {
    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb?.collection('users').doc(decodedToken.uid).get();
    if (!userDoc || !adminDb) return false;
    
    const userData = userDoc.data();
    return userData?.role === 'admin';
  } catch (error) {
    console.log('Admin check failed:', error);
    return false;
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const { id } = params;
    const authHeader = request.headers.get('authorization');
    
    // ✅ Check if admin first (bypasses PIN)
    const isAdmin = await isAdminUser(authHeader);
    
    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Portfolio item not found' }, { status: 404 });
    }

    const data = doc.data();
    
    // ✅ Admin bypass - no PIN needed
    if (isAdmin) {
      const item = {
        id: doc.id,
        ...data,
        createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
        updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt,
        pin: data?.pin || data?.downloadPin || null,
      };
      console.log(`✅ Admin GET /api/portfolio/${id}: Full access granted`);
      return NextResponse.json(item);
    }

    // Non-admin PIN check
    const pin = request.nextUrl.searchParams.get('pin');
    if (!pin) {
      return NextResponse.json({ 
        requiresPin: true, 
        message: 'PIN required' 
      }, { status: 401 });
    }

    const storedPin = data?.pin || data?.downloadPin || null;
    if (storedPin && storedPin !== pin) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    const item = {
      id: doc.id,
      ...data,
      createdAt: data?.createdAt?.toDate?.()?.toISOString() || data?.createdAt,
      updatedAt: data?.updatedAt?.toDate?.()?.toISOString() || data?.updatedAt,
      pin: null, // Hide from non-admins
    };

    console.log(`✅ PIN validated for /api/portfolio/${id}`);
    return NextResponse.json(item);
  } catch (error: any) {
    console.error(`GET Error:`, error);
    return NextResponse.json({ error: 'Failed to fetch item' }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    if (!adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const { id } = params;
    const { pin } = await request.json();

    if (!pin) {
      return NextResponse.json({ error: 'PIN is required' }, { status: 400 });
    }

    const docRef = adminDb.collection('portfolio').doc(id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const data = doc.data();
    const storedPin = data?.pin || data?.downloadPin || null;

    if (storedPin && storedPin !== pin) {
      return NextResponse.json({ error: 'Invalid PIN' }, { status: 401 });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: 'PIN validation failed' }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ✅ Null check for adminAuth
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const formData = await request.formData();
    
    // ✅ FIXED: Safe FormData iteration
    console.log('🔍 FormData keys:', Array.from(formData.keys()));
    
    // Log each entry safely
    const entries = Array.from(formData.entries());
    entries.forEach(([key, value]) => {
      console.log(`🔍 Field "${key}":`, value, `(${typeof value})`);
    });

    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    // Featured
    const featuredRaw = formData.get('featured');
    const featured = toBoolean(featuredRaw);
    updateData.featured = featured;
    console.log(`✅ featured: ${featured}`);

    // Client fields
    const clientId = getStringValue(formData, 'clientId');
    if (clientId) {
      updateData.clientId = clientId;
      console.log(`✅ clientId: ${clientId}`);
    }

    const clientName = getStringValue(formData, 'clientName');
    if (clientName) {
      updateData.clientName = clientName;
      console.log(`✅ clientName: ${clientName}`);
    }

    // PIN (optional)
    const pin = getStringValue(formData, 'pin');
    if (pin) {
      updateData.pin = pin;
      updateData.downloadPin = pin;
      console.log(`✅ pin: ${pin}`);
    }

    // Title
    const title = getStringValue(formData, 'title');
    if (title) {
      updateData.title = title;
      console.log(`✅ title: ${title}`);
    }

    // Category
    const category = getStringValue(formData, 'category');
    if (category) {
      updateData.category = category;
      console.log(`✅ category: ${category}`);
    }

    // Tags
    const tagsRaw = formData.get('tags');
    if (tagsRaw !== null && tagsRaw !== undefined) {
      const tagsString = String(tagsRaw).trim();
      updateData.tags = tagsString ? 
        tagsString.split(',').map(t => t.trim()).filter(t => t) : 
        [];
      console.log(`✅ tags:`, updateData.tags);
    }

    // Caption
    const caption = getStringValue(formData, 'caption');
    updateData.caption = caption || null;
    console.log(`✅ caption: ${updateData.caption}`);

    // Type
    const type = getStringValue(formData, 'type');
    if (type && (type === 'photography' || type === 'videography')) {
      updateData.type = type;
      console.log(`✅ type: ${type}`);
    }

    console.log('📝 updateData:', updateData);

    const hasUpdates = Object.keys(updateData).some(key => key !== 'updatedAt');
    if (!hasUpdates) {
      return NextResponse.json({ error: 'No valid updates' }, { status: 400 });
    }

    const docRef = adminDb.collection('portfolio').doc(id);
    await docRef.update(updateData);
    
    console.log(`✅ Updated ${Object.keys(updateData).length - 1} fields`);

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
    console.error(`❌ PUT Error:`, error);
    return NextResponse.json({ 
      error: 'Update failed', 
      debug: error.message 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest, 
  { params }: { params: { id: string } }
) {
  try {
    if (!adminAuth || !adminDb) {
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Admin authorization required' }, { status: 401 });
    }

    const token = authHeader.split('Bearer ')[1];
    const decodedToken = await adminAuth.verifyIdToken(token);
    const userDoc = await adminDb.collection('users').doc(decodedToken.uid).get();
    const userData = userDoc.data();

    if (!userData?.role || userData.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { id } = params;
    const docRef = adminDb.collection('portfolio').doc(id);
    await docRef.delete();

    return NextResponse.json({ success: true, id });
  } catch (error: any) {
    console.error(`DELETE Error:`, error);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}