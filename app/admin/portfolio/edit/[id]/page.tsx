'use client';

import React from 'react';
import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Layout from '@/components/Layout';
import { PortfolioItem } from '@/types';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ArrowLeft, Upload, X, ImageIcon, Film, Eye, EyeOff, Lock } from 'lucide-react';
import Image from 'next/image';
import { app } from '@/lib/firebase';

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const photographyCategories = [
  'Corporate', 'Event', 'Portrait', 'Fashion', 'Product', 'Travel & Landscape', 'Documentary & Lifestyle', 'Creative/Artistic', 'Others',
];

const videographyCategories = [
  'Corporate', 'Event', 'Music Videos', 'Commercials & Adverts', 'Documentary', 'Short Films / Creative Projects', 'Promotional', 'Social Media', 'Others',
];

interface PreviewFile {
  file: File;
  preview: string;
  type: 'image' | 'video';
}

export default function EditPortfolio({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const auth = getAuth(app);
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pinError, setPinError] = useState('');
  const [showPin, setShowPin] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'photography' as 'photography' | 'videography',
    category: '',
    tags: '',
    caption: '',
    clientName: '',
    featured: false,
    clientId: '',
    files: [] as File[],
    videoUrl: '',
    pin: '',
  });
  
  const [token, setToken] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newPreviewFiles, setNewPreviewFiles] = useState<PreviewFile[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const idToken = await user.getIdToken();
          setToken(idToken);
        } catch (err: any) {
          console.error('Failed to get ID token:', err);
          setError('Authentication failed');
          setLoading(false);
        }
      } else {
        setToken(null);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const headers: HeadersInit = {};
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
        const response = await fetch(`/api/portfolio/${id}`, { headers });
        if (!response.ok) {
          let errorMessage = 'Failed to fetch portfolio item';
          try {
            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
              const errorData = await response.json();
              errorMessage = errorData.error || errorMessage;
            } else {
              const text = await response.text();
              console.error(`Non-JSON response: ${text.slice(0, 100)}...`);
              errorMessage = `Server returned ${response.status}: ${response.statusText}`;
            }
          } catch (parseError: any) {
            console.error('Error parsing response:', parseError);
          }
          throw new Error(errorMessage);
        }
        const data: PortfolioItem = await response.json();
        console.log('Fetched portfolio item:', data);
        setItem(data);
        setExistingImages(data.imageUrls || []);
        setFormData({
          title: data.title || '',
          type: data.type || 'photography',
          category: data.category || '',
          tags: data.tags?.join(', ') || '',
          caption: data.caption || '',
          clientName: data.clientName || '',
          featured: data.featured || false,
          clientId: data.clientId || '',
          files: [],
          videoUrl: data.videoUrl || '',
          pin: data.pin || '',
        });
      } catch (err: any) {
        console.error('Fetch failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (token) fetchItem();
  }, [id, token]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (!selectedFiles) return;

    const newFiles = Array.from(selectedFiles);
    setFormData({ ...formData, files: newFiles });

    // Create preview URLs
    const previews: PreviewFile[] = [];
    newFiles.forEach((file) => {
      const isVideo = file.type.startsWith('video/');
      const preview = URL.createObjectURL(file);
      previews.push({
        file,
        preview,
        type: isVideo ? 'video' : 'image',
      });
    });
    setNewPreviewFiles(previews);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnailFile(file);
      setThumbnailPreview(URL.createObjectURL(file));
    }
  };

  const removeExistingImage = (index: number) => {
    setExistingImages(existingImages.filter((_, i) => i !== index));
  };

  const removeNewFile = (index: number) => {
    const newFiles = formData.files.filter((_, i) => i !== index);
    const newPreviews = newPreviewFiles.filter((_, i) => i !== index);
    setFormData({ ...formData, files: newFiles });
    setNewPreviewFiles(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication required to update portfolio item');
      return;
    }
    if (formData.pin && formData.pin.length < 4) {
      setPinError('PIN must be at least 4 characters');
      return;
    }
    setLoading(true);
    setPinError('');
    try {
      const body = new FormData();
      body.append('title', formData.title);
      body.append('type', formData.type);
      body.append('category', formData.category);
      body.append('tags', formData.tags);
      body.append('caption', formData.caption);
      body.append('clientName', formData.clientName);
      body.append('featured', String(formData.featured));
      body.append('clientId', formData.clientId);
      body.append('pin', formData.pin);
      
      // Keep existing images
      body.append('existingImageUrls', JSON.stringify(existingImages));
      
      if (formData.videoUrl) body.append('videoUrl', formData.videoUrl);
      formData.files.forEach((file) => body.append('files', file));
      if (thumbnailFile) body.append('thumbnail', thumbnailFile);

      const response = await fetch(`/api/portfolio/${id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to update portfolio item';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType?.includes('application/json')) {
            const errorData = await response.json();
            errorMessage = errorData.error || errorMessage;
          } else {
            const text = await response.text();
            console.error(`Non-JSON response: ${text.slice(0, 100)}...`);
            errorMessage = `Server returned ${response.status}: ${response.statusText}`;
          }
        } catch (parseError: any) {
          console.error('Error parsing response:', parseError);
        }
        throw new Error(errorMessage);
      }
      console.log('Portfolio item updated successfully');
      router.push('/admin/portfolio');
    } catch (err: any) {
      console.error('Update failed:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-coral-500 mx-auto"></div>
            <p className="mt-4 text-sm text-[#001F44]">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error && !item) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
          <div className="text-center">
            <p className="text-red-600 text-sm">{error}</p>
            <Button
              onClick={() => router.push('/admin/portfolio')}
              className="mt-4 bg-coral-500 text-white hover:bg-coral-600 rounded-lg text-sm"
            >
              Back to Portfolio
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const totalImages = existingImages.length + newPreviewFiles.length;

  return (
    <Layout>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="py-8 bg-teal-50 min-h-screen"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
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

          <h1 className="text-3xl font-bold text-[#001F44] mb-8">Edit Portfolio Item</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Form */}
            <div className="lg:col-span-1 space-y-6">
              <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                <div>
                  <Label htmlFor="title" className="text-[#001F44] text-sm">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="type" className="text-[#001F44] text-sm">Type</Label>
                  <Select
                    value={formData.type}
                    onValueChange={(value: 'photography' | 'videography') =>
                      setFormData({ ...formData, type: value })
                    }
                  >
                    <SelectTrigger className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="photography">Photography</SelectItem>
                      <SelectItem value="videography">Videography</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="category" className="text-[#001F44] text-sm">Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(formData.type === 'photography' ? photographyCategories : videographyCategories).map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tags" className="text-[#001F44] text-sm">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="caption" className="text-[#001F44] text-sm">Caption</Label>
                  <Textarea
                    id="caption"
                    value={formData.caption}
                    onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                    rows={4}
                    className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="clientName" className="text-[#001F44] text-sm">Client Name</Label>
                  <Input
                    id="clientName"
                    value={formData.clientName}
                    onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                    className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                  />
                </div>

                <div>
                  <Label htmlFor="clientId" className="text-[#001F44] text-sm">Client ID</Label>
                  <Input
                    id="clientId"
                    value={formData.clientId}
                    onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                    className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                  />
                </div>

                <div className="bg-coral-50 border border-coral-100 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Lock className="w-5 h-5 text-coral-500" />
                    <Label className="text-[#001F44] font-semibold text-sm">PIN (Client Access)</Label>
                  </div>
                  <div className="relative">
                    <Input
                      id="pin"
                      type={showPin ? 'text' : 'password'}
                      value={formData.pin}
                      onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                      className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg pr-10"
                      placeholder="Enter PIN (at least 4 characters)"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPin(!showPin)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-[#001F44] hover:text-coral-500"
                    >
                      {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {pinError && <p className="text-xs text-red-600 mt-1">{pinError}</p>}
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
                  />
                  <Label htmlFor="featured" className="text-[#001F44] text-sm cursor-pointer">
                    Featured Item
                  </Label>
                </div>

                {formData.type === 'videography' && (
                  <div>
                    <Label htmlFor="videoUrl" className="text-[#001F44] text-sm">Video URL</Label>
                    <Input
                      id="videoUrl"
                      value={formData.videoUrl}
                      onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                      className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                      placeholder="YouTube or Vimeo URL"
                    />
                  </div>
                )}

                {error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}

                <Button
                  type="submit"
                  disabled={loading || !token}
                  className="w-full bg-coral-500 text-teal-700 hover:bg-coral-600 rounded-lg text-sm font-semibold py-3"
                >
                  {loading ? 'Updating...' : 'Update Portfolio Item'}
                </Button>
              </form>
            </div>

            {/* Right Column - Gallery Preview */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-xl font-bold text-[#001F44] mb-4">
                  {formData.title || 'Untitled Portfolio'}
                </h3>

                {/* Upload New Files */}
                <div className="mb-6">
                  <Label className="text-[#001F44] text-sm block mb-2">
                    Add More {formData.type === 'photography' ? 'Images' : 'Videos'}
                  </Label>
                  <div className="relative border-2 border-dashed border-coral-200 rounded-lg p-6 hover:border-coral-400 transition-colors cursor-pointer bg-coral-50/50">
                    <input
                      type="file"
                      multiple={formData.type === 'photography'}
                      accept={formData.type === 'photography' ? 'image/*' : 'video/*'}
                      onChange={handleFileChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div className="text-center">
                      {formData.type === 'photography' ? (
                        <ImageIcon className="w-10 h-10 mx-auto mb-3 text-coral-500" />
                      ) : (
                        <Film className="w-10 h-10 mx-auto mb-3 text-coral-500" />
                      )}
                      <p className="text-[#001F44] font-medium mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500">
                        {formData.type === 'photography' ? 'PNG, JPG, GIF' : 'MP4, MOV, AVI'}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Thumbnail for Video */}
                {formData.type === 'videography' && formData.files.length > 0 && (
                  <div className="mb-6">
                    <Label className="text-[#001F44] text-sm block mb-2">
                      Video Thumbnail
                    </Label>
                    <div className="relative border-2 border-dashed border-coral-200 rounded-lg p-4 hover:border-coral-400 transition-colors cursor-pointer bg-coral-50/50">
                      <input
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

                {/* Gallery */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-semibold text-[#001F44]">
                      Media Gallery ({totalImages} {totalImages === 1 ? 'item' : 'items'})
                    </h4>
                  </div>

                  {totalImages > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {/* Existing Images */}
                      {existingImages.map((url, index) => (
                        <motion.div
                          key={`existing-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                        >
                          <Image
                            src={url}
                            alt={`Existing ${index + 1}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-image.jpg';
                            }}
                          />
                          <button
                            type="button"
                            onClick={() => removeExistingImage(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            {index + 1}
                          </div>
                        </motion.div>
                      ))}

                      {/* New Files */}
                      {newPreviewFiles.map((preview, index) => (
                        <motion.div
                          key={`new-${index}`}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 group"
                        >
                          {preview.type === 'image' ? (
                            <Image
                              src={preview.preview}
                              alt={`New ${index + 1}`}
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
                            type="button"
                            onClick={() => removeNewFile(index)}
                            className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <div className="absolute bottom-2 left-2 px-2 py-1 bg-green-600 text-white text-xs rounded">
                            New {existingImages.length + index + 1}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-gray-400">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>No media files</p>
                      <p className="text-sm">Upload files to see them here</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </Layout>
  );
}