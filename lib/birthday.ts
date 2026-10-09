// Only month/day matters for an annual birthday match — storing it
// separately from the full date (which may have an approximate/unknown
// year) makes the "whose birthday is today" cron query a plain equality
// check instead of a date-range one.
export function monthDayFromDate(dateStr: string | null | undefined): string | null {
  if (!dateStr) return null;
  const match = dateStr.match(/^\d{4}-(\d{2})-(\d{2})/);
  return match ? `${match[1]}-${match[2]}` : null;
}

/** "MM-DD" for today, in Ghana's timezone (UTC+0, so this is just UTC). */
export function todayMonthDay(): string {
  const now = new Date();
  const mm = String(now.getUTCMonth() + 1).padStart(2, '0');
  const dd = String(now.getUTCDate()).padStart(2, '0');
  return `${mm}-${dd}`;
}
