// app/api/contact/route.ts
// "Start a Project" enquiry form. Saves the lead to Firestore, emails BWSA,
// and sends the client a confirmation.
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { createTransporter, escapeHtml } from '@/lib/nodemailer';
import { PROJECT_TYPES } from '@/lib/site-config';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '');

export async function POST(request: NextRequest) {
  try {
    if (!adminDb) {
      console.error('Firebase Admin not initialized');
      return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
    }

    const body = await request.json();

    // Honeypot: real visitors never see or fill this field. Pretend success so bots don't retry.
    if (clean(body.website)) {
      return NextResponse.json({ success: true });
    }

    const lead = {
      name: clean(body.name, 120),
      company: clean(body.company, 160),
      email: clean(body.email, 254).toLowerCase(),
      phone: clean(body.phone, 40),
      projectType: clean(body.projectType, 40),
      message: clean(body.message, 5000),
      preferredDate: clean(body.preferredDate, 20),
      location: clean(body.location, 200),
      budget: clean(body.budget, 60),
      referralSource: clean(body.referralSource, 60),
      sourcePage: clean(body.sourcePage, 200),
    };

    if (!lead.name || !lead.email || !lead.phone || !lead.projectType || !lead.message) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(lead.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    const projectTypeLabel = PROJECT_TYPES.find((t) => t.value === lead.projectType)?.label || lead.projectType;
    // Keep `subject` for continuity with older documents in the contacts collection.
    const subject = `${projectTypeLabel}${lead.company ? ` — ${lead.company}` : ''}`;

    await adminDb.collection('contacts').add({ ...lead, subject, status: 'new', createdAt: new Date() });

    const e = escapeHtml;
    const rows: [string, string][] = [
      ['Name', lead.name],
      ['Company', lead.company || '—'],
      ['Email', lead.email],
      ['Phone / WhatsApp', lead.phone],
      ['Project type', projectTypeLabel],
      ['Preferred date', lead.preferredDate || '—'],
      ['Location', lead.location || '—'],
      ['Budget', lead.budget || '—'],
      ['Heard about us', lead.referralSource || '—'],
      ['Sent from', lead.sourcePage || '—'],
    ];
    const detailsTable = rows
      .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#555;"><strong>${label}</strong></td><td>${e(value)}</td></tr>`)
      .join('');
    const messageHtml = e(lead.message).replace(/\n/g, '<br>');

    // The lead is already saved above, so an email hiccup shouldn't make the
    // visitor think their enquiry was lost — log it and keep going.
    // TEMP-DIAGNOSTIC: surfacing the real error in the response to debug a
    // production SMTP issue. Remove emailDebug before shipping normally.
    let emailDebug: { sent: boolean; error?: string } = { sent: false };
    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        replyTo: lead.email,
        subject: `New project enquiry: ${subject}`,
        html: `
          <h2>New Project Enquiry</h2>
          <table>${detailsTable}</table>
          <p><strong>Project description:</strong></p>
          <div style="background:#f5f5f5;padding:15px;border-radius:5px;">${messageHtml}</div>
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })}</p>
        `,
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: lead.email,
        subject: 'We received your project enquiry — Brain Works Studio Africa',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color:#1A3050;">Thanks, ${e(lead.name)} — we've got your brief.</h2>
            <p>Our team will review your ${e(projectTypeLabel.toLowerCase())} enquiry and get back to you within one business day.</p>
            <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0;">
              <p><strong>What you told us:</strong></p>
              <p>${messageHtml}</p>
            </div>
            <p>Need to reach us sooner? Reply to this email or call +233 24 240 3450.</p>
            <p>Best regards,<br>Brain Works Studio Africa</p>
          </div>
        `,
      });
      emailDebug = { sent: true };
    } catch (emailError: any) {
      console.error('Contact form saved, but notification email failed:', emailError);
      emailDebug = { sent: false, error: emailError?.message || String(emailError) };
    }

    return NextResponse.json({ success: true, emailDebug });
  } catch (error) {
    console.error('Error processing contact form:', error);
    return NextResponse.json({ error: 'Failed to send your enquiry' }, { status: 500 });
  }
}
