'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PortfolioItem } from '@/types';
import { Camera, Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function AdminPortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);
  
  const { user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPortfolioItems();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, searchTerm, selectedCategory]);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = portfolioItems;
    
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    setFilteredItems(filtered);
  };

  const handleDelete = async (item: PortfolioItem) => {
    try {
      const response = await fetch(`/api/portfolio/${item.id}`, {
        method: 'DELETE',
      });
      
      if (response.ok) {
        setPortfolioItems(prev => prev.filter(p => p.id !== item.id));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
    }
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    try {
      const response = await fetch(`/api/portfolio/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          featured: !item.featured,
        }),
      });
      
      if (response.ok) {
        setPortfolioItems(prev => 
          prev.map(p => p.id === item.id ? { ...p, featured: !p.featured } : p)
        );
      }
    } catch (error) {
      console.error('Error updating portfolio item:', error);
    }
  };

  const categories = ['all', ...Array.from(new Set(portfolioItems.map(item => item.category)))];

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading portfolio management...</p>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Portfolio Management</h1>
            <p className="text-gray-600">Manage your studio's portfolio items</p>
          </div>
          <Link href="/admin/portfolio/upload">
            <Button className="bg-amber-700 hover:bg-amber-800">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by title, category, or tags..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[200px]">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0">
                <div className="aspect-square relative overflow-hidden rounded-t-lg">
                  <Image
                    src={item.imageUrl || '/placeholder-image.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  
                  {/* Featured Badge */}
                  {item.featured && (
                    <div className="absolute top-2 left-2">
                      <Badge className="bg-amber-600 text-white">Featured</Badge>
                    </div>
                  )}
                  
                  {/* Action Buttons */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="flex gap-1">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => toggleFeatured(item)}
                        className="h-8 w-8 p-0"
                      >
                        <Camera className="h-4 w-4" />
                      </Button>
                      <Link href={`/admin/portfolio/edit/${item.id}`}>
                        <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setItemToDelete(item);
                          setDeleteDialogOpen(true);
                        }}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-semibold mb-1 truncate">{item.title}</h3>
                  <div className="flex items-center justify-between mb-2">
                    <Badge variant="outline" className="text-xs">
                      {item.category}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mb-2">
                    {item.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {item.tags.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{item.tags.length - 3}
                      </Badge>
                    )}
                  </div>
                  
                  {item.caption && (
                    <p className="text-sm text-gray-600 line-clamp-2">{item.caption}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No portfolio items found</h3>
            <p className="text-gray-600 mb-4">
              {portfolioItems.length === 0 
                ? "Start by uploading your first portfolio item!"
                : "Try adjusting your search or filter criteria."
              }
            </p>
            <Link href="/admin/portfolio/upload">
              <Button className="bg-amber-700 hover:bg-amber-800">
                <Plus className="h-4 w-4 mr-2" />
                Upload Portfolio Item
              </Button>
            </Link>
          </div>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Portfolio Item</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600">
                Are you sure you want to delete "{itemToDelete?.title}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => itemToDelete && handleDelete(itemToDelete)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}