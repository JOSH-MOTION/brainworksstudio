'use client';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' as const } },
};

const photographyCategories = [
  'Corporate',
  'Event',
  'Portrait',
  'Fashion',
  'Product',
  'Travel & Landscape',
  'Documentary & Lifestyle',
  'Creative/Artistic',
  'Others',
];

const videographyCategories = [
  'Corporate',
  'Event',
  'Music Videos',
  'Commercials & Adverts',
  'Documentary',
  'Short Films / Creative Projects',
  'Promotional',
  'Social Media',
  'Others',
];

export default function EditPortfolio({ params }: { params: { id: string } }) {
  const { id } = params;
  const router = useRouter();
  const [item, setItem] = useState<PortfolioItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
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
  });
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async user => {
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
        });
      } catch (err: any) {
        console.error('Fetch failed:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Authentication required to update portfolio item');
      return;
    }
    setLoading(true);
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
      if (formData.videoUrl) body.append('videoUrl', formData.videoUrl);
      formData.files.forEach(file => body.append('files', file));

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
        <div className="min-h-screen flex items-center justify-center bg-navy-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-gold-500 mx-auto"></div>
            <p className="mt-4 text-navy-900">Loading...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center bg-navy-50">
          <div className="text-center">
            <p className="text-red-600">{error}</p>
            <Button
              onClick={() => router.push('/admin/portfolio')}
              className="mt-4 bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900"
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
        className="py-20 bg-navy-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-navy-900 mb-8">Edit Portfolio Item</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="title" className="text-navy-900">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                className="border-navy-200 focus:border-gold-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="type" className="text-navy-900">Type</Label>
              <Select
                value={formData.type}
                onValueChange={(value: 'photography' | 'videography') =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger className="border-navy-200 focus:border-gold-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="photography">Photography</SelectItem>
                  <SelectItem value="videography">Videography</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="category" className="text-navy-900">Category</Label>
              <Select
                value={formData.category}
                onValueChange={value => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="border-navy-200 focus:border-gold-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(formData.type === 'photography' ? photographyCategories : videographyCategories).map(cat => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="tags" className="text-navy-900">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={e => setFormData({ ...formData, tags: e.target.value })}
                className="border-navy-200 focus:border-gold-500"
              />
            </div>
            <div>
              <Label htmlFor="caption" className="text-navy-900">Caption</Label>
              <Input
                id="caption"
                value={formData.caption}
                onChange={e => setFormData({ ...formData, caption: e.target.value })}
                className="border-navy-200 focus:border-gold-500"
              />
            </div>
            <div>
              <Label htmlFor="clientName" className="text-navy-900">Client Name</Label>
              <Input
                id="clientName"
                value={formData.clientName}
                onChange={e => setFormData({ ...formData, clientName: e.target.value })}
                className="border-navy-200 focus:border-gold-500"
              />
            </div>
            <div>
              <Label htmlFor="clientId" className="text-navy-900">Client ID</Label>
              <Input
                id="clientId"
                value={formData.clientId}
                onChange={e => setFormData({ ...formData, clientId: e.target.value })}
                className="border-navy-200 focus:border-gold-500"
              />
            </div>
            <div>
              <Label htmlFor="featured" className="text-navy-900">Featured</Label>
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={checked => setFormData({ ...formData, featured: !!checked })}
              />
            </div>
            {formData.type === 'videography' && (
              <div>
                <Label htmlFor="videoUrl" className="text-navy-900">Video URL</Label>
                <Input
                  id="videoUrl"
                  value={formData.videoUrl}
                  onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                  className="border-navy-200 focus:border-gold-500"
                />
              </div>
            )}
            <div>
              <Label htmlFor="files" className="text-navy-900">Upload Additional Files</Label>
              <Input
                id="files"
                type="file"
                multiple
                onChange={handleFileChange}
                className="border-navy-200 focus:border-gold-500"
              />
            </div>
            <Button
              type="submit"
              disabled={loading || !token}
              className="bg-navy-900 text-white hover:bg-gold-500 hover:text-navy-900"
            >
              {loading ? 'Updating...' : 'Update Portfolio Item'}
            </Button>
          </form>
        </div>
      </motion.section>
    </Layout>
  );
}