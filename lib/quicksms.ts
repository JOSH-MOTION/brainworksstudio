// Quick SMS (https://sendquicksms.com) — the gateway Brain Works Studio
// actually uses. POST /apisms/api/qapiv2 takes sender/message/numbers as
// *query params* (not a JSON body) and the key as an `api-key` header, per
// https://documenter.getpostman.com/view/6975808/2sB3QJNAfW. `numbers` is a
// single comma-separated list, so one call can carry a whole chunk — but
// only recipients getting the exact same message text can share a call.
//
// Despite the name, the `api-key` header wants the PUBLIC key, not the
// private one — confirmed by live testing: the private key gets rejected
// with "Unauthorized: Invalid or missing Key", the public key works.

export interface QuickSmsBatchResult {
  ok: boolean;
  count: number;
  error: string | null;
}

export function quickSmsConfigured() {
  return Boolean(process.env.QUICKSMS_PUBLIC_API_KEY && process.env.QUICKSMS_SENDER_ID);
}

const CHUNK_SIZE = 200;

/** Sends one message to many numbers (all get identical text). */
export async function sendViaQuickSms(recipients: string[], message: string): Promise<QuickSmsBatchResult[]> {
  const apiKey = process.env.QUICKSMS_PUBLIC_API_KEY!;
  const senderId = process.env.QUICKSMS_SENDER_ID!;
  const results: QuickSmsBatchResult[] = [];

  for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
    const chunk = recipients.slice(i, i + CHUNK_SIZE);
    const params = new URLSearchParams({ sender: senderId, message, numbers: chunk.join(',') });
    const res = await fetch(`https://linksengineering.net/apisms/api/qapiv2?${params.toString()}`, {
      method: 'POST',
      headers: { 'api-key': apiKey },
    });
    const data = await res.json().catch(() => ({}));
    results.push({ ok: res.ok && data.status === 'success', count: chunk.length, error: res.ok ? null : JSON.stringify(data) });
  }

  return results;
}

export function personalize(template: string, name: string | undefined | null, fallbackName = 'there') {
  const safeName = (name || '').trim() || fallbackName;
  return template.replace(/\{name\}/gi, safeName);
}

/**
 * Sends a (possibly) personalized message to many contacts, grouping
 * recipients that end up with identical rendered text into one API call —
 * so a plain broadcast with no {name} token still costs a single request.
 * `fallbackName` fills {name} for contacts with no name on file.
 */
export async function sendPersonalizedBatch(
  contacts: { phone: string; name?: string }[],
  template: string,
  fallbackName = 'there'
) {
  const groups = new Map<string, string[]>();
  for (const c of contacts) {
    const rendered = personalize(template, c.name, fallbackName);
    const list = groups.get(rendered) ?? [];
    list.push(c.phone);
    groups.set(rendered, list);
  }

  const results: QuickSmsBatchResult[] = [];
  for (const rendered of Array.from(groups.keys())) {
    const batch = await sendViaQuickSms(groups.get(rendered)!, rendered);
    results.push(...batch);
  }
  return results;
}
