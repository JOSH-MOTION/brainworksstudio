import { NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { quickSmsConfigured, sendPersonalizedBatch } from '@/lib/quicksms';
import { todayMonthDay } from '@/lib/birthday';

export const dynamic = 'force-dynamic';

// Runs daily (see vercel.json). Finds every contact whose birthdayMonthDay
// matches today, skips anyone already wished this calendar year (so a
// re-run or a slow cron retry can't double-send), and sends the saved
// template with {name} substituted per contact.
export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const auth = request.headers.get('authorization');
    if (auth !== `Bearer ${secret}`) {
      return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
    }
  }

  const db = adminDb!;
  const settingsDoc = await db.collection('settings').doc('birthdaySms').get();
  const settings = settingsDoc.data();
  if (!settings?.enabled) {
    return NextResponse.json({ ok: true, skipped: 'Birthday autosend is disabled', sent: 0 });
  }
  if (!quickSmsConfigured()) {
    return NextResponse.json({ ok: false, error: 'SMS provider not configured', sent: 0 });
  }

  const monthDay = todayMonthDay();
  const currentYear = new Date().getUTCFullYear();

  const snapshot = await db.collection('smsContacts').where('birthdayMonthDay', '==', monthDay).get();
  const due = snapshot.docs.filter((d) => d.data().lastBirthdaySentYear !== currentYear);

  if (due.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, matched: snapshot.size });
  }

  const contacts = due.map((d) => ({ id: d.id, phone: d.data().phone as string, name: d.data().name as string }));
  const results = await sendPersonalizedBatch(contacts, settings.template);
  const allOk = results.every((r) => r.ok);

  const batch = db.batch();
  for (const c of contacts) {
    batch.update(db.collection('smsContacts').doc(c.id), { lastBirthdaySentYear: currentYear });
  }
  await batch.commit();

  await db.collection('smsLogs').add({
    sentBy: 'cron:birthday-sms',
    recipientCount: contacts.length,
    message: settings.template,
    personalized: true,
    type: 'birthday',
    success: allOk,
    results,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: allOk, sent: contacts.length, matched: snapshot.size });
}
