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
  /** Numbers actually in this batch — without this, a partial failure is
   * unrecoverable: there's no way to know who needs a retry. */
  phones: string[];
  error: string | null;
}

export function quickSmsConfigured() {
  return Boolean(process.env.QUICKSMS_PUBLIC_API_KEY && process.env.QUICKSMS_SENDER_ID);
}

const CHUNK_SIZE = 200;
// A 100-contact personalized send can fan out into 80+ individual calls in
// a tight loop. A real send hit this exact pattern — ~31 through, then every
// subsequent call failed with no error captured (that bug is fixed below
// too) — consistent with either rate-limiting or the account running out of
// credit mid-send. This delay is a cheap guard against the rate-limit case;
// it does nothing for a balance issue, which needs checking on the
// QuickSMS dashboard instead.
const THROTTLE_MS = Number(process.env.QUICKSMS_THROTTLE_MS ?? 350);

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function callQuickSms(numbers: string[], message: string): Promise<{ ok: boolean; error: string | null }> {
  const apiKey = process.env.QUICKSMS_PUBLIC_API_KEY!;
  const senderId = process.env.QUICKSMS_SENDER_ID!;
  const params = new URLSearchParams({ sender: senderId, message, numbers: numbers.join(',') });
  const res = await fetch(`https://linksengineering.net/apisms/api/qapiv2?${params.toString()}`, {
    method: 'POST',
    headers: { 'api-key': apiKey },
  });
  const data = await res.json().catch(() => ({}));
  const ok = res.ok && data.status === 'success';
  // Previously only stringified `data` when the HTTP call itself failed —
  // but QuickSMS can return HTTP 200 with a failure status in the body
  // (e.g. insufficient balance), which was silently logged as `error: null`.
  return { ok, error: ok ? null : `HTTP ${res.status}: ${JSON.stringify(data)}` };
}

/** Sends one message to many numbers (all get identical text), one retry on failure after a short delay. */
export async function sendViaQuickSms(recipients: string[], message: string): Promise<QuickSmsBatchResult[]> {
  const results: QuickSmsBatchResult[] = [];

  for (let i = 0; i < recipients.length; i += CHUNK_SIZE) {
    const chunk = recipients.slice(i, i + CHUNK_SIZE);
    if (i > 0) await sleep(THROTTLE_MS);

    let outcome = await callQuickSms(chunk, message);
    if (!outcome.ok) {
      await sleep(THROTTLE_MS * 2);
      outcome = await callQuickSms(chunk, message);
    }
    results.push({ ok: outcome.ok, phones: chunk, error: outcome.error });
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
  const keys = Array.from(groups.keys());
  for (let i = 0; i < keys.length; i++) {
    if (i > 0) await sleep(THROTTLE_MS);
    const batch = await sendViaQuickSms(groups.get(keys[i])!, keys[i]);
    results.push(...batch);
  }
  return results;
}
