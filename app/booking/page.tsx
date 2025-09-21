'use client';

import { useState } from 'react';
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
  
  const { user, userProfile } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
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
      const bookingData = {
        ...formData,
        userId: user.uid,
        userName: userProfile?.displayName,
        userEmail: user.email,
        attachments: attachments,
      };

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        throw new Error('Failed to create booking');
      }

      setSuccess(true);
      
      // Reset form
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
        router.push('/dashboard');
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
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Please Sign In</CardTitle>
              <CardDescription>You need to be signed in to book a session.</CardDescription>
            </CardHeader>
            <CardContent>
              <Button onClick={() => router.push('/auth/login')} className="w-full">
                Sign In
              </Button>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  if (success) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto text-center">
            <CardContent className="p-8">
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Calendar className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-600">Booking Submitted!</h2>
              <p className="text-gray-600 mb-4">
                Thank you for your booking request. We'll review it and get back to you within 24 hours.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to dashboard...
              </p>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Book a Photography Session</CardTitle>
            <CardDescription>
              Tell us about your project and we'll get back to you with a personalized quote.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Category */}
              <div className="space-y-2">
                <Label htmlFor="serviceCategory">Service Type</Label>
                <Select onValueChange={(value) => setFormData({...formData, serviceCategory: value})}>
                  <SelectTrigger>
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
              </div>

              {/* Date and Time */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                    required
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
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
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
                />
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  name="additionalNotes"
                  value={formData.additionalNotes}
                  onChange={handleChange}
                  placeholder="Tell us more about your project, special requirements, or creative vision..."
                  rows={4}
                />
              </div>

              {/* File Attachments */}
              <div className="space-y-2">
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
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-amber-700 hover:bg-amber-800 py-6 text-lg" 
                disabled={loading}
              >
                {loading ? 'Submitting Booking...' : 'Submit Booking Request'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}