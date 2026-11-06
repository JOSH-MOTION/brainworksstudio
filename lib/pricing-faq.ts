// lib/pricing-faq.ts
// Real, verifiable answers only — never invented pricing policy. Add new
// entries here once the actual business policy is confirmed (deposit terms,
// travel fees outside Accra, cancellation policy, payment methods, etc.).
export interface PricingFaqItem {
  question: string;
  answer: string;
}

export const PRICING_FAQ: PricingFaqItem[] = [
  {
    question: 'Can I combine photography and videography into one package?',
    answer:
      'Yes — some of our packages, like Engagement + Wedding, already bundle photography and videography together, and individual packages can be combined on request.',
  },
  {
    question: 'How do I book a package?',
    answer:
      'You can book directly through our booking page, or contact us to discuss a custom package tailored to your event.',
  },
  {
    question: 'How much deposit do I need to pay to book?',
    answer:
      'A 70% deposit secures your booking, with the remaining 30% due on or before the shoot.',
  },
  {
    question: 'Can I reschedule my session?',
    answer: 'Yes — rescheduling is available with at least 48 hours’ notice.',
  },
  {
    question: 'How long until I receive my photos or videos?',
    answer:
      'Standard delivery is within 5–7 working days, through a private online gallery.',
  },
  {
    question: 'Do you provide the RAW, unedited files?',
    answer:
      'No — RAW files are not included. You’ll receive the final, professionally edited photos and videos from your session.',
  },
];
