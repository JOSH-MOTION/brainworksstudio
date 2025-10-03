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
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: 'easeOut', staggerChildren: 0.15 },
  },
};

// Animation variants for hero content
const heroContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, type: 'spring', stiffness: 120, damping: 20 },
  },
};

// Animation variants for hero words
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
  }),
};

// Animation variants for contact info cards
const infoCardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9, y: 20 },
  visible: (index: number) => ({
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.6, delay: index * 0.1, type: 'spring', stiffness: 100 },
  }),
  hover: {
    scale: 1.03,
    y: -5,
    transition: { duration: 0.3, type: 'spring', stiffness: 150 },
  },
};

// Animation variants for form elements
const formElementVariants: Variants = {
  hidden: { opacity: 0, x: -15 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, delay: index * 0.1, ease: 'easeOut' },
  }),
};

// Animation variants for success message
const successVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, type: 'spring', stiffness: 110, damping: 20 },
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

  // Split the heading text into words for animation
  const headingText = 'Connect With Us'.split(' ');

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[40vh] flex items-center justify-center bg-teal-50"
      >
        <motion.div
          variants={heroContentVariants}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1 className="text-3xl md:text-4xl font-bold text-teal-900 mb-4">
            {headingText.map((word, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            custom={0}
            variants={wordVariants}
            className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-6"
          >
            Let's collaborate to capture your vision. Reach out today!
          </motion.p>
          <motion.div custom={1} variants={wordVariants}>
            <Link href="#contact-form">
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <Button
                  size="lg"
                  className="bg-coral-500 text-white hover:bg-coral-600 font-semibold py-2 px-6 rounded-full"
                >
                  Contact Us
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
        className="py-12 bg-white"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
            {/* Contact Information */}
            <div className="lg:col-span-2 space-y-4">
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
                  <div className="bg-teal-50 rounded-xl shadow-sm p-5 flex items-start gap-3 hover:bg-teal-100 transition-colors border border-coral-100">
                    <motion.div
                      className="p-2 bg-coral-50 rounded-full"
                      whileHover={{ scale: 1.1, transition: { duration: 0.3 } }}
                    >
                      <info.icon className="h-5 w-5 text-coral-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-semibold text-teal-900 text-base">{info.title}</h3>
                      <p className="text-gray-600 text-sm">{info.value}</p>
                      <p className="text-xs text-gray-500">{info.note}</p>
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
                <div className="bg-teal-50 rounded-xl shadow-sm p-5 text-center border border-coral-100">
                  <h3 className="font-semibold text-teal-900 text-base mb-2">Urgent Project?</h3>
                  <p className="text-xs text-gray-600 mb-3">Reach out for time-sensitive bookings.</p>
                  <Button
                    variant="outline"
                    className="w-full border-coral-500 text-coral-500 hover:bg-coral-50 rounded-full text-sm py-1"
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
              className="lg:col-span-3"
            >
              <div className="bg-teal-50 rounded-xl shadow-sm p-6 border border-coral-100">
                {success ? (
                  <motion.div
                    variants={successVariants}
                    initial="hidden"
                    animate="visible"
                    className="text-center py-8"
                  >
                    <motion.div
                      className="mx-auto mb-4 p-3 bg-coral-50 rounded-full w-fit"
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 1, repeat: 1 }}
                    >
                      <Send className="h-6 w-6 text-coral-500" />
                    </motion.div>
                    <h3 className="text-lg font-semibold text-teal-900 mb-2">Message Sent!</h3>
                    <p className="text-gray-600 text-sm mb-4">
                      We've received your message and will respond soon.
                    </p>
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Button
                        onClick={() => setSuccess(false)}
                        variant="outline"
                        className="border-coral-500 text-coral-500 hover:bg-coral-50 rounded-full text-sm py-1"
                      >
                        Send Another Message
                      </Button>
                    </motion.div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
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
                          <Label htmlFor={field.id} className="text-teal-900 font-medium text-sm">{field.label}</Label>
                          <Input
                            id={field.id}
                            name={field.id}
                            type={field.type}
                            value={formData[field.id as keyof typeof formData]}
                            onChange={handleChange}
                            required={field.required}
                            placeholder={field.placeholder}
                            className="border-coral-200 focus:ring-teal-500 focus:border-teal-500 rounded-md text-sm"
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
                      <Label htmlFor="message" className="text-teal-900 font-medium text-sm">Message *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        placeholder="Tell us about your project, timeline, or requirements..."
                        rows={5}
                        className="border-coral-200 focus:ring-teal-500 focus:border-teal-500 rounded-md text-sm"
                      />
                    </motion.div>
                    {error && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-coral-600 text-xs bg-coral-50 p-2 rounded-md"
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
                        className="w-full bg-teal-500 text-white hover:bg-teal-600 py-2 text-sm font-semibold rounded-full"
                        disabled={loading}
                      >
                        {loading ? (
                          'Sending Message...'
                        ) : (
                          <>
                            <Send className="h-4 w-4 mr-2" />
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