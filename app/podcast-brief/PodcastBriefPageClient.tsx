'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Send, Mic } from 'lucide-react';
import { BUDGET_RANGES } from '@/lib/site-config';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const VIBE_OPTIONS = ['Professional', 'Casual', 'Luxury', 'Fun', 'Educational'];
const PROVIDE_OPTIONS = [
  'Microphones',
  'Cameras & Lighting',
  'Set Design / Background',
  'Podcast Cover Art / Thumbnails',
  'Video Editing',
  'Audio Cleanup',
];
const PLATFORM_OPTIONS = ['YouTube', 'Spotify', 'Instagram', 'Apple Podcasts', 'TikTok', 'Other'];

const EMPTY_FORM = {
  clientName: '',
  phone: '',
  email: '',
  socialHandle: '',
  shootLocation: '',
  podcastName: '',
  concept: '',
  targetAudience: '',
  donePodcastBefore: '',
  episodeCount: '',
  format: '',
  vibe: [] as string[],
  hostCount: '',
  maxGuests: '',
  episodesPerDay: '',
  episodeDuration: '',
  shootFrequency: '',
  provideServices: [] as string[],
  proposedDateTime: '',
  publishPlatforms: [] as string[],
  referenceLink: '',
  budget: '',
  notes: '',
  website: '', // honeypot
};

const selectClass =
  'flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500';

function Field({ label, htmlFor, required, children }: { label: string; htmlFor?: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <Label htmlFor={htmlFor}>
        {label} {required && <span className="text-gold-600">*</span>}
      </Label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

function CheckboxGroup({ options, selected, onToggle }: { options: string[]; selected: string[]; onToggle: (opt: string) => void }) {
  return (
    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
      {options.map((opt) => (
        <label key={opt} className="flex cursor-pointer items-center gap-2.5 text-sm text-gray-700">
          <Checkbox checked={selected.includes(opt)} onCheckedChange={() => onToggle(opt)} />
          {opt}
        </label>
      ))}
    </div>
  );
}

export default function PodcastBriefPageClient() {
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const set = (name: string, value: any) => setFormData((prev) => ({ ...prev, [name]: value }));
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => set(e.target.name, e.target.value);
  const toggleInList = (name: 'vibe' | 'provideServices' | 'publishPlatforms', opt: string) =>
    setFormData((prev) => ({
      ...prev,
      [name]: prev[name].includes(opt) ? prev[name].filter((v) => v !== opt) : [...prev[name], opt],
    }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/podcast-brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, sourcePage: window.location.pathname }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send your brief');
      }
      setSuccess(true);
      setFormData(EMPTY_FORM);
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again or reach us on WhatsApp.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-navy-900 py-16 text-white md:py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <div className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-gold-500/20">
            <Mic className="h-6 w-6 text-gold-300" />
          </div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.15em] text-gold-300">Podcast Shoot Brief</p>
          <h1 className="font-serif text-4xl font-bold md:text-5xl">Let&rsquo;s plan your podcast.</h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-white/80">
            Thanks for reaching out! Fill this in so we can tailor the setup, team and budget perfectly for your podcast.
          </p>
        </div>
      </section>

      <section className="bg-white py-12 md:py-16">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
            {success ? (
              <div className="py-10 text-center" role="status">
                <div className="mx-auto mb-4 w-fit rounded-full bg-gold-100 p-3">
                  <Send className="h-6 w-6 text-gold-600" />
                </div>
                <h2 className="mb-2 text-xl font-semibold text-navy-900">Thanks — we&rsquo;ve got your brief.</h2>
                <p className="mb-6 text-sm text-gray-600">
                  A confirmation is on its way to your inbox. We&rsquo;ll be in touch within one business day with a tailored
                  setup and quote.
                </p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="rounded-full">
                  Submit another brief
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-10">
                {/* Honeypot */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
                  <label htmlFor="website">Website</label>
                  <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" value={formData.website} onChange={handleChange} />
                </div>

                {/* Section 1 */}
                <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5">
                  <h2 className="font-serif text-xl font-bold text-navy-900">1. Client Info</h2>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="Full Name / Brand Name" htmlFor="clientName" required>
                      <Input id="clientName" name="clientName" value={formData.clientName} onChange={handleChange} required />
                    </Field>
                    <Field label="Phone Number / WhatsApp" htmlFor="phone" required>
                      <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} required placeholder="+233…" />
                    </Field>
                    <Field label="Email" htmlFor="email" required>
                      <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required />
                    </Field>
                    <Field label="Instagram / Social Handle" htmlFor="socialHandle">
                      <Input id="socialHandle" name="socialHandle" value={formData.socialHandle} onChange={handleChange} placeholder="@yourhandle" />
                    </Field>
                  </div>
                  <Field label="Where will the shoot happen?">
                    <RadioGroup value={formData.shootLocation} onValueChange={(v) => set('shootLocation', v)} className="grid-flow-col auto-cols-max gap-6">
                      {['Your studio', 'Our studio', 'Outdoor'].map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                          <RadioGroupItem value={opt} id={`loc-${opt}`} />
                          {opt}
                        </label>
                      ))}
                    </RadioGroup>
                  </Field>
                </motion.div>

                {/* Section 2 */}
                <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5 border-t border-gray-200 pt-8">
                  <h2 className="font-serif text-xl font-bold text-navy-900">2. Podcast Concept</h2>
                  <Field label="What is the name of your podcast?" htmlFor="podcastName" required>
                    <Input id="podcastName" name="podcastName" value={formData.podcastName} onChange={handleChange} required />
                  </Field>
                  <Field label="What is the podcast about? (2-3 sentences)" htmlFor="concept" required>
                    <Textarea id="concept" name="concept" rows={3} value={formData.concept} onChange={handleChange} required />
                  </Field>
                  <Field label="Who is your target audience?" htmlFor="targetAudience">
                    <Input id="targetAudience" name="targetAudience" value={formData.targetAudience} onChange={handleChange} />
                  </Field>
                  <Field label="Have you done this podcast before?">
                    <RadioGroup value={formData.donePodcastBefore} onValueChange={(v) => set('donePodcastBefore', v)} className="gap-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                        <RadioGroupItem value="no" id="done-no" />
                        No — this is the first time
                      </label>
                      <label className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                        <RadioGroupItem value="yes" id="done-yes" />
                        Yes
                      </label>
                      {formData.donePodcastBefore === 'yes' && (
                        <Input
                          name="episodeCount"
                          value={formData.episodeCount}
                          onChange={handleChange}
                          placeholder="How many episodes so far?"
                          className="ml-6 max-w-xs"
                        />
                      )}
                    </RadioGroup>
                  </Field>
                  <Field label="Video + Audio or Audio only?">
                    <RadioGroup value={formData.format} onValueChange={(v) => set('format', v)} className="grid-flow-col auto-cols-max gap-6">
                      {['Video + Audio', 'Audio only'].map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                          <RadioGroupItem value={opt} id={`fmt-${opt}`} />
                          {opt}
                        </label>
                      ))}
                    </RadioGroup>
                  </Field>
                  <Field label="What vibe are you going for? (select all that fit)">
                    <CheckboxGroup options={VIBE_OPTIONS} selected={formData.vibe} onToggle={(opt) => toggleInList('vibe', opt)} />
                  </Field>
                </motion.div>

                {/* Section 3 */}
                <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5 border-t border-gray-200 pt-8">
                  <h2 className="font-serif text-xl font-bold text-navy-900">3. Production Details</h2>
                  <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                    <Field label="How many hosts?" htmlFor="hostCount">
                      <Input id="hostCount" name="hostCount" type="number" min="0" value={formData.hostCount} onChange={handleChange} />
                    </Field>
                    <Field label="Max guests per episode" htmlFor="maxGuests">
                      <Input id="maxGuests" name="maxGuests" type="number" min="0" value={formData.maxGuests} onChange={handleChange} />
                    </Field>
                    <Field label="Episodes to shoot that day" htmlFor="episodesPerDay">
                      <Input id="episodesPerDay" name="episodesPerDay" type="number" min="0" value={formData.episodesPerDay} onChange={handleChange} />
                    </Field>
                    <Field label="Expected duration per episode" htmlFor="episodeDuration">
                      <Input id="episodeDuration" name="episodeDuration" value={formData.episodeDuration} onChange={handleChange} placeholder="e.g. 60 mins" />
                    </Field>
                  </div>
                  <Field label="How often will you be shooting?">
                    <RadioGroup value={formData.shootFrequency} onValueChange={(v) => set('shootFrequency', v)} className="grid-flow-col auto-cols-max gap-6">
                      {['One-time', 'Weekly', 'Monthly'].map((opt) => (
                        <label key={opt} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                          <RadioGroupItem value={opt} id={`freq-${opt}`} />
                          {opt}
                        </label>
                      ))}
                    </RadioGroup>
                  </Field>
                  <Field label="What should we provide? (tick all that apply)">
                    <CheckboxGroup options={PROVIDE_OPTIONS} selected={formData.provideServices} onToggle={(opt) => toggleInList('provideServices', opt)} />
                  </Field>
                </motion.div>

                {/* Section 4 */}
                <motion.div variants={sectionVariants} initial="hidden" animate="visible" className="space-y-5 border-t border-gray-200 pt-8">
                  <h2 className="font-serif text-xl font-bold text-navy-900">4. Logistics &amp; Budget</h2>
                  <Field label="Proposed date and time for shoot" htmlFor="proposedDateTime">
                    <Input
                      id="proposedDateTime"
                      name="proposedDateTime"
                      value={formData.proposedDateTime}
                      onChange={handleChange}
                      placeholder="e.g. 14 Nov, 10am"
                    />
                  </Field>
                  <Field label="Where will the final podcast be posted?">
                    <CheckboxGroup options={PLATFORM_OPTIONS} selected={formData.publishPlatforms} onToggle={(opt) => toggleInList('publishPlatforms', opt)} />
                  </Field>
                  <Field label="Reference video/podcast you like (paste link)" htmlFor="referenceLink">
                    <Input id="referenceLink" name="referenceLink" value={formData.referenceLink} onChange={handleChange} placeholder="https://…" />
                  </Field>
                  <Field label="Budget range for this project" htmlFor="budget">
                    <select id="budget" name="budget" value={formData.budget} onChange={handleChange} className={selectClass}>
                      <option value="">Prefer not to say</option>
                      {BUDGET_RANGES.map((b) => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Anything else we should know?" htmlFor="notes">
                    <Textarea id="notes" name="notes" rows={4} value={formData.notes} onChange={handleChange} />
                  </Field>
                </motion.div>

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
                  {loading ? 'Sending…' : (<><Send className="mr-2 h-4 w-4" /> Send our brief</>)}
                </Button>
              </form>
            )}
          </div>
        </div>
      </section>
    </Layout>
  );
}
