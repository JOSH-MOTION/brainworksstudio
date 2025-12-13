'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, Variants } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Upload, Lock, Eye, EyeOff, Image as ImageIcon, X, Film } from 'lucide-react';
import { getAuth } from 'firebase/auth';
import { app } from '@/lib/firebase';
import Layout from '@/components/Layout';
import Image from 'next/image';

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

interface PreviewFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

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
  const [previewFiles, setPreviewFiles] = useState<PreviewFile[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState('');
  const [pin, setPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateRandomPin = () => {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    setPin(pin);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    setFiles(selectedFiles);

    // Create preview URLs
    const previews: PreviewFile[] = [];
    Array.from(selectedFiles).forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const preview = URL.createObjectURL(file);
      previews.push({
        file,
        preview,
        type: isVideo ? 'video' : 'image',
      });
    });
    setPreviewFiles(previews);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeFile = (index: number) => {
    const newPreviews = previewFiles.filter((_, i) => i !== index);
    setPreviewFiles(newPreviews);

    // Update files
    if (files) {
      const dt = new DataTransfer();
      Array.from(files).forEach((file, i) => {
        if (i !== index) dt.items.add(file);
      });
      setFiles(dt.files.length > 0 ? dt.files : null);
    }
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
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-4"
          >
            <Button
              onClick={() => router.push('/admin/portfolio')}
              variant="outline"
              className="flex items-center text-[#001F44] hover:text-coral-500 transition-colors text-sm border-coral-100 rounded-lg"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Portfolio
            </Button>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-2xl font-bold text-[#001F44] mb-6"
          >
            Upload Portfolio
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <motion.div custom={0} variants={formElementVariants} initial="hidden" animate="visible">
                  <Label htmlFor="title" className="text-[#001F44] text-sm">Title *</Label>
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
                  <Label htmlFor="type" className="text-[#001F44] text-sm">Type *</Label>
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
                  <Label htmlFor="category" className="text-[#001F44] text-sm">Category *</Label>
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
                  <Label htmlFor="tags" className="text-[#001F44] text-sm">Tags (comma separated)</Label>
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
                  <Label htmlFor="caption" className="text-[#001F44] text-sm">Caption</Label>
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
                  <Label htmlFor="clientName" className="text-[#001F44] text-sm">Client Name *</Label>
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
                      <Label className="text-[#001F44] font-semibold text-sm">PIN *</Label>
                    </div>
                    <p className="text-xs text-[#001F44] mb-3">
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
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#001F44] hover:text-coral-500"
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
                        className="border border-coral-100 text-coral-500 hover:bg-coral-50 text-sm rounded-lg px-4 py-2"
                      >
                        Generate
                      </motion.button>
                    </div>
                  </div>
                </motion.div>

                {type === 'videography' && (
                  <motion.div custom={8} variants={formElementVariants} initial="hidden" animate="visible">
                    <Label htmlFor="videoUrl" className="text-[#001F44] text-sm">YouTube Video URL (optional)</Label>
                    <Input
                      id="videoUrl"
                      type="text"
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      placeholder="e.g., https://www.youtube.com/embed/your-video-id"
                      className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                    />
                  </motion.div>
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
                    className="w-full bg-coral-500 text-teal-600 hover:bg-coral-600 font-semibold py-3 flex items-center justify-center gap-2 text-sm rounded-lg disabled:opacity-50"
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

            {/* Right Column - Preview Gallery */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-[#001F44] mb-4">
                  {title || 'Untitled Portfolio'}
                </h3>

                {/* Upload Area */}
                <div className="mb-6">
                  <Label htmlFor={type === 'photography' ? 'images' : 'videoFiles'} className="text-[#001F44] text-sm block mb-2">
                    {type === 'photography' ? 'Upload Images *' : 'Upload Video *'}
                  </Label>
                  <div className="relative border-2 border-dashed border-coral-200 rounded-lg p-8 hover:border-coral-400 transition-colors cursor-pointer bg-coral-50/50">
                    <input
                      id={type === 'photography' ? 'images' : 'videoFiles'}
                      type="file"
                      multiple={type === 'photography'}
                      accept={type === 'photography' ? 'image/*' : 'video/*'}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      {type === 'photography' ? (
                        <ImageIcon className="w-12 h-12 mx-auto mb-4 text-coral-500" />
                      ) : (
                        <Film className="w-12 h-12 mx-auto mb-4 text-coral-500" />
                      )}
                      <p className="text-[#001F44] font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        {type === 'photography' ? 'PNG, JPG, GIF up to 10MB each' : 'MP4, MOV, AVI up to 100MB'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail Upload for Video */}
                {type === 'videography' && previewFiles.length > 0 && (
                  <div className="mb-6">
                    <Label htmlFor="thumbnail" className="text-[#001F44] text-sm block mb-2">
                      Video Thumbnail * (required for local video)
                    </Label>
                    <div className="relative border-2 border-dashed border-coral-200 rounded-lg p-4 hover:border-coral-400 transition-colors cursor-pointer bg-coral-50/50">
                      <input
                        id="thumbnail"
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      {thumbnailPreview ? (
                        <div className="relative w-32 h-32 mx-auto">
                          <Image
                            src={thumbnailPreview}
                            alt="Thumbnail"
                            fill
                            className="object-cover rounded-lg"
                          />
                        </div>
                      ) : (
                        <div className="text-center">
                          <ImageIcon className="w-8 h-8 mx-auto mb-2 text-coral-500" />
                          <p className="text-sm text-[#001F44]">Click to upload thumbnail</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Preview Gallery */}
                {previewFiles.length > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-[#001F44]">
                        Preview ({previewFiles.length} {previewFiles.length === 1 ? 'file' : 'files'})
                      </h4>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {previewFiles.map((preview, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                        >
                          {preview.type === 'image' ? (
                            <Image
                              src={preview.preview}
                              alt={`Preview ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={preview.preview}
                              className="w-full h-full object-cover"
                              muted
                            />
                          )}
                          <button
                            onClick={() => removeFile(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            {index + 1}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {previewFiles.length === 0 && (
                  <div className="text-center py-12 text-gray-400">
                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>No files uploaded yet</p>
                    <p className="text-sm">Upload files to see them here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}