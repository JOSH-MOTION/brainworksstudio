import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/require-admin';
import { normalizePhone } from '@/lib/phone';
import { monthDayFromDate } from '@/lib/birthday';

export const dynamic = 'force-dynamic';

interface ImportRow {
  name?: string;
  phone?: string;
  /** "YYYY-MM-DD" (year can be a placeholder if unknown — only month/day are used). */
  birthday?: string;
}

// Upserts by normalized phone number (used as the doc ID), so re-importing
// the same list — or a later export with updated names — never duplicates
// a contact. Rows with no usable phone number are skipped and counted.
export async function POST(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const { rows } = (await request.json().catch(() => ({ rows: [] }))) as { rows: ImportRow[] };
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: 'No rows provided' }, { status: 400 });
  }

  const db = adminDb!;
  let imported = 0;
  let skipped = 0;
  const batchSize = 400; // stay under Firestore's 500-write batch limit

  for (let i = 0; i < rows.length; i += batchSize) {
    const batch = db.batch();
    for (const row of rows.slice(i, i + batchSize)) {
      const normalized = typeof row.phone === 'string' ? normalizePhone(row.phone) : null;
      if (!normalized) {
        skipped++;
        continue;
      }
      const ref = db.collection('smsContacts').doc(normalized);
      const data: Record<string, unknown> = { name: (row.name || '').trim(), phone: normalized, source: 'import', createdAt: new Date() };
      // Only touch birthday fields when the row actually has one, so a CSV
      // of just name/phone never wipes a birthday added manually later.
      if (row.birthday) {
        data.birthday = row.birthday;
        data.birthdayMonthDay = monthDayFromDate(row.birthday);
      }
      batch.set(ref, data, { merge: true });
      imported++;
    }
    await batch.commit();
  }

  return NextResponse.json({ ok: true, imported, skipped });
}
