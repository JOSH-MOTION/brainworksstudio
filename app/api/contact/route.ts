// app/api/contact/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { createTransporter } from '@/lib/nodemailer';

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const formData = await request.json();
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Save contact to Firestore
    const contactData = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone || '',
      subject: formData.subject,
      message: formData.message,
      createdAt: new Date(),
    };

    await adminDb.collection('contacts').add(contactData);

    // Send confirmation email to user
    const transporter = createTransporter();
    
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: formData.email,
      subject: 'Thank you for contacting Brain Works Studio',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #8B4513;">Thank You for Reaching Out</h2>
          <p>Dear ${formData.name},</p>
          <p>Thank you for contacting Brain Works Studio. We've received your message and will get back to you within 24 hours.</p>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Your Message:</h3>
            <p><strong>Subject:</strong> ${formData.subject}</p>
            <p><strong>Message:</strong> ${formData.message}</p>
          </div>
          
          <p>We look forward to discussing your project!</p>
          <p>Best regards,<br>Brain Works Studio Team</p>
        </div>
      `,
    });

    // Send notification to admin
    await transporter.sendMail({
      from: process.env.GMAIL_USER,
      to: process.env.GMAIL_USER,
      subject: `New Contact Form Submission: ${formData.subject}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${formData.name}</p>
        <p><strong>Email:</strong> ${formData.email}</p>
        <p><strong>Phone:</strong> ${formData.phone || 'Not provided'}</p>
        <p><strong>Subject:</strong> ${formData.subject}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${formData.message}
        </div>
        <p><strong>Submitted at:</strong> ${new Date().toLocaleString()}</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}