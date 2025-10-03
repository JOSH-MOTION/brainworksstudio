'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import Link from 'next/link';

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeInOut', staggerChildren: 0.2 },
  },
};

// Animation variants for hero content
const heroContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, type: 'spring', stiffness: 100, damping: 15 },
  },
};

// Animation variants for hero children (text and button)
const heroChildVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, delay: i * 0.2, ease: 'easeOut' },
  }),
};

// Animation variants for hero text characters
const textVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.05, ease: 'easeOut' },
  }),
};

// Animation variants for contact info cards
const infoCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8, rotateX: 20 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    rotateX: 0,
    transition: { duration: 0.8, delay: i * 0.15, type: 'spring', stiffness: 90 },
  }),
  hover: {
    scale: 1.05,
    y: -10,
    transition: { duration: 0.4, type: 'spring', stiffness: 130 },
  },
};

// Animation variants for form elements
const formElementVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// Animation variants for success message
const successVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.8, type: 'spring', stiffness: 100, damping: 15 },
  },
};

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: '',
      });
    } catch (error: any) {
      setError(error.message || 'An error occurred while sending your message');
    } finally {
      setLoading(false);
    }
  };

  // Split the heading text for character-by-character animation
  const headingText = "Let's Create Together".split('');

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[60vh] flex items-center justify-center bg-teal-900 text-white"
      >
        {/* Hero Content */}
        <motion.div
          variants={heroContentVariants}
          className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10"
        >
          <motion.h1
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 text-white"
          >
            {headingText.map((char, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={textVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            custom={0}
            variants={heroChildVariants}
            className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gold-100 drop-shadow-md"
          >
            Ready to bring your vision to life? Contact us to discuss your project and start crafting unforgettable visuals.
          </motion.p>
          <motion.div custom={1} variants={heroChildVariants}>
            <Link href="#contact-form">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="lg"
                  className="bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold shadow-md"
                >
                  Get Started
                </Button>
              </motion.div>
            </Link>
          </motion.div>
        </motion.div>
      </motion.section>

      {/* Contact Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="py-24 bg-navy-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-6">
              {[
                {
                  icon: Mail,
                  title: 'Email',
                  value: 'hello@brainworksstudio2.com',
                  note: 'Response within 24 hours',
                },
                {
                  icon: Phone,
                  title: 'Phone',
                  value: '+233 242403450',
                  note: 'Mon-Fri, 9am-6pm EST',
                },
                {
                  icon: MapPin,
                  title: 'Location',
                  value: 'Your City, State',
                  note: 'We travel to your location',
                },
                {
                  icon: Clock,
                  title: 'Business Hours',
                  value: 'Mon-Fri: 9am-6pm\nWeekend: By appointment',
                },
              ].map((info, index) => (
                <motion.div
                  key={info.title}
                  custom={index}
                  variants={infoCardVariants}
                  whileHover="hover"
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                >
                  <div className="bg-white rounded-xl shadow-md p-6 flex items-start gap-4 hover:bg-navy-100 transition-colors">
                    <motion.div
                      className="p-2 bg-gold-100 rounded-full"
                      whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                    >
                      <info.icon className="h-6 w-6 text-gold-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-navy-900">{info.title}</h3>
                      <p className="text-gray-600 whitespace-pre-line">{info.value}</p>
                      <p className="text-sm text-gray-500">{info.note}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
              {/* Emergency Contact */}
              <motion.div
                custom={4}
                variants={infoCardVariants}
                whileHover="hover"
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                  <h3 className="font-semibold text-navy-900 mb-2">Urgent Project?</h3>
                  <p className="text-sm text-gray-600 mb-4">Call our priority line for time-sensitive bookings.</p>
                  <Button
                    variant="outline"
                    className="w-full border-gold-500 text-gold-500 hover:bg-gold-100"
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    +233 242403450
                  </Button>
                </div>
              </motion.div>
            </div>

            {/* Contact Form */}
            <motion.div
              id="contact-form"
              variants={sectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-2"
            >
              <div className="bg-white rounded-xl shadow-md p-6">
                {success ? (
                  <motion.div
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center py-8"
                  >
                    <motion.div
                      className="mx-auto mb-4 p-3 bg-gold-100 rounded-full w-fit"
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                      transition={{ duration: 1.5, repeat: 1 }}
                    >
                      <Send className="h-8 w-8 text-gold-500" />
                    </motion.div>
                    <h3 className="text-xl font-semibold text-navy-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600">
                      Thank you for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        onClick={() => setSuccess(false)}
                        variant="outline"
                        className="mt-4 border-gold-500 text-gold-500 hover:bg-gold-100"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { id: 'name', label: 'Name *', type: 'text', placeholder: 'Your full name', required: true },
                        { id: 'email', label: 'Email *', type: 'email', placeholder: 'your@email.com', required: true },
                        { id: 'phone', label: 'Phone', type: 'tel', placeholder: '+233 242403450', required: false },
                        { id: 'subject', label: 'Subject *', type: 'text', placeholder: 'What can we help you with?', required: true },
                      ].map((field, index) => (
                        <motion.div
                          key={field.id}
                          custom={index}
                          variants={formElementVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                        >
                          <Label htmlFor={field.id} className="text-navy-900">{field.label}</Label>
                          <Input
                            id={field.id}
                            name={field.id}
                            type={field.type}
                            value={formData[field.id as keyof typeof formData]}
                            onChange={handleChange}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
                          />
                        </motion.div>
                      ))}
                    </div>
                    <motion.div
                      custom={4}
                      variants={formElementVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Label htmlFor="message" className="text-navy-900">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                        rows={6}
                        className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
                      />
                    </motion.div>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-red-600 text-sm bg-red-50 p-3 rounded-md"
                      >
                        {error}
                      </motion.div>
                    )}
                    <motion.div
                      custom={5}
                      variants={formElementVariants}
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                    >
                      <Button
                        type="submit"
                        className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400 py-6 text-lg font-semibold"
                        disabled={loading}
                      >
                        {loading ? (
                          'Sending Message...'
                        ) : (
                          <>
                            <Send className="h-5 w-5 mr-2" />
                            Send Message
                          </>
                        )}
                      </Button>
                    </motion.div>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}