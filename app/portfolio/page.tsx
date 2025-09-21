'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { PortfolioItem } from '@/types';
import { Filter, Play, X } from 'lucide-react';
import Image from 'next/image';

export default function PortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);

  useEffect(() => {
    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, selectedCategory, selectedTag]);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      const data = await response.json();
      setPortfolioItems(data);
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterItems = () => {
    let filtered = portfolioItems;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (selectedTag !== 'all') {
      filtered = filtered.filter(item => item.tags.includes(selectedTag));
    }
    
    setFilteredItems(filtered);
  };

  const categories = ['all', ...Array.from(new Set(portfolioItems.map(item => item.category)))];
  const tags = ['all', ...Array.from(new Set(portfolioItems.flatMap(item => item.tags)))];

  const openLightbox = (item: PortfolioItem) => {
    setSelectedItem(item);
    setLightboxOpen(true);
  };

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading portfolio...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Our Portfolio</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of professional photography and videography work across various categories.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <span className="font-medium">Filters:</span>
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map(category => (
                <SelectItem key={category} value={category}>
                  {category === 'all' ? 'All Categories' : category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedTag} onValueChange={setSelectedTag}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Tag" />
            </SelectTrigger>
            <SelectContent>
              {tags.map(tag => (
                <SelectItem key={tag} value={tag}>
                  {tag === 'all' ? 'All Tags' : tag}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedTag('all');
            }}
          >
            Clear Filters
          </Button>
        </div>

        {/* Portfolio Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <Card key={item.id} className="group cursor-pointer overflow-hidden hover:shadow-lg transition-all duration-300">
              <CardContent className="p-0 relative">
                <div className="aspect-square relative overflow-hidden">
                  <Image
                    src={item.imageUrl || '/placeholder-image.jpg'}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  
                  {/* Video Play Button */}
                  {item.videoUrl && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play className="h-12 w-12 text-white" />
                    </div>
                  )}
                  
                  {/* Overlay */}
                  <div
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => openLightbox(item)}
                  >
                    <div className="absolute bottom-4 left-4 right-4 text-white">
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <div className="flex flex-wrap gap-1">
                        <Badge variant="secondary" className="text-xs">
                          {item.category}
                        </Badge>
                        {item.tags.slice(0, 2).map(tag => (
                          <Badge key={tag} variant="outline" className="text-xs text-white border-white">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No items found matching your filters.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('all');
                setSelectedTag('all');
              }}
              className="mt-4"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Lightbox Modal */}
        <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            {selectedItem && (
              <div className="relative">
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
                  onClick={() => setLightboxOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
                
                {selectedItem.videoUrl ? (
                  <video
                    src={selectedItem.videoUrl}
                    controls
                    className="w-full h-auto max-h-[70vh]"
                    autoPlay
                  />
                ) : (
                  <Image
                    src={selectedItem.imageUrl}
                    alt={selectedItem.title}
                    width={800}
                    height={600}
                    className="w-full h-auto max-h-[70vh] object-contain"
                  />
                )}
                
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2">{selectedItem.title}</h2>
                  {selectedItem.caption && (
                    <p className="text-gray-600 mb-4">{selectedItem.caption}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    <Badge>{selectedItem.category}</Badge>
                    {selectedItem.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}