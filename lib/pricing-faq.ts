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
];
