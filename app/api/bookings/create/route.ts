import { NextRequest, NextResponse } from 'next/server';
import { adminAuth, adminDb } from '@/lib/firebase-admin';
import { sendBookingConfirmation } from '@/lib/nodemailer';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Check if Firebase Admin is initialized
    if (!adminAuth || !adminDb) {
      console.error('Firebase Admin not properly initialized');
      return NextResponse.json({ error: 'Service temporarily unavailable' }, { status: 503 });
    }

    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }

    // Verify the token
    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (error) {
      console.error('Token verification failed:', error);
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    // Get the request body
    const body = await request.json();
    const {
      serviceCategory,
      serviceName, // Added
      date,
      startTime,
      endTime,
      address,
      additionalNotes,
      userName,
      userEmail,
    } = body;

    // Validate required fields
    if (!serviceCategory || !date || !startTime || !endTime || !address) {
      return NextResponse.json({
        error: 'Missing required fields: serviceCategory, date, startTime, endTime, address',
      }, { status: 400 });
    }

    // Create start and end DateTime objects
    const startDateTime = new Date(`${date}T${startTime}`);
    const endDateTime = new Date(`${date}T${endTime}`);

    // Validate that end time is after start time
    if (endDateTime <= startDateTime) {
      return NextResponse.json({
        error: 'End time must be after start time',
      }, { status: 400 });
    }

    // Create the booking data
    const bookingData = {
      userId: decodedToken.uid,
      serviceCategory,
      serviceName: serviceName || null, // Optional field
      startDateTime,
      endDateTime,
      location: {
        address,
      },
      additionalNotes: additionalNotes || '',
      adminNotes: '',
      status: 'pending',
      attachments: [], // Handle file uploads separately if needed
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create the booking in Firestore
    const bookingRef = await adminDb.collection('bookings').add(bookingData);
    const bookingId = bookingRef.id;

    // Update with the booking ID
    await bookingRef.update({ bookingId });

    console.log('Booking created successfully:', bookingId);

    // Send confirmation email if user email is available
    if (userEmail) {
      try {
        await sendBookingConfirmation(userEmail, {
          userName: userName || 'User',
          serviceCategory,
          serviceName: serviceName || 'Custom Service', // Include serviceName
          date: startDateTime.toLocaleDateString(),
          startTime: startDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          endTime: endDateTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          location: address,
          additionalNotes: additionalNotes || 'No additional notes provided',
        });
      } catch (emailError) {
        console.error('Error sending confirmation email:', emailError);
        // Don't fail the request if email fails
      }
    }

    return NextResponse.json({
      success: true,
      bookingId,
      message: 'Booking created successfully',
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}