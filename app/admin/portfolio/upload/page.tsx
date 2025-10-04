'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Lock, Eye, EyeOff, Image as ImageIcon } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import Layout from '@/components/Layout';

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
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(pin);
  };

  const handleUpload = async () => {
    // Validation
    if (!title || !category || !clientName) {
      setError('Please fill in all required fields (Title, Category, Client Name).');
      return;
    }
    if (type === 'photography' && !files) {
      setError('Please upload at least one image for photography.');
      return;
    }
    if (type === 'videography' && !files && !videoUrl) {
      setError('Please upload a video file or provide a YouTube URL.');
      return;
    }
    if (type === 'videography' && files && !thumbnailFile) {
      setError('Please upload a thumbnail image for the local video.');
      return;
    }
    if (pin && pin.length < 4) {
      setError('PIN must be at least 4 digits.');
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
      formData.append('pin', pin);

      // Handle photography uploads
      if (type === 'photography' && files) {
        for (let i = 0; i < files.length; i++) {
          formData.append('files', files[i]);
        }
      }

      // Handle videography uploads
      if (type === 'videography') {
        if (videoUrl) {
          formData.append('videoUrl', videoUrl);
          if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
            const videoId = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
            const thumbnailUrl = videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/video-placeholder.jpg';
            formData.append('imageUrls', thumbnailUrl);
          } else {
            formData.append('imageUrls', '/video-placeholder.jpg');
          }
        }
        if (files && files[0]) {
          formData.append('files', files[0]);
        }
        if (thumbnailFile) {
          formData.append('thumbnail', thumbnailFile);
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
      alert(`Portfolio uploaded successfully! \n\nClient Access URL: ${window.location.origin}/client/portfolio/${result.id}\n\nPIN: ${pin || 'None'}\n\nShare this URL and PIN with your client.`);
      router.push('/admin/portfolio');
    } catch (err: any) {
      console.error('Upload failed:', err);
      setError(err.message || 'Failed to upload portfolio. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen bg-teal-50 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Button
              onClick={() => router.push('/admin/portfolio')}
              variant="outline"
              className="flex items-center text-teal-900 hover:text-coral-500 transition-colors text-sm border-coral-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Portfolio
            </Button>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-teal-900 mb-6"
          >
            Upload Portfolio
          </motion.h2>

          <div className="space-y-6">
            <motion.div custom={0} variants={formElementVariants} initial="hidden" animate="visible">
              <Label htmlFor="title" className="text-teal-900 text-sm">Title *</Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Portfolio title"
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </motion.div>

            <motion.div custom={1} variants={formElementVariants} initial="hidden" animate="visible">
              <Label htmlFor="type" className="text-teal-900 text-sm">Type *</Label>
              <Select value={type} onValueChange={(value: 'photography' | 'videography') => setType(value)}>
                <SelectTrigger className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                </SelectContent>
              </Select>
            </motion.div>

            <motion.div custom={2} variants={formElementVariants} initial="hidden" animate="visible">
              <Label htmlFor="category" className="text-teal-900 text-sm">Category *</Label>
              <Select value={category} onValueChange={(value: string) => setCategory(value)}>
                <SelectTrigger className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg">
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
              <Label htmlFor="tags" className="text-teal-900 text-sm">Tags (comma separated)</Label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="e.g., wedding, portrait"
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </motion.div>

            <motion.div custom={4} variants={formElementVariants} initial="hidden" animate="visible">
              <Label htmlFor="caption" className="text-teal-900 text-sm">Caption</Label>
              <Textarea
                id="caption"
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Describe your project..."
                rows={4}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </motion.div>

            <motion.div custom={5} variants={formElementVariants} initial="hidden" animate="visible">
              <Label htmlFor="clientName" className="text-teal-900 text-sm">Client Name *</Label>
              <Input
                id="clientName"
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="Client's name"
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </motion.div>

            <motion.div custom={6} variants={formElementVariants} initial="hidden" animate="visible">
              <div className="bg-coral-50 border border-coral-100 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Lock className="w-5 h-5 text-coral-500" />
                  <Label className="text-teal-900 font-semibold text-sm">PIN *</Label>
                </div>
                <p className="text-xs text-teal-900 mb-3">
                  Set a unique PIN that clients will use to access their portfolio
                </p>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <Input
                      type={showPin ? 'text' : 'password'}
                      value={pin}
                      onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                      maxLength={6}
                      placeholder="Enter 4-6 digit PIN"
                      className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-teal-900 hover:text-coral-500"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <motion.button
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                    type="button"
                    onClick={generateRandomPin}
                    className="border-coral-100 text-coral-500 hover:bg-coral-50 text-sm rounded-lg px-4 py-2"
                  >
                    Generate
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {type === 'photography' && (
              <motion.div custom={7} variants={formElementVariants} initial="hidden" animate="visible">
                <Label htmlFor="images" className="text-teal-900 text-sm">Upload Images *</Label>
                <Input
                  id="images"
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) => setFiles(e.target.files)}
                  className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                />
              </motion.div>
            )}

            {type === 'videography' && (
              <>
                <motion.div custom={8} variants={formElementVariants} initial="hidden" animate="visible">
                  <Label htmlFor="videoUrl" className="text-teal-900 text-sm">YouTube Video URL (optional)</Label>
                  <Input
                    id="videoUrl"
                    type="text"
                    value={videoUrl}
                    onChange={(e) => setVideoUrl(e.target.value)}
                    placeholder="e.g., https://www.youtube.com/embed/your-video-id"
                    className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                  />
                </motion.div>
                <motion.div custom={9} variants={formElementVariants} initial="hidden" animate="visible">
                  <Label htmlFor="videoFiles" className="text-teal-900 text-sm">Upload Video (optional)</Label>
                  <Input
                    id="videoFiles"
                    type="file"
                    accept="video/*"
                    onChange={(e) => setFiles(e.target.files)}
                    className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                  />
                </motion.div>
                {files && (
                  <motion.div custom={10} variants={formElementVariants} initial="hidden" animate="visible">
                    <Label htmlFor="thumbnail" className="text-teal-900 text-sm">Video Thumbnail * (required for local video)</Label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-teal-900 h-4 w-4" />
                      <Input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)}
                        className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg pl-10"
                      />
                    </div>
                  </motion.div>
                )}
              </>
            )}

            {error && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-600 text-sm bg-red-50 p-3 rounded-lg"
              >
                {error}
              </motion.div>
            )}

            <motion.div custom={11} variants={formElementVariants} initial="hidden" animate="visible">
              <motion.button
                variants={buttonVariants}
                whileHover="hover"
                whileTap="tap"
                onClick={handleUpload}
                disabled={loading}
                className="w-full bg-coral-500 text-white hover:bg-coral-600 font-semibold py-3 flex items-center justify-center gap-2 text-sm rounded-lg disabled:opacity-50"
              >
                {loading ? (
                  'Uploading...'
                ) : (
                  <>
                    <Upload className="h-5 w-5" />
                    Upload Portfolio
                  </>
                )}
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
}