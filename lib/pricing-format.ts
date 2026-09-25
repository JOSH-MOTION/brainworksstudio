// lib/pricing-format.ts
// Pricing names and prices are typed free-form in the admin panel, so they arrive
// ALL CAPS, misspelled, or with mixed currency symbols. These helpers normalise
// them for display without changing the stored data or the URLs.

const KNOWN_TYPOS: [RegExp, string][] = [
  [/\bcorperate\b/gi, 'Corporate'],
  [/\breal estates\b/gi, 'Real Estate'],
];

/** "CORPERATE PRODUCTION " -> "Corporate Production"; "WEDDING (Videography)" -> "Wedding (Videography)". */
export function formatCategoryName(name: string): string {
  let out = (name || '').replace(/\s+/g, ' ').trim();
  for (const [pattern, fix] of KNOWN_TYPOS) out = out.replace(pattern, fix);
  // Title-case words typed in all caps; leave mixed-case words (and "+" / "&") alone.
  return out.replace(/[A-Za-z]+/g, (word) =>
    word.length > 1 && word === word.toUpperCase() ? word[0] + word.slice(1).toLowerCase() : word
  );
}

/** Normalises any cedi notation (₵, ¢, GHS, GH¢, "GH ₵") to "GH₵" and adds thousands separators. */
export function formatPrice(price: string): string {
  if (!price) return price;
  let out = price.replace(/\b(?:GHS|GHC)\b\s*|GH\s*[₵¢]\s*|[₵¢]\s*/gi, 'GH₵');
  // Bare number such as "4500" or "4,500.00" -> "GH₵4,500"
  if (/^\s*\d[\d,]*(\.\d+)?\s*$/.test(out)) out = `GH₵${out.trim()}`;
  return out.replace(/GH₵(\d{4,})(?![\d,])/g, (_, n: string) => `GH₵${Number(n).toLocaleString('en-US')}`);
}
