'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock, Send } from 'lucide-react';

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

  return (
    <Layout>
      {/* Header Section */}
      <motion.header
        className="bg-cover bg-center h-80 flex flex-col justify-end pb-8 relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(/images/contact-hero-bg.jpg)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white">
          <motion.p
            className="text-sm uppercase tracking-wider font-semibold text-amber-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            Contact &gt; Reach Out
          </motion.p>
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Get in Touch
          </motion.h1>
        </div>
      </motion.header>

      {/* Main Content Section */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-320px)] py-12 px-4 sm:px-6 lg:px-8">
        <motion.div
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-xl rounded-2xl border-none">
                  <CardHeader>
                    <CardTitle>Contact Information</CardTitle>
                    <CardDescription>Reach out to us through any of these channels</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <motion.div
                      className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                    >
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Mail className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Email</h3>
                        <p className="text-gray-600">hello@brainworksstudio2.com</p>
                        <p className="text-sm text-gray-500">We'll respond within 24 hours</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.2 }}
                    >
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Phone className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Phone</h3>
                        <p className="text-gray-600">+233 242403450</p>
                        <p className="text-sm text-gray-500">Mon-Fri, 9am-6pm EST</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 }}
                    >
                      <div className="p-2 bg-amber-100 rounded-full">
                        <MapPin className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Location</h3>
                        <p className="text-gray-600">Your City, State</p>
                        <p className="text-sm text-gray-500">We travel to your location</p>
                      </div>
                    </motion.div>

                    <motion.div
                      className="flex items-start gap-3 hover:bg-gray-50 p-2 rounded-md transition-colors"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.4 }}
                    >
                      <div className="p-2 bg-amber-100 rounded-full">
                        <Clock className="h-5 w-5 text-amber-700" />
                      </div>
                      <div>
                        <h3 className="font-medium">Business Hours</h3>
                        <p className="text-gray-600">Monday - Friday: 9am - 6pm</p>
                        <p className="text-gray-600">Weekend: By appointment</p>
                      </div>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Emergency Contact */}
              <motion.div
                className="mt-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.5 }}
              >
                <Card className="shadow-xl rounded-2xl border-none">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold mb-2">Have an urgent project?</h3>
                    <p className="text-sm text-gray-600 mb-4">
                      For time-sensitive bookings or emergency shoots, call our priority line
                    </p>
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button variant="outline" className="w-full bg-amber-50 hover:bg-amber-100 text-amber-700">
                        <Phone className="h-4 w-4 mr-2" />
                        +233 242403450
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
              >
                <Card className="shadow-xl rounded-2xl border-none">
                  <CardHeader>
                    <CardTitle>Send us a Message</CardTitle>
                    <CardDescription>
                      Fill out the form below and we'll get back to you as soon as possible
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {success ? (
                      <motion.div
                        className="text-center py-8"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.div
                          className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.3, delay: 0.2 }}
                        >
                          <Send className="h-8 w-8 text-green-600" />
                        </motion.div>
                        <motion.h3
                          className="text-xl font-semibold text-green-600 mb-2"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.4 }}
                        >
                          Message Sent!
                        </motion.h3>
                        <motion.p
                          className="text-gray-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          Thank you for reaching out. We'll get back to you within 24 hours.
                        </motion.p>
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3, delay: 0.8 }}
                        >
                          <Button
                            onClick={() => setSuccess(false)}
                            variant="outline"
                            className="mt-4 bg-amber-50 hover:bg-amber-100 text-amber-700"
                          >
                            Send Another Message
                          </Button>
                        </motion.div>
                      </motion.div>
                    ) : (
                      <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.1 }}
                          >
                            <Label htmlFor="name">Name *</Label>
                            <Input
                              id="name"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              required
                              placeholder="Your full name"
                              className="hover:bg-gray-50 transition-colors"
                            />
                          </motion.div>
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.2 }}
                          >
                            <Label htmlFor="email">Email *</Label>
                            <Input
                              id="email"
                              name="email"
                              type="email"
                              value={formData.email}
                              onChange={handleChange}
                              required
                              placeholder="your@email.com"
                              className="hover:bg-gray-50 transition-colors"
                            />
                          </motion.div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.3 }}
                          >
                            <Label htmlFor="phone">Phone</Label>
                            <Input
                              id="phone"
                              name="phone"
                              type="tel"
                              value={formData.phone}
                              onChange={handleChange}
                              placeholder="+233 242403450"
                              className="hover:bg-gray-50 transition-colors"
                            />
                          </motion.div>
                          <motion.div
                            className="space-y-2"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.4, delay: 0.4 }}
                          >
                            <Label htmlFor="subject">Subject *</Label>
                            <Input
                              id="subject"
                              name="subject"
                              value={formData.subject}
                              onChange={handleChange}
                              required
                              placeholder="What can we help you with?"
                              className="hover:bg-gray-50 transition-colors"
                            />
                          </motion.div>
                        </div>

                        <motion.div
                          className="space-y-2"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 }}
                        >
                          <Label htmlFor="message">Message *</Label>
                          <Textarea
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleChange}
                            required
                            placeholder="Tell us about your project, timeline, budget, and any specific requirements..."
                            rows={6}
                            className="hover:bg-gray-50 transition-colors"
                          />
                        </motion.div>

                        {error && (
                          <motion.div
                            className="text-red-600 text-sm bg-red-50 p-3 rounded-md border border-red-200"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          >
                            {error}
                          </motion.div>
                        )}

                        <motion.div
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Button
                            type="submit"
                            className="w-full bg-amber-700 hover:bg-amber-800 py-6 text-lg transition-colors"
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
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </Layout>
  );
}