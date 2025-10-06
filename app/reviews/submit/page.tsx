// app/reviews/submit/page.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Star, Send } from 'lucide-react';

const formElementVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

const photographyCategories = [
  'Corporate', 'Event', 'Portrait', 'Fashion', 'Product', 'Travel & Landscape',
  'Documentary & Lifestyle', 'Creative/Artistic', 'Others'
];
const videographyCategories = [
  'Corporate', 'Event', 'Music Videos', 'Commercials & Adverts', 'Documentary',
  'Short Films / Creative Projects', 'Promotional', 'Social Media', 'Others'
];
const serviceCategories = Array.from(new Set([...photographyCategories, ...videographyCategories]));

export default function SubmitReview() {
  const router = useRouter();
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientImage, setClientImage] = useState<File | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!clientName || !clientEmail || !serviceType || !reviewText || rating === 0) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('clientName', clientName);
      formData.append('clientEmail', clientEmail);
      formData.append('serviceType', serviceType);
      formData.append('rating', rating.toString());
      formData.append('reviewText', reviewText);
      if (clientImage) {
        formData.append('clientImage', clientImage);
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit review');
      }

      alert('Review submitted successfully! It will be visible once approved.');
      router.push('/');
    } catch (err: any) {
      console.error('Submission failed:', err);
      setError(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-teal-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-teal-900 mb-6"
        >
          Submit Your Review
        </motion.h2>

        <div className="space-y-6">
          <motion.div custom={0} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="clientName" className="text-teal-900 text-sm">Name *</Label>
            <Input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Your name"
              className="border-gray-300 focus:ring-teal-500 text-sm rounded-lg"
            />
          </motion.div>

          <motion.div custom={1} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="clientEmail" className="text-teal-900 text-sm">Email *</Label>
            <Input
              id="clientEmail"
              type="email"
              value={clientEmail}
              onChange={(e) => setClientEmail(e.target.value)}
              placeholder="Your email"
              className="border-gray-300 focus:ring-teal-500 text-sm rounded-lg"
            />
          </motion.div>

          <motion.div custom={2} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="clientImage" className="text-teal-900 text-sm">Profile Image (optional)</Label>
            <Input
              id="clientImage"
              type="file"
              accept="image/*"
              onChange={(e) => setClientImage(e.target.files?.[0] || null)}
              className="border-gray-300 focus:ring-teal-500 text-sm rounded-lg"
            />
          </motion.div>

          <motion.div custom={3} variants={formElementVariants} initial="hidden" animate="visible">
            <Label className="text-teal-900 text-sm">Rating *</Label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`h-6 w-6 cursor-pointer ${
                    star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </motion.div>

          <motion.div custom={4} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="serviceType" className="text-teal-900 text-sm">Service Type *</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger className="border-gray-300 focus:ring-teal-500 text-sm rounded-lg">
                <SelectValue placeholder="Select service type" />
              </SelectTrigger>
              <SelectContent>
                {serviceCategories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div custom={5} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="reviewText" className="text-teal-900 text-sm">Review *</Label>
            <Textarea
              id="reviewText"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              placeholder="Share your experience..."
              rows={4}
              className="border-gray-300 focus:ring-teal-500 text-sm rounded-lg"
            />
          </motion.div>

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm bg-red-50 p-3 rounded-lg"
            >
              {error}
            </motion.div>
          )}

          <motion.div custom={6} variants={formElementVariants} initial="hidden" animate="visible">
            <motion.button
              variants={buttonVariants}
              whileHover="hover"
              whileTap="tap"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-teal-500 text-white hover:bg-teal-600 font-semibold py-3 flex items-center justify-center gap-2 text-sm rounded-lg disabled:opacity-50"
            >
              {loading ? (
                'Submitting...'
              ) : (
                <>
                  <Send className="h-5 w-5" />
                  Submit Review
                </>
              )}
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}