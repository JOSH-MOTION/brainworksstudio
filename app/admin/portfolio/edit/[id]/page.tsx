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
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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

export default function EditPortfolio({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pinError, setPinError] = useState('');
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

  useEffect(() => {
    const auth = getAuth();
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
        console.log('Fetched PIN:', data.pin); // Debug PIN
        setItem(data);
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
      if (formData.videoUrl) body.append('videoUrl', formData.videoUrl);
      formData.files.forEach((file) => body.append('files', file));
      console.log('Submitting PIN:', formData.pin); // Debug PIN

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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData({ ...formData, files: Array.from(e.target.files) });
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-teal-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-coral-500 mx-auto"></div>
            <p className="mt-4 text-sm text-teal-900">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
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

  return (
    <Layout>
      <motion.section
        initial="hidden"
        animate="visible"
        variants={formVariants}
        className="py-20 bg-teal-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-teal-900 mb-8">Edit Portfolio Item</h1>
          <div className="mb-6">
            <Label className="text-teal-900 text-sm">Current PIN</Label>
            <Input
              value={formData.pin || 'No PIN set'}
              readOnly
              className="border-coral-100 text-sm rounded-lg bg-gray-100"
            />
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-teal-900 text-sm">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-teal-900 text-sm">Type</Label>
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
              <Label htmlFor="category" className="text-teal-900 text-sm">Category</Label>
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
              <Label htmlFor="tags" className="text-teal-900 text-sm">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="caption" className="text-teal-900 text-sm">Caption</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="clientName" className="text-teal-900 text-sm">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="clientId" className="text-teal-900 text-sm">Client ID</Label>
              <Input
                id="clientId"
                value={formData.clientId}
                onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </div>
            <div>
              <Label htmlFor="pin" className="text-teal-900 text-sm">PIN (Client Access)</Label>
              <Input
                id="pin"
                type="text"
                value={formData.pin}
                onChange={(e) => setFormData({ ...formData, pin: e.target.value })}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                placeholder="Enter PIN (at least 4 characters, leave blank to remove)"
              />
              {pinError && <p className="text-xs text-red-600 mt-1">{pinError}</p>}
            </div>
            <div>
              <Label htmlFor="featured" className="text-teal-900 text-sm">Featured</Label>
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(checked) => setFormData({ ...formData, featured: !!checked })}
              />
            </div>
            {formData.type === 'videography' && (
              <div>
                <Label htmlFor="videoUrl" className="text-teal-900 text-sm">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
                />
              </div>
            )}
            <div>
              <Label htmlFor="files" className="text-teal-900 text-sm">Upload Additional Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="border-coral-100 focus:ring-coral-500 text-sm rounded-lg"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !token}
              className="bg-coral-500 text-white hover:bg-coral-600 rounded-lg text-sm"
            >
              {loading ? 'Updating...' : 'Update Portfolio Item'}
            </Button>
          </form>
        </div>
      </motion.section>
    </Layout>
  );
}