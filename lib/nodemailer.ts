import nodemailer from 'nodemailer';

export const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });
};

export const sendBookingConfirmation = async (userEmail: string, bookingDetails: any) => {
  const transporter = createTransporter();
  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: 'Booking Confirmation - Brain Works Studio',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #8B4513;">Booking Confirmation</h2>
        <p>Dear ${bookingDetails.userName},</p>
        <p>Thank you for booking with Brain Works Studio. Your booking has been received and is pending review.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Service:</strong> ${bookingDetails.serviceCategory}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
          <p><strong>Location:</strong> ${bookingDetails.location}</p>
        </div>
        
        <p>We will review your booking and get back to you within 24 hours.</p>
        <p>Best regards,<br>Brain Works Studio Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

export const sendBookingStatusUpdate = async (userEmail: string, status: string, bookingDetails: any) => {
  const transporter = createTransporter();
  
  const statusText = status === 'accepted' ? 'Approved' : 'Declined';
  const statusColor = status === 'accepted' ? '#22C55E' : '#EF4444';
  
  const mailOptions = {
    from: process.env.GMAIL_USER,
    to: userEmail,
    subject: `Booking ${statusText} - Brain Works Studio`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: ${statusColor};">Booking ${statusText}</h2>
        <p>Dear ${bookingDetails.userName},</p>
        <p>Your booking has been <strong style="color: ${statusColor};">${status}</strong>.</p>
        
        <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3>Booking Details:</h3>
          <p><strong>Service:</strong> ${bookingDetails.serviceCategory}</p>
          <p><strong>Date:</strong> ${bookingDetails.date}</p>
          <p><strong>Time:</strong> ${bookingDetails.startTime} - ${bookingDetails.endTime}</p>
          <p><strong>Location:</strong> ${bookingDetails.location}</p>
        </div>
        
        ${bookingDetails.adminNotes ? `<p><strong>Notes:</strong> ${bookingDetails.adminNotes}</p>` : ''}
        
        <p>Thank you for choosing Brain Works Studio!</p>
        <p>Best regards,<br>Brain Works Studio Team</p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};