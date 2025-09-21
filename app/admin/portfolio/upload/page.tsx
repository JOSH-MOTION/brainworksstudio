'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Upload, X, Camera, Video, Plus } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';

export default function UploadPortfolioPage() {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: [] as string[],
    caption: '',
    featured: false,
  });
  const [newTag, setNewTag] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { user, isAdmin } = useAuth();
  const router = useRouter();

  const categories = [
    'Event Photography',
    'Portrait Sessions',
    'Product Photography',
    'Commercial Work',
    'Wedding Photography',
    'Video Production'
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVideoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setVideoFile(file);
    }
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !isAdmin) {
      router.push('/auth/login');
      return;
    }

    if (!imageFile) {
      setError('Please select an image file');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Upload image to Cloudinary
      const imageResult = await uploadToCloudinary(imageFile, 'portfolio');
      
      // Upload video if provided
      let videoUrl = '';
      if (videoFile) {
        const videoResult = await uploadToCloudinary(videoFile, 'portfolio/videos');
        videoUrl = videoResult.secure_url;
      }

      // Create portfolio item
      const portfolioData = {
        title: formData.title,
        category: formData.category,
        tags: formData.tags,
        imageUrl: imageResult.secure_url,
        videoUrl: videoUrl || undefined,
        caption: formData.caption || undefined,
        featured: formData.featured,
      };

      const response = await fetch('/api/portfolio', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(portfolioData),
      });

      if (!response.ok) {
        throw new Error('Failed to create portfolio item');
      }

      setSuccess(true);
      
      // Reset form
      setFormData({
        title: '',
        category: '',
        tags: [],
        caption: '',
        featured: false,
      });
      setImageFile(null);
      setVideoFile(null);
      setImagePreview('');
      
      setTimeout(() => {
        router.push('/admin/portfolio');
      }, 2000);
      
    } catch (error: any) {
      setError(error.message || 'An error occurred while uploading');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Access Denied</CardTitle>
              <CardDescription>You need admin privileges to access this page.</CardDescription>
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
                <Camera className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-600">Upload Successful!</h2>
              <p className="text-gray-600 mb-4">
                Your portfolio item has been uploaded successfully.
              </p>
              <p className="text-sm text-gray-500">
                Redirecting to portfolio management...
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
            <CardTitle className="text-2xl">Upload Portfolio Item</CardTitle>
            <CardDescription>
              Add a new item to your studio's portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                  placeholder="Enter a descriptive title"
                />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select onValueChange={(value) => setFormData({...formData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags</Label>
                <div className="flex gap-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    placeholder="Add a tag"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                  />
                  <Button type="button" onClick={addTag} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.tags.map(tag => (
                    <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                      {tag}
                      <X 
                        className="h-3 w-3 cursor-pointer" 
                        onClick={() => removeTag(tag)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label htmlFor="image">Main Image *</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {imagePreview ? (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="max-h-64 mx-auto rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Click to upload an image</p>
                      <p className="text-sm text-gray-500">PNG, JPG up to 10MB</p>
                    </div>
                  )}
                  <Input
                    id="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <Label htmlFor="image" className="cursor-pointer">
                    <Button type="button" variant="outline" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Image
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Video Upload (Optional) */}
              <div className="space-y-2">
                <Label htmlFor="video">Video (Optional)</Label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                  {videoFile ? (
                    <div className="flex items-center justify-center gap-2">
                      <Video className="h-6 w-6 text-green-600" />
                      <span className="text-sm">{videoFile.name}</span>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => setVideoFile(null)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Video className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload a video (optional)</p>
                      <p className="text-sm text-gray-500">MP4, MOV up to 100MB</p>
                    </div>
                  )}
                  <Input
                    id="video"
                    type="file"
                    accept="video/*"
                    onChange={handleVideoChange}
                    className="hidden"
                  />
                  <Label htmlFor="video" className="cursor-pointer">
                    <Button type="button" variant="outline" className="mt-2">
                      <Upload className="h-4 w-4 mr-2" />
                      Choose Video
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Caption */}
              <div className="space-y-2">
                <Label htmlFor="caption">Caption</Label>
                <Textarea
                  id="caption"
                  value={formData.caption}
                  onChange={(e) => setFormData({...formData, caption: e.target.value})}
                  placeholder="Add a description or story about this work..."
                  rows={4}
                />
              </div>

              {/* Featured Toggle */}
              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={formData.featured}
                  onCheckedChange={(checked) => setFormData({...formData, featured: checked})}
                />
                <Label htmlFor="featured">Feature this item prominently</Label>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <div className="flex gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => router.push('/admin/portfolio')}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-amber-700 hover:bg-amber-800" 
                  disabled={loading}
                >
                  {loading ? 'Uploading...' : 'Upload Portfolio Item'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}