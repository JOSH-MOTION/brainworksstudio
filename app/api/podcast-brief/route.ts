// app/api/podcast-brief/route.ts
// Podcast Shoot Brief form. Saves the brief to Firestore, emails BWSA, and
// sends the client a confirmation. Mirrors app/api/contact/route.ts.
import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { createTransporter, escapeHtml } from '@/lib/nodemailer';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const clean = (value: unknown, max = 200) => (typeof value === 'string' ? value.trim().slice(0, max) : '');
const cleanList = (value: unknown, max = 20): string[] =>
  Array.isArray(value) ? value.filter((v) => typeof v === 'string').map((v) => v.trim().slice(0, 100)).slice(0, max) : [];

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

    const brief = {
      // Section 1: Client info
      clientName: clean(body.clientName, 160),
      phone: clean(body.phone, 40),
      email: clean(body.email, 254).toLowerCase(),
      socialHandle: clean(body.socialHandle, 120),
      shootLocation: clean(body.shootLocation, 60),
      // Section 2: Podcast concept
      podcastName: clean(body.podcastName, 160),
      concept: clean(body.concept, 2000),
      targetAudience: clean(body.targetAudience, 500),
      donePodcastBefore: clean(body.donePodcastBefore, 10),
      episodeCount: clean(body.episodeCount, 60),
      format: clean(body.format, 40),
      vibe: cleanList(body.vibe),
      // Section 3: Production details
      hostCount: clean(body.hostCount, 20),
      maxGuests: clean(body.maxGuests, 20),
      episodesPerDay: clean(body.episodesPerDay, 20),
      episodeDuration: clean(body.episodeDuration, 60),
      shootFrequency: clean(body.shootFrequency, 40),
      provideServices: cleanList(body.provideServices),
      // Section 4: Logistics & budget
      proposedDateTime: clean(body.proposedDateTime, 100),
      publishPlatforms: cleanList(body.publishPlatforms),
      referenceLink: clean(body.referenceLink, 500),
      budget: clean(body.budget, 60),
      notes: clean(body.notes, 2000),
      sourcePage: clean(body.sourcePage, 200),
    };

    if (!brief.clientName || !brief.phone || !brief.email || !brief.podcastName || !brief.concept) {
      return NextResponse.json({ error: 'Please fill in all required fields.' }, { status: 400 });
    }
    if (!EMAIL_RE.test(brief.email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 });
    }

    await adminDb.collection('podcastBriefs').add({ ...brief, status: 'new', createdAt: new Date() });

    const e = escapeHtml;
    const joinList = (list: string[]) => (list.length ? list.map(e).join(', ') : '—');
    const rows: [string, string][] = [
      ['Name / Brand', brief.clientName],
      ['Phone / WhatsApp', brief.phone],
      ['Email', brief.email],
      ['Instagram / Social', brief.socialHandle || '—'],
      ['Shoot location', brief.shootLocation || '—'],
      ['Podcast name', brief.podcastName],
      ['Target audience', brief.targetAudience || '—'],
      ['Done before?', brief.donePodcastBefore === 'yes' ? `Yes — ${brief.episodeCount || '—'} episodes` : 'No, first time'],
      ['Format', brief.format || '—'],
      ['Vibe', joinList(brief.vibe)],
      ['Hosts', brief.hostCount || '—'],
      ['Max guests/episode', brief.maxGuests || '—'],
      ['Episodes that day', brief.episodesPerDay || '—'],
      ['Duration/episode', brief.episodeDuration || '—'],
      ['Shooting frequency', brief.shootFrequency || '—'],
      ['BWSA to provide', joinList(brief.provideServices)],
      ['Proposed date/time', brief.proposedDateTime || '—'],
      ['Publish platforms', joinList(brief.publishPlatforms)],
      ['Reference link', brief.referenceLink || '—'],
      ['Budget', brief.budget || '—'],
      ['Sent from', brief.sourcePage || '—'],
    ];
    const detailsTable = rows
      .map(([label, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#555;white-space:nowrap;"><strong>${label}</strong></td><td>${value}</td></tr>`)
      .join('');
    const conceptHtml = e(brief.concept).replace(/\n/g, '<br>');
    const notesHtml = e(brief.notes).replace(/\n/g, '<br>');

    // The brief is already saved above, so an email hiccup shouldn't make the
    // client think their submission was lost — log it and keep going.
    try {
      const transporter = createTransporter();

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: process.env.SMTP_USER,
        replyTo: brief.email,
        subject: `New podcast shoot brief: ${brief.podcastName}`,
        html: `
          <h2>New Podcast Shoot Brief</h2>
          <table>${detailsTable}</table>
          <p><strong>Podcast concept:</strong></p>
          <div style="background:#f5f5f5;padding:15px;border-radius:5px;">${conceptHtml}</div>
          ${brief.notes ? `<p><strong>Anything else:</strong></p><div style="background:#f5f5f5;padding:15px;border-radius:5px;">${notesHtml}</div>` : ''}
          <p><strong>Submitted at:</strong> ${new Date().toLocaleString('en-GB', { timeZone: 'Africa/Accra' })}</p>
        `,
      });

      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: brief.email,
        subject: 'We received your podcast shoot brief — Brain Works Studio Africa',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color:#1A3050;">Thanks, ${e(brief.clientName)} — we've got your brief.</h2>
            <p>We've received the details for <strong>${e(brief.podcastName)}</strong> and our team will review them and get back to you within one business day with a tailored setup and quote.</p>
            <div style="background:#f5f5f5;padding:20px;border-radius:8px;margin:20px 0;">
              <p><strong>What you told us:</strong></p>
              <p>${conceptHtml}</p>
            </div>
            <p>Need to reach us sooner? Reply to this email or call +233 24 240 3450.</p>
            <p>Best regards,<br>Brain Works Studio Africa</p>
          </div>
        `,
      });
    } catch (emailError) {
      console.error('Podcast brief saved, but notification email failed:', emailError);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error processing podcast brief:', error);
    return NextResponse.json({ error: 'Failed to send your brief' }, { status: 500 });
  }
}
