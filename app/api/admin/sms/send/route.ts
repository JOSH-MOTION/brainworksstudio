import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/require-admin';
import { quickSmsConfigured, sendPersonalizedBatch } from '@/lib/quicksms';

export const dynamic = 'force-dynamic';

// `message` may contain a {name} token — recipients who share the exact
// same rendered text (e.g. nobody used personalization, or several
// contacts share a name) are sent in one batched call; the rest go out
// individually. See lib/quicksms.ts.
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const { contactIds, message, fallbackName } = await request.json().catch(() => ({}));
  if (!Array.isArray(contactIds) || contactIds.length === 0) {
    return NextResponse.json({ error: 'No recipients selected' }, { status: 400 });
  }
  if (typeof message !== 'string' || !message.trim()) {
    return NextResponse.json({ error: 'Message is empty' }, { status: 400 });
  }
  const resolvedFallback = typeof fallbackName === 'string' && fallbackName.trim() ? fallbackName.trim() : 'there';

  const db = adminDb!;
  const docs = await Promise.all(contactIds.map((id: string) => db.collection('smsContacts').doc(id).get()));
  const recipients = docs.filter((d) => d.exists).map((d) => ({ phone: d.data()!.phone as string, name: d.data()!.name as string }));
  if (recipients.length === 0) {
    return NextResponse.json({ error: 'Selected contacts no longer exist' }, { status: 400 });
  }

  if (!quickSmsConfigured()) {
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error: 'No SMS provider is configured yet (QUICKSMS_PUBLIC_API_KEY / QUICKSMS_SENDER_ID are not set).',
        recipients: recipients.map((r) => r.phone),
      },
      { status: 200 }
    );
  }

  const template = message.trim();
  const results = await sendPersonalizedBatch(recipients, template, resolvedFallback);
  const allOk = results.every((r) => r.ok);

  await db.collection('smsLogs').add({
    sentBy: admin.uid,
    recipientCount: recipients.length,
    message: template,
    personalized: /\{name\}/i.test(template),
    success: allOk,
    results,
    createdAt: new Date(),
  });

  return NextResponse.json({ ok: allOk, configured: true, recipientCount: recipients.length, results });
}
