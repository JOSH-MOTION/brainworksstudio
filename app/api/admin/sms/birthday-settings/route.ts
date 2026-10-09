import { NextRequest, NextResponse } from 'next/server';
import { adminDb } from '@/lib/firebase-admin';
import { requireAdmin } from '@/lib/require-admin';

export const dynamic = 'force-dynamic';

const DEFAULT_TEMPLATE = "Happy birthday, {name}! 🎉 Wishing you a wonderful day from all of us at Brain Works Studio Africa.";

export async function GET(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const doc = await adminDb!.collection('settings').doc('birthdaySms').get();
  const data = doc.data();
  return NextResponse.json({ enabled: data?.enabled ?? false, template: data?.template ?? DEFAULT_TEMPLATE });
}

export async function PUT(request: NextRequest) {
  const admin = await requireAdmin(request);
  if (admin instanceof NextResponse) return admin;

  const { enabled, template } = await request.json().catch(() => ({}));
  if (typeof template !== 'string' || !template.trim()) {
    return NextResponse.json({ error: 'Template message is required' }, { status: 400 });
  }

  await adminDb!
    .collection('settings')
    .doc('birthdaySms')
    .set({ enabled: Boolean(enabled), template: template.trim(), updatedAt: new Date() }, { merge: true });

  return NextResponse.json({ ok: true });
}
