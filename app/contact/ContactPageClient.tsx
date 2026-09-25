'use client';

import { useEffect, useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { SITE, PROJECT_TYPES, BUDGET_RANGES, REFERRAL_SOURCES } from '@/lib/site-config';
import MotionCard from '@/components/MotionCard';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

// Maps /services/<slug> landing pages to a project type so "Start a Project"
// links from those pages arrive with the right option pre-selected.
const SERVICE_TO_PROJECT_TYPE: Record<string, string> = {
  'commercial-video-production-ghana': 'commercial',
  'corporate-video-production-ghana': 'corporate',
  'live-streaming-production-ghana': 'live',
  'wedding-photography-accra': 'events',
  'event-photography-accra': 'events',
  'corporate-photography-ghana': 'photography',
  'product-photography-ghana': 'photography',
};

const EMPTY_FORM = {
  name: '',
  company: '',
  email: '',
  phone: '',
  projectType: '',
  message: '',
  preferredDate: '',
  location: '',
  budget: '',
  referralSource: '',
  website: '', // honeypot
};

const selectClass =
  'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500';

export default function ContactPageClient() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const type = params.get('type') || SERVICE_TO_PROJECT_TYPE[params.get('service') || ''];
    if (type && PROJECT_TYPES.some((t) => t.value === type)) {
      setFormData((prev) => ({ ...prev, projectType: type }));
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sourcePage: window.location.pathname + window.location.search }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send your enquiry');
      }
      setSuccess(true);
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again or reach us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  const contactItems = [
    { icon: Mail, title: 'Email', value: SITE.email, href: `mailto:${SITE.email}`, note: 'We reply within one business day' },
    { icon: Phone, title: 'Phone', value: SITE.phoneDisplay, href: `tel:${SITE.phoneE164}` },
    { icon: MessageCircle, title: 'WhatsApp', value: 'Chat with us', href: SITE.whatsappUrl, external: true },
    { icon: MapPin, title: 'Studio', value: SITE.location, note: 'We travel across Ghana and beyond' },
    { icon: Clock, title: 'Business Hours', value: SITE.hours },
  ];

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-navy-900 py-16 text-white md:py-24">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-gold-300">Start a Project</p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">Tell us what you&rsquo;re building.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Commercials, corporate films, live productions, social content, events or photography — share a few details and
            we&rsquo;ll come back with ideas, availability and a quote.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 sm:px-6 lg:grid-cols-5 lg:px-8">
          {/* Direct contact */}
          <motion.aside variants={sectionVariants} initial="hidden" animate="visible" className="space-y-4 lg:col-span-2">
            {contactItems.map((info, index) => {
              const content = (
                <MotionCard index={index} lift={3} accent={!!info.href} className="rounded-xl border border-gray-200 bg-white">
                  <div className="flex items-start gap-3 p-5">
                    <div className="rounded-full bg-gold-50 p-2 transition-all duration-500 group-hover:scale-110 group-hover:bg-gold-500">
                      <info.icon className="h-5 w-5 text-gold-600 transition-colors duration-500 group-hover:text-white" />
                    </div>
                    <div>
                      <h2 className="text-base font-semibold text-navy-900">{info.title}</h2>
                      <p className="text-sm text-gray-700">{info.value}</p>
                      {info.note && <p className="text-xs text-gray-500">{info.note}</p>}
                    </div>
                  </div>
                </MotionCard>
              );
              return info.href ? (
                <a
                  key={info.title}
                  href={info.href}
                  className="block"
                  {...(info.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                >
                  {content}
                </a>
              ) : (
                <div key={info.title}>{content}</div>
              );
            })}
          </motion.aside>

          {/* Enquiry form */}
          <motion.div id="contact-form" variants={sectionVariants} initial="hidden" animate="visible" className="lg:col-span-3">
            <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
              {success ? (
                <div className="py-10 text-center" role="status">
                  <div className="mx-auto mb-4 w-fit rounded-full bg-gold-100 p-3">
                    <Send className="h-6 w-6 text-gold-600" />
                  </div>
                  <h2 className="mb-2 text-xl font-semibold text-navy-900">Thanks — we&rsquo;ve got your brief.</h2>
                  <p className="mb-6 text-sm text-gray-600">
                    A confirmation is on its way to your inbox. We&rsquo;ll be in touch within one business day.
                  </p>
                  <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-full">
                    Send another enquiry
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5" noValidate={false}>
                  {/* Honeypot — hidden from people and assistive tech */}
                  <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                    <label htmlFor="website">Website</label>
                    <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                  </div>

                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <div>
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required autoComplete="name" />
                    </div>
                    <div>
                      <Label htmlFor="company">Company / Organisation</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} autoComplete="organization" />
                    </div>
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="email" />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone / WhatsApp *</Label>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required autoComplete="tel" placeholder="+233…" />
                    </div>
                    <div>
                      <Label htmlFor="projectType">Project type *</Label>
                      <select id="projectType" name="projectType" value={formData.projectType} onChange={handleChange} required className={selectClass}>
                        <option value="" disabled>Select a project type</option>
                        {PROJECT_TYPES.map((t) => (
                          <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="budget">Estimated budget</Label>
                      <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={selectClass}>
                        <option value="">Prefer not to say</option>
                        {BUDGET_RANGES.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label htmlFor="preferredDate">Preferred date</Label>
                      <Input id="preferredDate" name="preferredDate" type="date" value={formData.preferredDate} onChange={handleChange} />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input id="location" name="location" value={formData.location} onChange={handleChange} placeholder="e.g. East Legon, Accra" />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="message">Project description *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      required
                      rows={5}
                      placeholder="What do you need, who is it for, and where will it be used?"
                    />
                  </div>

                  <div>
                    <Label htmlFor="referralSource">How did you hear about us?</Label>
                    <select id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleChange} className={selectClass}>
                      <option value="">Select an option</option>
                      {REFERRAL_SOURCES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>

                  {error && (
                    <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-700">
                      {error}
                    </p>
                  )}

                  <Button
                    type="submit"
                    className="w-full rounded-full bg-gold-600 py-6 text-sm font-semibold uppercase tracking-wider text-white hover:bg-gold-700"
                    disabled={loading}
                  >
                    {loading ? 'Sending…' : (<><Send className="mr-2 h-4 w-4" /> Tell us what you&rsquo;re building</>)}
                  </Button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Areas We Serve */}
      <section className="border-t border-gray-100 bg-gray-50 py-12">
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="mb-4 font-serif text-2xl font-bold text-navy-900 md:text-3xl">Areas We Serve</h2>
          <p className="mx-auto mb-6 max-w-3xl text-gray-600">
            We&apos;re based in Lapaz, Accra, and travel across Greater Accra for every shoot —
            including East Legon, Cantonments, Airport Residential Area, Osu, Labone, Dzorwulu,
            Roman Ridge, Ridge, Kaneshie, Dansoman, Achimota, Madina, Adenta, Spintex, Tema,
            Teshie, Nungua, Labadi, and Kasoa. We also travel for productions in Kumasi,
            Takoradi, Cape Coast, Tamale, and beyond, plus projects across Ghana, West Africa,
            and the diaspora.
          </p>
        </div>
      </section>
    </Layout>
  );
}
