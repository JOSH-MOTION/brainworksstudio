import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { sendBookingConfirmation } from '@/lib/nodemailer';
import { uploadToCloudinary } from '@/lib/cloudinary';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    
    // Upload attachments to Cloudinary if any
    const attachmentUrls = [];
    if (formData.attachments && formData.attachments.length > 0) {
      for (const file of formData.attachments) {
        const result = await uploadToCloudinary(file, 'bookings');
        attachmentUrls.push(result.secure_url);
      }
    }

    // Create booking document
    const bookingData = {
      userId: formData.userId,
      serviceCategory: formData.serviceCategory,
      startDateTime: new Date(`${formData.date}T${formData.startTime}`),
      endDateTime: new Date(`${formData.date}T${formData.endTime}`),
      location: {
        address: formData.address,
      },
      attachments: attachmentUrls,
      additionalNotes: formData.additionalNotes || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Add to Firestore
    const docRef = await adminDb.collection('bookings').add(bookingData);
    
    // Update with the generated ID
    await docRef.update({ bookingId: docRef.id });

    // Send confirmation email
    await sendBookingConfirmation(formData.userEmail, {
      userName: formData.userName,
      serviceCategory: formData.serviceCategory,
      date: formData.date,
      startTime: formData.startTime,
      endTime: formData.endTime,
      location: formData.address,
    });

    // Send admin notification email
    const { createTransporter } = require('@/lib/nodemailer');
    const transporter = createTransporter();
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER, // Admin email
      subject: 'New Booking Request - Brain Works Studio',
      html: `
        <h2>New Booking Request</h2>
        <p><strong>Client:</strong> ${formData.userName}</p>
        <p><strong>Email:</strong> ${formData.userEmail}</p>
        <p><strong>Service:</strong> ${formData.serviceCategory}</p>
        <p><strong>Date:</strong> ${formData.date}</p>
        <p><strong>Time:</strong> ${formData.startTime} - ${formData.endTime}</p>
        <p><strong>Location:</strong> ${formData.address}</p>
        ${formData.additionalNotes ? `<p><strong>Notes:</strong> ${formData.additionalNotes}</p>` : ''}
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/admin/bookings">View in Admin Panel</a></p>
      `,
    });

    return NextResponse.json({ success: true, bookingId: docRef.id });
  } catch (error) {
    console.error('Error creating booking:', error);
    return NextResponse.json(
      { error: 'Failed to create booking' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const bookingsSnapshot = await adminDb.collection('bookings')
      .orderBy('createdAt', 'desc')
      .get();
    
    const bookings = bookingsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}