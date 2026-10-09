import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/require-admin';
import { normalizePhone } from '@/lib/phone';
import { monthDayFromDate } from '@/lib/birthday';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const snapshot = await adminDb!.collection('smsContacts').orderBy('createdAt', 'desc').get();
  const contacts = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(contacts);
}

// Also doubles as "edit" — the UI calls this with an existing contact's
// phone number to update their name/birthday. `source` is only set on
// first creation so an edit doesn't relabel an imported contact as manual.
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const { name, phone, birthday } = await request.json().catch(() => ({}));
  const normalized = typeof phone === 'string' ? normalizePhone(phone) : null;
  if (!normalized) {
    return NextResponse.json({ error: 'A valid phone number is required' }, { status: 400 });
  }

  const ref = adminDb!.collection('smsContacts').doc(normalized);
  const existing = await ref.get();

  await ref.set(
    {
      name: (name || '').trim(),
      phone: normalized,
      birthday: birthday || null,
      birthdayMonthDay: monthDayFromDate(birthday),
      source: existing.exists ? existing.data()!.source : 'manual',
      createdAt: existing.exists ? existing.data()!.createdAt : new Date(),
      lastBirthdaySentYear: existing.exists ? (existing.data()!.lastBirthdaySentYear ?? null) : null,
    },
    { merge: false }
  );

  return NextResponse.json({ ok: true, id: normalized });
}
