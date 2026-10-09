// Normalizes Ghanaian numbers (and generally any with a leading 0 or +) to a
// bare digit string starting with the country code, e.g. "0207342441" or
// "+233207342441" -> "233207342441". Used as the smsContacts document ID so
// re-importing the same number updates rather than duplicates it.
export function normalizePhone(raw: string): string | null {
  const digits = raw.replace(/[^\d]/g, '');
  if (!digits) return null;
  if (digits.startsWith('233')) return digits;
  if (digits.startsWith('0')) return `233${digits.slice(1)}`;
  return digits;
}
