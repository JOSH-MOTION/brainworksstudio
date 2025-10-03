'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ArrowLeft, Upload } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

// Animation variants for form elements
const formElementVariants: Variants = {
  hidden: { opacity: 0, x: -20 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// Animation variants for button
const buttonVariants: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.3 } },
  tap: { scale: 0.95 },
};

export default function UploadPortfolio() {
  const router = useRouter();
  const auth = getAuth(app);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [caption, setCaption] = useState('');
  const [clientName, setClientName] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleUpload = async () => {
    if (!title || !category || !images || !clientName) {
      setError('Please fill in all fields including client name and images.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) {
        throw new Error('User not authenticated');
      }
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('caption', caption);
      formData.append('clientName', clientName);
      formData.append('featured', 'false');
      for (let i = 0; i < images.length; i++) {
        formData.append('files', images[i]);
      }

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload portfolio');
      }

      alert('Portfolio uploaded successfully!');
      router.push('/admin');
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-navy-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-6">
        {/* Back Button */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <button
            onClick={() => router.push('/admin')}
            className="flex items-center text-navy-900 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Admin
          </button>
        </motion.div>

        {/* Header */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-navy-900 mb-6"
        >
          Upload Portfolio
        </motion.h2>

        {/* Form */}
        <div className="space-y-6">
          {[
            { id: 'title', label: 'Title *', type: 'text', value: title, onChange: setTitle, placeholder: 'Portfolio title' },
            { id: 'category', label: 'Category *', type: 'text', value: category, onChange: setCategory, placeholder: 'e.g., Corporate, Event' },
            { id: 'tags', label: 'Tags (comma separated)', type: 'text', value: tags, onChange: setTags, placeholder: 'e.g., wedding, portrait' },
            {
              id: 'caption',
              label: 'Caption',
              type: 'textarea',
              value: caption,
              onChange: setCaption,
              placeholder: 'Describe your project...',
            },
            {
              id: 'clientName',
              label: 'Client Name *',
              type: 'text',
              value: clientName,
              onChange: setClientName,
              placeholder: 'Client’s name',
            },
          ].map((field, index) => (
            <motion.div
              key={field.id}
              custom={index}
              variants={formElementVariants}
              initial="hidden"
              animate="visible"
            >
              <Label htmlFor={field.id} className="text-navy-900">{field.label}</Label>
              {field.type === 'textarea' ? (
                <Textarea
                  id={field.id}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  rows={4}
                  className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
                />
              ) : (
                <Input
                  id={field.id}
                  type={field.type}
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                  placeholder={field.placeholder}
                  className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
                />
              )}
            </motion.div>
          ))}

          <motion.div
            custom={5}
            variants={formElementVariants}
            initial="hidden"
            animate="visible"
          >
            <Label htmlFor="images" className="text-navy-900">Upload Images *</Label>
            <Input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => setImages(e.target.files)}
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
            custom={6}
            variants={formElementVariants}
            initial="hidden"
            animate="visible"
          >
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold py-6"
            >
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                {loading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    Upload
                  </>
                )}
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}