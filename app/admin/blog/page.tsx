// app/admin/blog/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit, Trash2, Eye, Image as ImageIcon } from 'lucide-react';
import { uploadToCloudinary } from '@/lib/cloudinary';
import Image from 'next/image';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: { name: string; uid: string };
  category: string;
  tags: string[];
  published: boolean;
  createdAt: string;
  views: number;
}

export default function AdminBlogPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    featuredImage: '',
    category: '',
    tags: '',
    published: false,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPosts();
    }
  }, [user, isAdmin]);

  const fetchPosts = async () => {
    try {
      const response = await fetch('/api/blog');
      if (response.ok) {
        const data = await response.json();
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const result = await uploadToCloudinary(file, 'blog');
      setFormData({ ...formData, featuredImage: result.secure_url });
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async () => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const url = editingPost ? `/api/blog/${editingPost.id}` : '/api/blog';
      const method = editingPost ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(',').map((tag) => tag.trim()),
        }),
      });

      if (response.ok) {
        alert(editingPost ? 'Post updated successfully' : 'Post created successfully');
        setDialogOpen(false);
        resetForm();
        fetchPosts();
      } else {
        alert('Failed to save post');
      }
    } catch (error) {
      console.error('Error saving post:', error);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!firebaseUser || !confirm('Are you sure you want to delete this post?')) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/blog/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Post deleted successfully');
        fetchPosts();
      } else {
        alert('Failed to delete post');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('An error occurred');
    }
  };

  const handleEdit = (post: BlogPost) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featuredImage: post.featuredImage,
      category: post.category,
      tags: post.tags.join(', '),
      published: post.published,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      excerpt: '',
      content: '',
      featuredImage: '',
      category: '',
      tags: '',
      published: false,
    });
    setEditingPost(null);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-gray-200 border-t-gray-900 mb-4"></div>
          <p className="text-gray-600 font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-12">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 tracking-tight">Blog Management</h1>
              <p className="text-lg text-gray-600">Create, edit, and manage your blog posts</p>
            </div>
            <Dialog open={dialogOpen} onOpenChange={(open) => {
              setDialogOpen(open);
              if (!open) resetForm();
            }}>
              <DialogTrigger asChild>
                <Button className="bg-gray-900 hover:bg-gray-800 text-white px-6 py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold">
                  <Plus className="h-5 w-5 mr-2" />
                  New Post
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
                <DialogHeader className="pb-6 border-b">
                  <DialogTitle className="text-2xl font-bold text-gray-900">
                    {editingPost ? 'Edit Post' : 'Create New Post'}
                  </DialogTitle>
                  <DialogDescription className="text-gray-600">
                    {editingPost ? 'Update your blog post details' : 'Fill in the details to create a new blog post'}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6 py-6">
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">Title</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter an engaging title"
                      className="h-12 text-base rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">Excerpt</Label>
                    <Textarea
                      value={formData.excerpt}
                      onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                      placeholder="Write a brief description to capture attention"
                      rows={3}
                      className="rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900 resize-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">Content (HTML supported)</Label>
                    <Textarea
                      value={formData.content}
                      onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                      placeholder="Write your post content here..."
                      rows={12}
                      className="rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900 font-mono text-sm resize-none"
                    />
                  </div>
                  <div>
                    <Label className="text-sm font-semibold text-gray-900 mb-2 block">Featured Image</Label>
                    <div className="space-y-4">
                      <div className="relative">
                        <Input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleImageUpload} 
                          disabled={uploading}
                          className="h-12 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-gray-100 file:text-gray-900 file:font-medium hover:file:bg-gray-200"
                        />
                        {uploading && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-900"></div>
                          </div>
                        )}
                      </div>
                      {formData.featuredImage && (
                        <div className="relative w-full h-64 rounded-xl overflow-hidden border-2 border-gray-200 shadow-sm">
                          <Image 
                            src={formData.featuredImage} 
                            alt="Preview" 
                            fill
                            className="object-cover"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-2 block">Category</Label>
                      <Input
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        placeholder="e.g., Design, Development"
                        className="h-12 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 mb-2 block">Tags (comma-separated)</Label>
                      <Input
                        value={formData.tags}
                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                        placeholder="design, tips, tutorial"
                        className="h-12 rounded-xl border-gray-300 focus:border-gray-900 focus:ring-gray-900"
                      />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <Switch
                      checked={formData.published}
                      onCheckedChange={(checked) => setFormData({ ...formData, published: checked })}
                      className="data-[state=checked]:bg-gray-900"
                    />
                    <div>
                      <Label className="text-sm font-semibold text-gray-900 cursor-pointer">Publish immediately</Label>
                      <p className="text-xs text-gray-600 mt-0.5">Make this post visible to all users</p>
                    </div>
                  </div>
                  <Button 
                    onClick={handleSubmit} 
                    className="w-full bg-gray-900 hover:bg-gray-800 text-white h-12 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-base" 
                    disabled={uploading}
                  >
                    {uploading ? 'Uploading...' : editingPost ? 'Update Post' : 'Create Post'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-1">Total Posts</p>
              <p className="text-3xl font-bold text-gray-900">{posts.length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-1">Published</p>
              <p className="text-3xl font-bold text-green-600">{posts.filter(p => p.published).length}</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-gray-600 mb-1">Drafts</p>
              <p className="text-3xl font-bold text-orange-600">{posts.filter(p => !p.published).length}</p>
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <div className="space-y-4">
          {posts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
              <ImageIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts yet</h3>
              <p className="text-gray-600 mb-6">Get started by creating your first blog post</p>
              <Button 
                onClick={() => setDialogOpen(true)}
                className="bg-gray-900 hover:bg-gray-800 text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Create Your First Post
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="overflow-hidden border-gray-200 hover:shadow-xl transition-all duration-300 rounded-2xl bg-white">
                <div className="flex flex-col sm:flex-row">
                  {/* Featured Image */}
                  <div className="relative w-full sm:w-80 aspect-[4/3] sm:aspect-auto sm:h-auto flex-shrink-0 bg-gray-100">
                    {post.featuredImage ? (
                      <Image
                        src={post.featuredImage}
                        alt={post.title}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                        <ImageIcon className="h-16 w-16 text-gray-400" />
                      </div>
                    )}
                  </div>
                  
                  {/* Content */}
                  <div className="flex-1 p-6 sm:p-8">
                    <CardHeader className="p-0 mb-4">
                      <div className="flex flex-wrap items-center gap-2 mb-3">
                        <Badge className={`${post.published ? 'bg-green-100 text-green-700 border-green-200' : 'bg-orange-100 text-orange-700 border-orange-200'} border rounded-full px-3 py-1 font-medium`}>
                          {post.published ? 'Published' : 'Draft'}
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-700 rounded-full px-3 py-1 font-medium">
                          {post.category}
                        </Badge>
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="outline" className="border-gray-200 text-gray-600 rounded-full px-3 py-1 text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2 hover:text-gray-700 transition-colors">
                        {post.title}
                      </CardTitle>
                      <CardDescription className="text-gray-600 text-base line-clamp-2">
                        {post.excerpt}
                      </CardDescription>
                    </CardHeader>
                    
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{post.author.name}</span>
                        <span className="text-gray-400">•</span>
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        <span className="text-gray-400">•</span>
                        <span className="flex items-center gap-1.5">
                          <Eye className="h-4 w-4" />
                          {post.views}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEdit(post)}
                          className="border-gray-300 hover:bg-gray-50 rounded-lg"
                        >
                          <Edit className="h-4 w-4 mr-1.5" />
                          Edit
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600 border-red-200 hover:bg-red-50 rounded-lg" 
                          onClick={() => handleDelete(post.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}