// lib/services-config.ts
// Config-driven data for the /services/[slug] landing pages.
import { PortfolioItem } from '@/types';

export interface ServiceFaq {
  question: string;
  answer: string;
}

export interface ServiceConfig {
  slug: string;
  name: string; // e.g. "Wedding Photography"
  metaTitle: string;
  metaDescription: string;
  heroKicker: string;
  intro: string;
  whatIncluded: string[];
  process: { title: string; description: string }[];
  whyBrainWorks: string[];
  serviceArea: string;
  faqs: ServiceFaq[];
  pricingHref: string;
  pricingLabel: string;
  image: string; // hero + card photo in /public
  relatedBlogSlug?: string;
  relatedBlogTitle?: string;
  matchesPortfolioItem: (item: PortfolioItem) => boolean;
}

const isWedding = (item: PortfolioItem) =>
  item.title.toLowerCase().includes('wedding') ||
  item.tags.some((tag) => tag.toLowerCase().includes('wedding'));

const hasTag = (item: PortfolioItem, ...needles: string[]) =>
  item.tags.some((tag) => needles.some((n) => tag.toLowerCase().includes(n)));

export const SERVICES: ServiceConfig[] = [
  {
    slug: 'commercial-video-production-ghana',
    name: 'Commercial Video Production',
    metaTitle: 'Commercial Video Production in Accra, Ghana | Brain Works Studio Africa',
    metaDescription:
      'TV and digital commercials, campaign films, product launches and branded content produced in Accra, Ghana by Brain Works Studio Africa.',
    heroKicker: 'Commercial & Brand Production · Ghana',
    intro:
      'A commercial has one job: make the right people act. We take your brief from concept and script through production and post, and deliver cuts sized for TV, YouTube, and every social placement your campaign runs on.',
    whatIncluded: [
      'Creative concept, scripting and storyboarding',
      'TV and digital commercials',
      'Campaign and brand films',
      'Product launch content',
      'Cast, location and crew coordination',
      'Edit, colour, sound and motion graphics',
      'Cutdowns for social (vertical, square, 6s/15s/30s)',
    ],
    process: [
      { title: 'Brief & concept', description: 'We define the audience, message and call to action, then present a creative concept and script.' },
      { title: 'Pre-production', description: 'Casting, locations, shot list, schedule and crew are locked before the shoot day.' },
      { title: 'Production', description: 'A crew sized to the project — from a lean team to full production with lighting, sound and drone.' },
      { title: 'Post & delivery', description: 'Edit, grade, sound mix and graphics, delivered in every format and aspect ratio you need.' },
    ],
    whyBrainWorks: [
      'One team from concept to final cut — no hand-offs between agencies and crews.',
      'We assemble the right creative and technical crew for the size of the project.',
      'Deliverables planned for where the ad will actually run, not just one master file.',
    ],
    serviceArea: 'Based in Accra, producing across Ghana and West Africa.',
    faqs: [
      {
        question: 'How much does a commercial cost in Ghana?',
        answer:
          'It depends on the concept, shoot days, crew, cast and locations. Commercial work is quoted per project — tell us about your campaign and we\'ll send a proposal.',
      },
      {
        question: 'Can you write the script and concept, or do we need an agency?',
        answer: 'We can develop the concept and script with you, or produce from an agency\'s existing brief.',
      },
      {
        question: 'Do you deliver social versions as well as the main ad?',
        answer: 'Yes — we plan vertical and short cutdowns during production so they\'re not an afterthought.',
      },
    ],
    pricingHref: '/pricing/commercials',
    pricingLabel: 'See commercial pricing',
    image: '/hero1.jpg',
    matchesPortfolioItem: (item) =>
      ['Commercials & Adverts', 'Promotional', 'Product'].includes(item.category) || hasTag(item, 'commercial', 'brand', 'advert'),
  },
  {
    slug: 'corporate-video-production-ghana',
    name: 'Corporate Video Production',
    metaTitle: 'Corporate Video Production in Accra, Ghana | Brain Works Studio Africa',
    metaDescription:
      'Company profiles, corporate films, training videos, interviews and conference coverage for organisations in Ghana — from Brain Works Studio Africa.',
    heroKicker: 'Corporate Production · Ghana',
    intro:
      'Corporate video should explain, persuade or train — clearly. We produce company profiles, leadership interviews, training content and conference coverage that your team can actually use with clients, staff and stakeholders.',
    whatIncluded: [
      'Company profile and brand story films',
      'Leadership and staff interviews',
      'Training and onboarding videos',
      'Conference and event coverage',
      'Internal communications content',
      'Subtitles, graphics and branded templates',
    ],
    process: [
      { title: 'Discovery', description: 'We learn who the video is for, what it needs to achieve and where it will be shown.' },
      { title: 'Planning', description: 'Script or interview outline, schedule and locations agreed with your team.' },
      { title: 'Filming', description: 'Discreet crews that work around your office and staff with minimal disruption.' },
      { title: 'Delivery', description: 'Branded edits with subtitles, ready for your website, presentations and channels.' },
    ],
    whyBrainWorks: [
      'Comfortable filming executives and staff who aren\'t used to being on camera.',
      'Photography, video and live streaming from one team for larger corporate events.',
      'Clear timelines and approvals built for corporate sign-off processes.',
    ],
    serviceArea: 'Accra and Greater Accra, with travel for corporate productions across Ghana.',
    faqs: [
      {
        question: 'How much does a corporate video cost?',
        answer:
          'Simple interview or event packages start from our published rates; larger productions are quoted per project. See corporate pricing or send us your brief.',
      },
      {
        question: 'Can you film at our office?',
        answer: 'Yes — most corporate shoots happen on-site. We bring lighting and sound so the result looks professional in any space.',
      },
      {
        question: 'Do you provide subtitles?',
        answer: 'Yes, subtitles and captions can be included so videos work on muted social feeds and for accessibility.',
      },
    ],
    pricingHref: '/pricing/corperate-production',
    pricingLabel: 'See corporate pricing',
    image: '/Corperate.jpg',
    matchesPortfolioItem: (item) => item.category === 'Corporate' || hasTag(item, 'corporate', 'conference'),
  },
  {
    slug: 'live-streaming-production-ghana',
    name: 'Live Streaming Production',
    metaTitle: 'Live Streaming Production in Accra, Ghana | Brain Works Studio Africa',
    metaDescription:
      'Multi-camera live streaming, broadcast switching, graphics and recording for conferences, launches, concerts and churches in Ghana — Brain Works Studio Africa.',
    heroKicker: 'Live Production & Streaming · Ghana',
    intro:
      'When your audience is watching live, there is no second take. We run multi-camera productions with switching, graphics, audio and a stable stream — and record everything so you have content after the event too.',
    whatIncluded: [
      'Multi-camera setup with live switching',
      'Streaming to YouTube, Facebook, Zoom or a private link',
      'Lower-thirds, titles and on-screen graphics',
      'Audio feed from your PA or our own mics',
      'Full technical crew and on-site rehearsal',
      'Recording of the programme for later editing',
    ],
    process: [
      { title: 'Site check', description: 'We assess the venue, power, internet and camera positions before the day.' },
      { title: 'Run of show', description: 'Graphics, cues and segments planned with your programme team.' },
      { title: 'Live', description: 'Our crew runs cameras, switching, audio and stream monitoring throughout.' },
      { title: 'After the event', description: 'Recorded footage delivered, with optional highlight edits.' },
    ],
    whyBrainWorks: [
      'Experience with conferences, church services, launches and hybrid events.',
      'Backup plans for connectivity and power, planned during the site check.',
      'Photography and video recap from the same team if you need them.',
    ],
    serviceArea: 'Accra and Greater Accra, with travel for live productions across Ghana.',
    faqs: [
      {
        question: 'What internet do we need for a live stream?',
        answer: 'A stable wired connection is best. We check this during the site visit and can advise on bonded or backup connections.',
      },
      {
        question: 'Which platforms can you stream to?',
        answer: 'YouTube, Facebook, Zoom, and most platforms that accept an RTMP stream — including several at once.',
      },
      {
        question: 'How much does live streaming cost?',
        answer: 'It depends on the number of cameras, crew and hours. See live streaming pricing, or contact us for a custom quote on larger productions.',
      },
    ],
    pricingHref: '/pricing/live-streaming-production',
    pricingLabel: 'See live streaming pricing',
    image: '/Corperate1.jpg',
    matchesPortfolioItem: (item) => hasTag(item, 'live', 'stream', 'broadcast'),
  },
  {
    slug: 'wedding-photography-accra',
    name: 'Wedding Photography',
    metaTitle: 'Wedding Photography in Accra, Ghana | Brain Works Studio Africa',
    metaDescription:
      'Professional wedding photography in Accra, Ghana — traditional and white wedding coverage, engagement shoots, and same-day highlights from Brain Works Studio Africa.',
    heroKicker: 'Wedding Photography · Accra, Ghana',
    intro:
      'Your wedding day moves fast — the knocking ceremony, the white wedding, the reception, all in one day. We cover it the way it actually happens: candid, well-lit, and true to how the day felt, not staged for a camera.',
    whatIncluded: [
      'Traditional (knocking/engagement) ceremony coverage',
      'White wedding and reception coverage',
      'Full-day or half-day options',
      'Second shooter available for simultaneous bride/groom prep coverage',
      'Edited digital gallery with fast turnaround',
      'Optional drone photography and printed albums',
    ],
    process: [
      { title: 'Consultation', description: 'We talk through your venues, timeline, and the moments that matter most to you before we quote anything.' },
      { title: 'Wedding day', description: 'Our team arrives ahead of schedule, works quietly around your guests, and stays until the moments you actually want captured are done.' },
      { title: 'Editing', description: 'Every image is hand-edited for color, skin tone, and light — not run through a single preset for the whole gallery.' },
      { title: 'Delivery', description: 'You get a private online gallery to view, share, and download in full resolution.' },
    ],
    whyBrainWorks: [
      'Based in Accra, and shoot weddings across Ghana — we know the venues, the light, and the timing.',
      'Photography and videography under one studio, so your photographer and videographer are already coordinated.',
      'Real weddings in our portfolio, not stock samples.',
    ],
    serviceArea: 'Accra and the Greater Accra Region, with destination coverage across Ghana on request.',
    faqs: [
      {
        question: 'How much does wedding photography cost in Accra?',
        answer:
          'It depends on how many events you need covered (traditional, white wedding, reception), hours of coverage, and whether you want a second shooter or drone footage. See our wedding pricing for exact package rates, or contact us for a custom quote.',
      },
      {
        question: 'Do you cover both the traditional and white wedding?',
        answer: 'Yes — most couples book both, either as separate packages or bundled together. We can also cover just one if that\'s all you need.',
      },
      {
        question: 'How long until we get our photos?',
        answer: 'Turnaround varies by package; we confirm an exact delivery date in writing before you book, so there\'s no ambiguity.',
      },
      {
        question: 'Can you also film our wedding, not just photograph it?',
        answer: 'Yes — we offer wedding videography alongside photography, and bundling both is usually more cost-effective than hiring two separate teams.',
      },
    ],
    pricingHref: '/pricing/wedding-photography',
    pricingLabel: 'See wedding photography pricing',
    image: '/image.jpg',
    relatedBlogSlug: 'how-much-does-wedding-photography-cost-in-accra-ghana-2026-pricing-guide',
    relatedBlogTitle: 'How Much Does Wedding Photography Cost in Accra, Ghana?',
    matchesPortfolioItem: (item) => item.type === 'photography' && isWedding(item),
  },
  {
    slug: 'event-photography-accra',
    name: 'Event Photography',
    metaTitle: 'Event Photography in Accra, Ghana | Brain Works Studio Africa',
    metaDescription:
      'Event photography in Accra, Ghana for birthdays, anniversaries, graduations, naming ceremonies, and private celebrations — from Brain Works Studio Africa.',
    heroKicker: 'Event Photography · Accra, Ghana',
    intro:
      'Birthdays, graduations, anniversaries, naming ceremonies — the events that mark real milestones deserve more than a phone camera in the corner. We work the room quietly and get the moments guests don\'t know are being captured.',
    whatIncluded: [
      'Full event coverage from arrival to close',
      'Candid guest and family portraits',
      'Key-moment coverage (speeches, cake, entrances)',
      'Edited digital gallery',
      'Same-day highlight option for time-sensitive events',
    ],
    process: [
      { title: 'Briefing', description: 'We confirm your run of show and the specific moments you don\'t want missed.' },
      { title: 'Coverage', description: 'We shoot discreetly throughout, without disrupting your program or guests.' },
      { title: 'Editing', description: 'Color-corrected, cropped, and curated — not a raw dump of every frame.' },
      { title: 'Delivery', description: 'A private gallery link, ready to share with family.' },
    ],
    whyBrainWorks: [
      'Experienced with Ghanaian event formats — from naming ceremonies to graduation receptions.',
      'One studio for photography and videography if you need both.',
      'Fast, clear communication before and during the event.',
    ],
    serviceArea: 'Accra and the Greater Accra Region, with availability across Ghana for larger celebrations.',
    faqs: [
      {
        question: 'How much does event photography cost in Accra?',
        answer:
          'Pricing depends on event length and the number of photographers needed. Contact us with your event details for an accurate quote.',
      },
      {
        question: 'Can you cover a graduation or naming ceremony, not just a party?',
        answer: 'Yes — our event coverage applies to graduations, naming ceremonies, birthdays, anniversaries, and similar milestone celebrations.',
      },
      {
        question: 'Do you provide same-day photos?',
        answer: 'For select packages, yes — ask about same-day highlight delivery when you book.',
      },
    ],
    pricingHref: '/pricing',
    pricingLabel: 'See all pricing packages',
    image: '/event.jpg',
    matchesPortfolioItem: (item) => item.type === 'photography' && item.category === 'Event' && !isWedding(item),
  },
  {
    slug: 'corporate-photography-ghana',
    name: 'Corporate Photography',
    metaTitle: 'Corporate Photography in Ghana | Brain Works Studio Africa',
    metaDescription:
      'Corporate event, dinner, and product-launch photography for Ghanaian businesses in Accra and beyond — from Brain Works Studio Africa.',
    heroKicker: 'Corporate Photography · Ghana',
    intro:
      'Corporate dinners, product launches, conferences, and brand activations are your company\'s biggest visibility moments. We shoot them the way a business actually uses the photos afterward — for press, social media, and internal reporting, not just a keepsake gallery.',
    whatIncluded: [
      'Full event and dinner coverage',
      'Executive and stage-moment portraits',
      'Product launch and activation coverage',
      'Fast-turnaround edits for press or same-day social media use',
      'Video recap add-on available',
    ],
    process: [
      { title: 'Brief', description: 'We align on your brand guidelines, key attendees, and what the photos need to support afterward (press, socials, reports).' },
      { title: 'Coverage', description: 'Our team works low-light indoor events and stage moments without disrupting proceedings.' },
      { title: 'Fast edit', description: 'A first batch of edited images is prioritized for same-day or next-day delivery when needed.' },
      { title: 'Delivery', description: 'Full-resolution gallery, ready for your marketing and communications team.' },
    ],
    whyBrainWorks: [
      'Comfortable shooting mixed indoor lighting typical of Ghanaian conference halls and hotel event spaces.',
      'Fast turnaround for press-sensitive events.',
      'One studio for photography, video recap, and even live streaming, if the event needs it.',
    ],
    serviceArea: 'Accra and Greater Accra, with coverage available across Ghana for company off-sites and launches.',
    faqs: [
      {
        question: 'Do you work with corporate clients outside Accra?',
        answer: 'Yes — we travel for company events and launches across Ghana; contact us with your event location for availability and travel costs.',
      },
      {
        question: 'Can you turn around photos the same day for press or social media?',
        answer: 'For select packages, yes — let us know this is a requirement when you book so we can plan the edit workflow around it.',
      },
      {
        question: 'Do you also do headshots for our team?',
        answer: 'Yes — executive and team headshots can be bundled into a corporate event booking or arranged as a standalone session.',
      },
    ],
    pricingHref: '/pricing/corperate-production',
    pricingLabel: 'See corporate production pricing',
    image: '/Corperate.jpg',
    matchesPortfolioItem: (item) => item.category === 'Corporate',
  },
  {
    slug: 'product-photography-ghana',
    name: 'Product Photography',
    metaTitle: 'Product Photography in Ghana | Brain Works Studio Africa',
    metaDescription:
      'Product and commercial photography for Ghanaian brands and e-commerce businesses — from Brain Works Studio Africa in Accra.',
    heroKicker: 'Product & Commercial Photography · Ghana',
    intro:
      'Clean, well-lit product photography is often the difference between a scroll-past and a sale. We shoot for e-commerce listings, catalogues, and ad creative, with consistent lighting and backgrounds across a full product line.',
    whatIncluded: [
      'Studio product photography with consistent lighting',
      'Lifestyle/contextual product shots',
      'Multiple angles per product for e-commerce listings',
      'Background/backdrop options',
      'Fast batch editing for full product catalogues',
    ],
    process: [
      { title: 'Product intake', description: 'We review your product list and confirm angles, backgrounds, and any lifestyle context needed.' },
      { title: 'Studio shoot', description: 'Controlled lighting for consistent color and shadow across your whole catalogue.' },
      { title: 'Batch editing', description: 'Color correction and background cleanup applied consistently across every product.' },
      { title: 'Delivery', description: 'Sized and organized files ready to upload directly to your store or catalogue.' },
    ],
    whyBrainWorks: [
      'Consistent lighting and color across large product batches — not a different look per shot.',
      'Experience shooting for Ghanaian e-commerce and retail brands.',
      'Quick turnaround for businesses that need listings live fast.',
    ],
    serviceArea: 'In-studio and on-location product photography in Accra, with delivery to clients nationwide.',
    faqs: [
      {
        question: 'Do I need to bring products to a studio, or can you shoot on-site?',
        answer: 'Both are available — studio shoots give the most lighting control, but we also shoot on-location for larger or fixed products.',
      },
      {
        question: 'How many products can you shoot in one session?',
        answer: 'It depends on product complexity and angles needed; tell us your catalogue size and we\'ll estimate the session length and cost.',
      },
      {
        question: 'Can you shoot lifestyle images, not just plain white-background product shots?',
        answer: 'Yes — we do both studio product shots and styled lifestyle/contextual photography for marketing and social media use.',
      },
    ],
    pricingHref: '/pricing/commercials',
    pricingLabel: 'See commercial photography pricing',
    image: '/hero1.jpg',
    matchesPortfolioItem: (item) => item.category === 'Product',
  },
  {
    slug: 'videography-accra',
    name: 'Videography',
    metaTitle: 'Videography in Accra, Ghana | Brain Works Studio Africa',
    metaDescription:
      'Cinematic videography in Accra, Ghana for weddings, corporate events, brand campaigns, and documentaries — from Brain Works Studio Africa.',
    heroKicker: 'Videography · Accra, Ghana',
    intro:
      'From wedding films to corporate recaps to brand campaigns, we shoot video the way it needs to be watched — with real sound, steady footage, and an edit that tells the story instead of just documenting the event.',
    whatIncluded: [
      'Wedding and engagement films',
      'Corporate event and training videos',
      'Brand and commercial video production',
      'Documentary and music video production',
      'Live streaming for hybrid and remote-audience events',
    ],
    process: [
      { title: 'Concept', description: 'We align on the story, tone, and where the final video will be used (social, broadcast, internal).' },
      { title: 'Production', description: 'Multi-camera and gimbal/drone coverage depending on the package.' },
      { title: 'Edit', description: 'Color grading, sound design, and pacing tailored to the video\'s actual use case.' },
      { title: 'Delivery', description: 'Final files sized for your platform — social, web, or broadcast.' },
    ],
    whyBrainWorks: [
      'Photography and videography under one studio — one team, one point of contact.',
      'Real experience across weddings, corporate, and brand/commercial video.',
      'Live streaming capability for hybrid events, when a video alone isn\'t enough.',
    ],
    serviceArea: 'Accra and Greater Accra, with travel for productions across Ghana.',
    faqs: [
      {
        question: 'Can you handle both photography and videography at the same event?',
        answer: 'Yes — most clients book both from us directly, which is usually more cost-effective and easier to coordinate than hiring two separate teams.',
      },
      {
        question: 'Do you offer drone footage?',
        answer: 'Yes, aerial/drone videography is available as an add-on for weddings, events, and corporate productions where it\'s permitted.',
      },
      {
        question: 'Can you live stream our event for remote guests?',
        answer: 'Yes — we offer live streaming production for hybrid events, conferences, and church/community services.',
      },
    ],
    pricingHref: '/pricing',
    pricingLabel: 'See all videography pricing',
    image: '/vid.jpeg',
    matchesPortfolioItem: (item) => item.type === 'videography',
  },
];

export function getServiceBySlug(slug: string): ServiceConfig | undefined {
  return SERVICES.find((s) => s.slug === slug);
}
