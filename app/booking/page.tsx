'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Upload, MapPin, Calendar, Clock, CheckCircle } from 'lucide-react';

interface RateCard {
  id?: string;
  category: string;
  serviceName: string;
  description: string;
  price: string;
  duration?: string;
  includes: string[];
  featured: boolean;
  order: number;
}

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

// Animation variants for hero content
const heroContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, type: 'spring', stiffness: 140, damping: 20 },
  },
};

// Animation variants for hero words
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.07, ease: 'easeOut' },
  }),
};

// Animation variants for form elements
const formElementVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: (index: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, delay: index * 0.08, ease: 'easeOut' },
  }),
};

// Animation variants for success/error messages
const messageVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, type: 'spring', stiffness: 120, damping: 20 },
  },
};

export default function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, firebaseUser, userProfile } = useAuth();
  const [formData, setFormData] = useState({
    serviceCategory: '',
    date: '',
    startTime: '',
    endTime: '',
    address: '',
    additionalNotes: '',
    serviceName: '', // Added to store rate card serviceName
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedRateCard, setSelectedRateCard] = useState<RateCard | null>(null);

  useEffect(() => {
    fetchCategories();
    const rateCardId = searchParams.get('rateCardId');
    const category = searchParams.get('category');
    if (rateCardId) {
      fetchRateCard(rateCardId);
    }
    if (category) {
      setFormData((prev) => ({ ...prev, serviceCategory: decodeURIComponent(category) }));
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/rate-cards');
      if (response.ok) {
        const data = await response.json() as RateCard[];
        const uniqueCategories = Array.from(new Set(data.map((card) => card.category)));
        setCategories(uniqueCategories);
        console.log('Categories loaded:', uniqueCategories);
      } else {
        console.error('Failed to fetch categories:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchRateCard = async (rateCardId: string) => {
    try {
      const response = await fetch('/api/rate-cards');
      if (response.ok) {
        const data = await response.json() as RateCard[];
        const rateCard = data.find((card) => card.id === rateCardId || card.serviceName === decodeURIComponent(rateCardId));
        if (rateCard) {
          setSelectedRateCard(rateCard);
          setFormData((prev) => ({
            ...prev,
            serviceCategory: rateCard.category,
            serviceName: rateCard.serviceName,
            additionalNotes: `Selected Package: ${rateCard.serviceName}\nPrice: ${rateCard.price}\nIncludes:\n${rateCard.includes.map((item) => `- ${item}`).join('\n')}`,
          }));
        }
      } else {
        console.error('Failed to fetch rate card:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching rate card:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      serviceCategory: value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setAttachments(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      router.push('/auth/login');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const token = await firebaseUser?.getIdToken();
      if (!token) {
        throw new Error('Authentication token not available');
      }

      const bookingData = {
        ...formData,
        userName: userProfile?.displayName || user.displayName || 'User',
        userEmail: user.email,
      };

      const response = await fetch('/api/bookings/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to create booking');
      }

      setSuccess(true);
      setFormData({
        serviceCategory: '',
        date: '',
        startTime: '',
        endTime: '',
        address: '',
        additionalNotes: '',
        serviceName: '',
      });
      setAttachments([]);
      setTimeout(() => {
        router.push('/bookings');
      }, 2000);
    } catch (error: any) {
      setError(error.message || 'An error occurred while creating the booking');
    } finally {
      setLoading(false);
    }
  };

  // Split the heading text for animation
  const headingText = 'Book Your Session'.split(' ');

  if (!user) {
    return (
      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="min-h-screen flex items-center justify-center"
        >
          <Card className="max-w-md mx-auto bg-teal-50 border-coral-100 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-teal-900">Please Sign In</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                You need to be signed in to book a session.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button
                  onClick={() => router.push('/auth/login')}
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-full"
                >
                  Sign In
                </Button>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="min-h-screen flex items-center justify-center"
        >
          <Card className="max-w-md mx-auto bg-teal-50 border-coral-100 rounded-xl shadow-sm text-center">
            <CardContent className="p-6">
              <motion.div
                variants={messageVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="mx-auto mb-3 p-2 bg-coral-50 rounded-full w-fit">
                  <CheckCircle className="h-6 w-6 text-coral-500" />
                </div>
                <h2 className="text-xl font-bold text-teal-900 mb-2">Booking Submitted!</h2>
                <p className="text-sm text-gray-600 mb-3">
                  Thank you for your booking request. We'll respond within 24 hours.
                </p>
                <p className="text-xs text-gray-500">
                  Redirecting to your bookings...
                </p>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[30vh] flex items-center justify-center bg-teal-50"
      >
        <motion.div
          variants={heroContentVariants}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1 className="text-2xl md:text-3xl font-bold text-teal-900 mb-3">
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
            className="text-sm md:text-base text-gray-600 max-w-lg mx-auto"
          >
            Schedule your photography or videography session with ease.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Form Section */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="max-w-3xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      >
        <Card className="bg-teal-50 border-coral-100 rounded-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-teal-900">Book a Session</CardTitle>
            <CardDescription className="text-sm text-gray-600">
              Share your project details, and we'll provide a personalized quote.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Service Category */}
              <motion.div
                custom={0}
                variants={formElementVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2"
              >
                <Label htmlFor="serviceCategory" className="text-sm text-teal-900">
                  Service Type
                </Label>
                <Select onValueChange={handleSelectChange} value={formData.serviceCategory}>
                  <SelectTrigger className="border-coral-200 focus:ring-teal-500 rounded-md">
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </motion.div>

              {/* Service Name (Read-only if pre-filled) */}
              {formData.serviceName && (
                <motion.div
                  custom={1}
                  variants={formElementVariants}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  className="space-y-2"
                >
                  <Label htmlFor="serviceName" className="text-sm text-teal-900">
                    Selected Package
                  </Label>
                  <Input
                    id="serviceName"
                    name="serviceName"
                    value={formData.serviceName}
                    readOnly
                    className="border-coral-200 bg-gray-100 rounded-md text-sm"
                  />
                </motion.div>
              )}

              {/* Date and Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  {
                    id: 'date',
                    label: 'Date',
                    type: 'date',
                    icon: Calendar,
                    value: formData.date,
                    required: true,
                  },
                  {
                    id: 'startTime',
                    label: 'Start Time',
                    type: 'time',
                    icon: Clock,
                    value: formData.startTime,
                    required: true,
                  },
                  {
                    id: 'endTime',
                    label: 'End Time',
                    type: 'time',
                    icon: Clock,
                    value: formData.endTime,
                    required: true,
                  },
                ].map((field, index) => (
                  <motion.div
                    key={field.id}
                    custom={index + 2}
                    variants={formElementVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="space-y-2"
                  >
                    <Label htmlFor={field.id} className="text-sm text-teal-900 flex items-center">
                      <field.icon className="h-4 w-4 mr-1 text-coral-500" />
                      {field.label}
                    </Label>
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={handleChange}
                      min={field.type === 'date' ? new Date().toISOString().split('T')[0] : undefined}
                      required={field.required}
                      className="border-coral-200 focus:ring-teal-500 rounded-md text-sm"
                    />
                  </motion.div>
                ))}
              </div>

              {/* Location */}
              <motion.div
                custom={5}
                variants={formElementVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2"
              >
                <Label htmlFor="address" className="text-sm text-teal-900 flex items-center">
                  <MapPin className="h-4 w-4 mr-1 text-coral-500" />
                  Location Address
                </Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter the session location"
                  required
                  className="border-coral-200 focus:ring-teal-500 rounded-md text-sm"
                />
              </motion.div>

              {/* Additional Notes */}
              <motion.div
                custom={6}
                variants={formElementVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2"
              >
                <Label htmlFor="additionalNotes" className="text-sm text-teal-900">
                  Additional Notes
                </Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Share your project details, special requests, or creative vision..."
                  rows={6}
                  className="border-coral-200 focus:ring-teal-500 rounded-md text-sm"
                />
              </motion.div>

              {/* File Attachments */}
              <motion.div
                custom={7}
                variants={formElementVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                className="space-y-2"
              >
                <Label htmlFor="attachments" className="text-sm text-teal-900 flex items-center">
                  <Upload className="h-4 w-4 mr-1 text-coral-500" />
                  Reference Images (Optional)
                </Label>
                <Input
                  id="attachments"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-coral-50 file:text-coral-500 hover:file:bg-coral-100 text-sm"
                />
                <p className="text-xs text-gray-500">
                  Upload inspiration images or examples
                </p>
                {attachments.length > 0 && (
                  <div className="mt-2">
                    <p className="text-xs text-gray-600">
                      {attachments.length} file(s) selected:
                    </p>
                    <ul className="text-xs text-gray-500 mt-1">
                      {attachments.map((file, index) => (
                        <li key={index} className="truncate">
                          {file.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </motion.div>

              {error && (
                <motion.div
                  variants={messageVariants}
                  initial="hidden"
                  animate="visible"
                  className="text-coral-600 text-xs bg-coral-50 p-2 rounded-md border border-coral-200"
                >
                  {error}
                </motion.div>
              )}

              <motion.div
                custom={8}
                variants={formElementVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
              >
                <Button
                  type="submit"
                  className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-full text-sm py-2"
                  disabled={loading || !formData.serviceCategory || !formData.date || !formData.startTime || !formData.endTime || !formData.address}
                >
                  {loading ? 'Submitting Booking...' : 'Submit Booking Request'}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </Layout>
  );
}