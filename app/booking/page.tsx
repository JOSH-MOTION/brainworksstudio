'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Upload, MapPin, Calendar, Clock } from 'lucide-react';

export default function BookingPage() {
  const [formData, setFormData] = useState({
    serviceCategory: '',
    date: '',
    startTime: '',
    endTime: '',
    address: '',
    additionalNotes: '',
  });
  const [attachments, setAttachments] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const { user, firebaseUser, userProfile } = useAuth();
  const router = useRouter();

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

  if (!user) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-md mx-auto shadow-lg">
              <CardHeader>
                <CardTitle>Please Sign In</CardTitle>
                <CardDescription>You need to be signed in to book a session.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push('/auth/login')} className="w-full bg-amber-700 hover:bg-amber-800">
                  Sign In
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-md mx-auto text-center shadow-lg">
              <CardContent className="p-8">
                <motion.div
                  className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Calendar className="h-8 w-8 text-green-600" />
                </motion.div>
                <motion.h2
                  className="text-2xl font-bold mb-2 text-green-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  Booking Submitted!
                </motion.h2>
                <motion.p
                  className="text-gray-600 mb-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  Thank you for your booking request. We'll review it and get back to you within 24 hours.
                </motion.p>
                <motion.p
                  className="text-sm text-gray-500"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.8 }}
                >
                  Redirecting to your bookings...
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Header Section */}
      <motion.header
        className="bg-cover bg-center h-80 flex flex-col justify-end pb-8 relative"
        style={{
          backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7)), url(/images/booking-hero-bg.jpg)`,
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-white mb-[6rem]">
          <motion.p
            className="text-sm uppercase tracking-wider font-semibold text-amber-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
             &gt; Details
          </motion.p>
          <motion.h1
            className="text-4xl sm:text-5xl font-extrabold mt-1"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            Book a Session
          </motion.h1>
        </div>
      </motion.header>

      {/* Main Content Section */}
      <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-[calc(100vh-320px)] pb-12">
        <motion.div
          className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Card className="shadow-xl rounded-2xl border-none">
            <CardHeader>
              <CardTitle className="text-2xl">Session Details</CardTitle>
              <CardDescription>
                Tell us about your project and we'll get back to you with a personalized quote.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Service Category */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <Label htmlFor="serviceCategory">Service Type</Label>
                  <Select onValueChange={handleSelectChange} value={formData.serviceCategory}>
                    <SelectTrigger className="hover:bg-gray-50 transition-colors">
                      <SelectValue placeholder="Select a service" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Event">Event Photography</SelectItem>
                      <SelectItem value="Portrait">Portrait Session</SelectItem>
                      <SelectItem value="Product">Product Photography</SelectItem>
                      <SelectItem value="Commercial">Commercial Work</SelectItem>
                      <SelectItem value="Wedding">Wedding Photography</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Date and Time */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.1 }}
                >
                  <div className="space-y-2">
                    <Label htmlFor="date">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      Date
                    </Label>
                    <Input
                      id="date"
                      name="date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange}
                      min={new Date().toISOString().split('T')[0]}
                      required
                      className="hover:bg-gray-50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="startTime">
                      <Clock className="inline h-4 w-4 mr-1" />
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                      className="hover:bg-gray-50 transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="endTime">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="hover:bg-gray-50 transition-colors"
                    />
                  </div>
                </motion.div>

                {/* Location */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 }}
                >
                  <Label htmlFor="address">
                    <MapPin className="inline h-4 w-4 mr-1" />
                    Location Address
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Enter the session location"
                    required
                    className="hover:bg-gray-50 transition-colors"
                  />
                </motion.div>

                {/* Additional Notes */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.3 }}
                >
                  <Label htmlFor="additionalNotes">Additional Notes</Label>
                  <Textarea
                    id="additionalNotes"
                    name="additionalNotes"
                    value={formData.additionalNotes}
                    onChange={handleChange}
                    placeholder="Tell us more about your project, special requirements, or creative vision..."
                    rows={4}
                    className="hover:bg-gray-50 transition-colors"
                  />
                </motion.div>

                {/* File Attachments */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 }}
                >
                  <Label htmlFor="attachments">
                    <Upload className="inline h-4 w-4 mr-1" />
                    Reference Images (Optional)
                  </Label>
                  <Input
                    id="attachments"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleFileChange}
                    className="file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                  />
                  <p className="text-sm text-gray-500">
                    Upload inspiration images or examples of what you're looking for
                  </p>
                  {attachments.length > 0 && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">
                        {attachments.length} file(s) selected:
                      </p>
                      <ul className="text-sm text-gray-500 mt-1">
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
                    disabled={loading || !formData.serviceCategory || !formData.date || !formData.startTime || !formData.endTime || !formData.address}
                  >
                    {loading ? 'Submitting Booking...' : 'Submit Booking Request'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}