import { NextRequest, NextResponse } from 'next/server';
import { sendBookingStatusUpdate } from '@/lib/nodemailer';

export async function POST(req: NextRequest) {
  try {
    const {
      to,
      clientName,
      serviceCategory,
      date,
      time,
      location,
      status,
      adminNotes,
      bookingId
    } = await req.json();

    // Validate required fields
    if (!to || !clientName || !serviceCategory || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Prepare booking details for email
    const bookingDetails = {
      userName: clientName,
      serviceCategory,
      date,
      startTime: time.split(' - ')[0] || time,
      endTime: time.split(' - ')[1] || time,
      location,
      adminNotes,
      bookingId
    };

    // Send the status update email using your existing nodemailer function
    await sendBookingStatusUpdate(to, status, bookingDetails);

    return NextResponse.json({ 
      success: true, 
      message: 'Email notification sent successfully' 
    });

  } catch (error) {
    console.error('Error sending booking status email:', error);
    return NextResponse.json(
      { error: 'Failed to send email notification' },
      { status: 500 }
    );
  }
}