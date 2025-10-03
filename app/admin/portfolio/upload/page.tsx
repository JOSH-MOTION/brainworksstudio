// app/admin/portfolio/upload/page.tsx - Updated with PIN field
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Lock, Eye, EyeOff } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';

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

export default function UploadPortfolio() {
  const router = useRouter();
  const auth = getAuth(app);

  const [title, setTitle] = useState('');
  const [type, setType] = useState<'photography' | 'videography'>('photography');
  const [category, setCategory] = useState('');
  const [tags, setTags] = useState('');
  const [caption, setCaption] = useState('');
  const [clientName, setClientName] = useState('');
  const [files, setFiles] = useState<FileList | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [downloadPin, setDownloadPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setDownloadPin(pin);
  };

  const handleUpload = async () => {
    if (!title || !category || !clientName || (type === 'photography' && !files) || (type === 'videography' && !files && !videoUrl)) {
      setError('Please fill in all required fields.');
      return;
    }

    if (!downloadPin || downloadPin.length < 4) {
      setError('Please set a download PIN (at least 4 digits).');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const user = auth.currentUser;
      if (!user) throw new Error('User not authenticated');
      const token = await user.getIdToken();

      const formData = new FormData();
      formData.append('title', title);
      formData.append('type', type);
      formData.append('category', category);
      formData.append('tags', tags);
      formData.append('caption', caption);
      formData.append('clientName', clientName);
      formData.append('featured', 'false');
      formData.append('downloadPin', downloadPin);
      
      if (type === 'photography' && files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      } else if (type === 'videography') {
        if (videoUrl) {
          formData.append('videoUrl', videoUrl);
        }
        if (files) {
          for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
          }
        }
      }

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to upload portfolio');
      }

      const result = await response.json();
      alert(`Portfolio uploaded successfully! \n\nClient Access URL: ${window.location.origin}/client/portfolio/${result.id}\n\nDownload PIN: ${downloadPin}\n\nShare this URL and PIN with your client.`);
      router.push('/admin/portfolio');
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4"
        >
          <button
            onClick={() => router.push('/admin/portfolio')}
            className="flex items-center text-navy-900 hover:text-gold-500 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Portfolio
          </button>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-2xl font-bold text-navy-900 mb-6"
        >
          Upload Portfolio
        </motion.h2>

        <div className="space-y-6">
          <motion.div custom={0} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="title" className="text-navy-900">Title *</Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Portfolio title"
              className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
            />
          </motion.div>

          <motion.div custom={1} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="type" className="text-navy-900">Type *</Label>
            <Select value={type} onValueChange={(value: 'photography' | 'videography') => setType(value)}>
              <SelectTrigger className="border-navy-200 focus:ring-gold-500">
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="photography">Photography</SelectItem>
                <SelectItem value="videography">Videography</SelectItem>
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div custom={2} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="category" className="text-navy-900">Category *</Label>
            <Select value={category} onValueChange={(value: string) => setCategory(value)}>
              <SelectTrigger className="border-navy-200 focus:ring-gold-500">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {(type === 'photography' ? photographyCategories : videographyCategories).map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </motion.div>

          <motion.div custom={3} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="tags" className="text-navy-900">Tags (comma separated)</Label>
            <Input
              id="tags"
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="e.g., wedding, portrait"
              className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
            />
          </motion.div>

          <motion.div custom={4} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="caption" className="text-navy-900">Caption</Label>
            <Textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Describe your project..."
              rows={4}
              className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
            />
          </motion.div>

          <motion.div custom={5} variants={formElementVariants} initial="hidden" animate="visible">
            <Label htmlFor="clientName" className="text-navy-900">Client Name *</Label>
            <Input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Client's name"
              className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
            />
          </motion.div>

          {/* PIN Setup Section */}
          <motion.div custom={6} variants={formElementVariants} initial="hidden" animate="visible">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lock className="w-5 h-5 text-yellow-600" />
                <Label className="text-navy-900 font-semibold">Download PIN *</Label>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Set a unique PIN that clients will use to download their photos
              </p>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <Input
                    type={showPin ? 'text' : 'password'}
                    value={downloadPin}
                    onChange={(e) => setDownloadPin(e.target.value.replace(/\D/g, ''))}
                    maxLength={6}
                    placeholder="Enter 4-6 digit PIN"
                    className="border-navy-200 focus:ring-gold-500 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <Button
                  type="button"
                  onClick={generateRandomPin}
                  variant="outline"
                  className="border-gold-500 text-gold-600 hover:bg-gold-50"
                >
                  Generate
                </Button>
              </div>
            </div>
          </motion.div>

          {type === 'photography' && (
            <motion.div custom={7} variants={formElementVariants} initial="hidden" animate="visible">
              <Label htmlFor="images" className="text-navy-900">Upload Images *</Label>
              <Input
                id="images"
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setFiles(e.target.files)}
                className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
              />
            </motion.div>
          )}

          {type === 'videography' && (
            <>
              <motion.div custom={8} variants={formElementVariants} initial="hidden" animate="visible">
                <Label htmlFor="videoUrl" className="text-navy-900">YouTube Video URL (optional)</Label>
                <Input
                  id="videoUrl"
                  type="text"
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  placeholder="e.g., https://www.youtube.com/embed/your-video-id"
                  className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
                />
              </motion.div>
              <motion.div custom={9} variants={formElementVariants} initial="hidden" animate="visible">
                <Label htmlFor="videoFiles" className="text-navy-900">Upload Video (optional)</Label>
                <Input
                  id="videoFiles"
                  type="file"
                  accept="video/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="border-navy-200 focus:ring-gold-500 focus:border-gold-500"
                />
              </motion.div>
            </>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-red-600 text-sm bg-red-50 p-3 rounded-md"
            >
              {error}
            </motion.div>
          )}

          <motion.div custom={10} variants={formElementVariants} initial="hidden" animate="visible">
            <Button
              onClick={handleUpload}
              disabled={loading}
              className="w-full bg-gold-500 text-navy-900 hover:bg-gold-400 font-semibold py-6 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Uploading...'
              ) : (
                <>
                  <Upload className="h-5 w-5" />
                  Upload Portfolio
                </>
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}