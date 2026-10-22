// lib/site-config.ts
// Single source for contact details, service pillars, and verified stats so
// the header, footer, homepage, contact page, and schema stay consistent.

export const SITE = {
  name: 'Brain Works Studio Africa',
  shortName: 'BWSA',
  url: 'https://brainworksstudioafrica.com',
  email: 'bwsa@brainworksstudioafrica.com',
  phoneDisplay: '+233 24 240 3450',
  phoneE164: '+233242403450',
  // TODO(BWSA): confirm this number is the WhatsApp line.
  whatsappUrl: 'https://wa.me/233242403450',
  location: 'Lapaz, Accra, Ghana',
  hours: 'Mon–Fri: 9am–6pm GMT · Weekends by appointment',
  positioning:
    'An African creative production company creating powerful visual stories for brands, organisations, events and people.',
  // Google Business Profile — update these by hand as the real listing
  // changes (static badge, not a live API sync).
  googleReviewUrl: 'https://share.google/gWSVlK9LwY2XtZFQi',
  googleRating: 4.8,
  googleReviewCount: 16,
  // Flip to false by hand when fully booked — shown as a status pill in the hero.
  availableForBookings: true,
};

// Hand-picked from the real Google Business listing — excludes reviews left
// by BWSA's own team members (Joshua Doe/CEO, Michael Bekoe Otoo/Director,
// Albert Makafui Kakabiku/Designer all reviewed their own company on
// Google). Update by hand if the listing changes.
export const GOOGLE_QUOTES: { name: string; text: string }[] = [
  {
    name: 'Bernice Kissiwaa Asante',
    text: 'The photographers were highly professional, arrived early, and made everyone feel comfortable and relaxed.',
  },
  {
    name: 'Elsie Elphine',
    text: 'Very good photography and videography, trustworthy and professional — definitely getting them again for my graduation next year.',
  },
  {
    name: 'Jessica Doe',
    text: 'I recently worked with Brain works studio and they were really amazing. What I love most is how much they care about their clients.',
  },
  {
    name: 'Diana Adigbli',
    text: 'The layout is clean and elegant, allowing the stunning photography to take center stage.',
  },
  {
    name: 'Sandra Attimah',
    text: 'They are the best, their pictures look natural.',
  },
  {
    name: 'Gershon Atta',
    text: 'A team at its best. Highly recommended.',
  },
];

export const HOW_IT_WORKS: { step: string; title: string; description: string }[] = [
  {
    step: '01',
    title: 'Reach out',
    description: 'Message us on WhatsApp, call, or fill in the project form with your occasion, date and the look you have in mind.',
  },
  {
    step: '02',
    title: 'Get your quote',
    description: 'We come back within one business day with ideas, availability and a clear, itemised quote.',
  },
  {
    step: '03',
    title: 'Production day',
    description: 'Our crew arrives prepared and directs every shot — lighting, posing and setup handled from start to finish.',
  },
  {
    step: '04',
    title: 'Delivery',
    description: 'Edited, colour-graded final photos and films delivered to your own private online gallery.',
  },
];

// Only figures BWSA can substantiate belong here (audit §4). Sections that
// display stats are hidden while this list is empty.
export const VERIFIED_STATS: { value: string; label: string }[] = [];

export interface ServicePillar {
  slug: string;
  name: string;
  summary: string;
  includes: string[];
  href: string; // dedicated landing page when one exists, otherwise the enquiry form pre-filled
  image: string; // card photo in /public — swap for a stronger project shot any time
  forBusiness?: boolean;
}

export const SERVICE_PILLARS: ServicePillar[] = [
  {
    slug: 'commercial',
    name: 'Commercial & Brand Production',
    summary: 'Commercials, campaign films and branded content that sell.',
    includes: ['TV/digital commercials', 'Campaign films', 'Product launches', 'Branded films', 'Creative concepts'],
    href: '/services/commercial-video-production-ghana',
    image: '/hero1.jpg',
    forBusiness: true,
  },
  {
    slug: 'corporate',
    name: 'Corporate Production',
    summary: 'Company profiles, interviews and internal films for organisations.',
    includes: ['Company profiles', 'Corporate films', 'Training videos', 'Interviews', 'Conferences', 'Internal communications'],
    href: '/services/corporate-video-production-ghana',
    image: '/Corperate.jpg',
    forBusiness: true,
  },
  {
    slug: 'social',
    name: 'Social & Content Production',
    summary: 'Short-form, vertical and monthly content built for social feeds.',
    includes: ['TikTok / Reels', 'Monthly content', 'Vertical video', 'Short-form campaigns', 'Social cutdowns'],
    href: '/contact?type=social',
    image: '/potrait.jpg',
    forBusiness: true,
  },
  {
    slug: 'live',
    name: 'Live Production & Streaming',
    summary: 'Multi-camera livestreams and broadcast for events of any size.',
    includes: ['Multi-camera livestreams', 'Broadcast switching', 'Technical crew', 'Recording', 'Graphics'],
    href: '/services/live-streaming-production-ghana',
    image: '/Corperate1.jpg',
    forBusiness: true,
  },
  {
    slug: 'events',
    name: 'Events & Weddings',
    summary: 'Photography and film for weddings, celebrations and private events.',
    includes: ['Event photography', 'Event videography', 'Wedding films', 'Private events'],
    href: '/services/wedding-photography-accra',
    image: '/image.jpg',
  },
  {
    slug: 'photography',
    name: 'Photography',
    summary: 'Corporate, event, product, portrait, real estate and fashion photography.',
    includes: ['Corporate', 'Events', 'Weddings', 'Product', 'Portraits', 'Real estate', 'Fashion'],
    href: '/services/corporate-photography-ghana',
    image: '/Abigail%20Graduation-image-4.jpg',
    forBusiness: true,
  },
  {
    slug: 'post',
    name: 'Post-Production',
    summary: 'Editing, colour, motion graphics, sound and subtitles.',
    includes: ['Editing', 'Colour', 'Motion graphics', 'Subtitles', 'Sound', 'Social cutdowns'],
    href: '/contact?type=post',
    image: '/vid1.jpeg',
  },
  {
    slug: 'creative',
    name: 'Creative & Design',
    summary: 'Creative direction, graphic design and campaign assets.',
    includes: ['Creative direction', 'Graphic design', 'Branding support', 'Campaign assets'],
    href: '/contact?type=creative',
    image: '/hero-bg.jpg',
  },
];

// Options for the "Start a Project" form. Values match SERVICE_PILLARS slugs
// so /contact?type=<slug> pre-selects the right project type.
export const PROJECT_TYPES = [
  ...SERVICE_PILLARS.map((p) => ({ value: p.slug, label: p.name })),
  { value: 'other', label: 'Something else' },
];

export const BUDGET_RANGES = [
  'Under GH₵5,000',
  'GH₵5,000 – GH₵15,000',
  'GH₵15,000 – GH₵50,000',
  'GH₵50,000+',
  'Not sure yet',
];

export const REFERRAL_SOURCES = ['Instagram', 'TikTok', 'Google search', 'Referral / word of mouth', 'LinkedIn', 'Other'];
