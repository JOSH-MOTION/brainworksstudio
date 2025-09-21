import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { sendBookingStatusUpdate } from '@/lib/nodemailer';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    const decodedToken = await adminAuth?.verifyIdToken(token);
    
    if (!decodedToken) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
    
    // Check if user is admin
    const userDoc = await adminDb?.collection('users').doc(decodedToken.uid).get();
    if (!userDoc?.exists || userDoc.data()?.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { status, adminNotes } = await request.json();
    const bookingId = params.id;

    // Get booking details for email
    const bookingDoc = await adminDb?.collection('bookings').doc(bookingId).get();
    if (!bookingDoc?.exists) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }

    const bookingData = bookingDoc.data();
    
    // Get user details for email
    const userDocRef = await adminDb?.collection('users').doc(bookingData?.userId).get();
    const userData = userDocRef?.data();

    // Update booking status
    await adminDb?.collection('bookings').doc(bookingId).update({
      status,
      adminNotes: adminNotes || '',
      updatedAt: new Date(),
    });

    // Send status update email to user
    if (userData?.email) {
      try {
        await sendBookingStatusUpdate(userData.email, status, {
          userName: userData.displayName || 'User',
          serviceCategory: bookingData?.serviceCategory,
          date: new Date(bookingData?.startDateTime?.toDate?.() || bookingData?.startDateTime).toLocaleDateString(),
          startTime: new Date(bookingData?.startDateTime?.toDate?.() || bookingData?.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          endTime: new Date(bookingData?.endDateTime?.toDate?.() || bookingData?.endDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}),
          location: bookingData?.location?.address,
          adminNotes: adminNotes || '',
        });
      } catch (emailError) {
        console.error('Error sending status update email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error updating booking status:', error);
    return NextResponse.json(
      { error: 'Failed to update booking status' },
      { status: 500 }
    );
  }
}