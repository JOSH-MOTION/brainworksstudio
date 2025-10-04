'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import VideoPlayer from '@/components/VideoPlayer';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PortfolioItem } from '@/types';
import { Camera, Plus, Edit, Trash2, Search, Filter, User, Eye, Link as LinkIcon, Download, Lock, Play } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { motion, Variants } from 'framer-motion';
import { memo } from 'react';

// Define types
interface Client {
  id: string;
  displayName: string;
  email: string;
}

// Animation variants
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Component for individual portfolio item card
const PortfolioCard = memo(({
  item,
  clients,
  toggleFeatured,
  copyClientUrl,
  downloadMedia,
  setItemToDelete,
  setDeleteDialogOpen,
  setItemToSetPin,
  setPinDialogOpen,
  previewingId,
  setPreviewingId,
  downloadingId,
  copyingId,
}: {
  item: PortfolioItem;
  clients: { [key: string]: Client };
  toggleFeatured: (item: PortfolioItem) => void;
  copyClientUrl: (item: PortfolioItem) => void;
  downloadMedia: (item: PortfolioItem) => void;
  setItemToDelete: (item: PortfolioItem | null) => void;
  setDeleteDialogOpen: (open: boolean) => void;
  setItemToSetPin: (item: PortfolioItem | null) => void;
  setPinDialogOpen: (open: boolean) => void;
  previewingId: string | null;
  setPreviewingId: (id: string | null) => void;
  downloadingId: string | null;
  copyingId: string | null;
}) => {
  const getVideoThumbnail = (videoUrl: string | null | undefined): string => {
    if (!videoUrl) return '/placeholder-image.jpg';
    if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
      const videoId = videoUrl.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/)?.[1];
      return videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : '/video-placeholder.jpg';
    } else if (videoUrl.includes('vimeo.com')) {
      return '/video-placeholder.jpg';
    } else if (videoUrl.includes('ik.imagekit.io')) {
      return `${videoUrl}?tr=so-0,w-400,h-400,fo-auto`;
    }
    return '/video-placeholder.jpg';
  };

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="group hover:shadow-lg transition-shadow duration-300 border border-gray-200 bg-white rounded-xl overflow-hidden">
        <CardContent className="p-0">
          <div className="relative aspect-square">
            {previewingId === item.id && item.videoUrl ? (
              <VideoPlayer videoSrc={item.videoUrl} onClose={() => setPreviewingId(null)} />
            ) : (
              <Image
                src={item.imageUrls?.[0] || getVideoThumbnail(item.videoUrl) || '/placeholder-image.jpg'}
                alt={item.title || 'Portfolio item'}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                onError={(e) => (e.currentTarget.src = '/placeholder-image.jpg')}
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            {item.featured && (
              <Badge className="absolute top-3 left-3 bg-amber-400 text-black text-xs font-medium">Featured</Badge>
            )}
            {item.pin && (
              <Badge className="absolute top-3 left-20 bg-teal-600 text-white text-xs font-medium">PIN Protected</Badge>
            )}
            {item.videoUrl && previewingId !== item.id && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setPreviewingId(item.id)}
                className="absolute inset-0 m-auto h-12 w-12 bg-teal-600/80 text-white rounded-full hover:bg-teal-700"
                aria-label="Play video"
              >
                <Play className="h-6 w-6" />
              </Button>
            )}
            <div
              className="absolute top-3 right-3 flex gap-1.5 bg-gray-900/80 p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button
                size="icon"
                variant="ghost"
                onClick={() => toggleFeatured(item)}
                className="h-8 w-8 bg-gray-100 hover:bg-amber-400 text-gray-800 rounded-full"
                title={item.featured ? 'Unfeature' : 'Feature'}
                aria-label={item.featured ? 'Unfeature item' : 'Feature item'}
              >
                <Camera className="h-4 w-4" />
              </Button>
              <Link href={`/admin/portfolio/edit/${item.id}`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-gray-100 hover:bg-teal-600 text-gray-800 rounded-full"
                  title="Edit Item"
                  aria-label="Edit portfolio item"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setItemToDelete(item);
                  setDeleteDialogOpen(true);
                }}
                className="h-8 w-8 bg-gray-100 hover:bg-red-600 text-gray-800 rounded-full"
                title="Delete Item"
                aria-label="Delete portfolio item"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
              <Link href={`/client/portfolio/${item.id}`}>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 bg-gray-100 hover:bg-teal-600 text-gray-800 rounded-full"
                  title="View Client Page"
                  aria-label="View client portfolio page"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </Link>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => copyClientUrl(item)}
                disabled={copyingId === item.id}
                className="h-8 w-8 bg-gray-100 hover:bg-teal-600 text-gray-800 rounded-full"
                title="Copy Client URL"
                aria-label="Copy client URL"
              >
                <LinkIcon className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => downloadMedia(item)}
                disabled={downloadingId === item.id || (!item.imageUrls?.length && !item.videoUrl)}
                className="h-8 w-8 bg-gray-100 hover:bg-teal-600 text-gray-800 rounded-full"
                title="Download Media"
                aria-label="Download media"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => {
                  setItemToSetPin(item);
                  setPinDialogOpen(true);
                }}
                className="h-8 w-8 bg-gray-100 hover:bg-teal-600 text-gray-800 rounded-full"
                title="Set PIN"
                aria-label="Set PIN for portfolio item"
              >
                <Lock className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="p-4 space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 truncate">{item.title || 'Untitled'}</h3>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs text-gray-600 border-gray-300">{item.category || 'Uncategorized'}</Badge>
              <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-800">{item.type || 'Unknown'}</Badge>
            </div>
            {(item.clientId && clients[item.clientId]) || item.clientName ? (
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span>{item.clientId && clients[item.clientId] ? clients[item.clientId].displayName || clients[item.clientId].email : item.clientName || 'Unknown Client'}</span>
              </div>
            ) : null}
            {item.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {item.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs bg-teal-100 text-teal-800">{tag}</Badge>
                ))}
                {item.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs bg-teal-100 text-teal-800">+{item.tags.length - 3}</Badge>
                )}
              </div>
            )}
            {item.caption && <p className="text-sm text-gray-600 line-clamp-2">{item.caption}</p>}
            <div className="text-sm text-gray-600 truncate">
              <span className="font-medium">Client URL: </span>
              <a
                href={`/client/portfolio/${item.id}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-teal-600 hover:underline"
              >
                {`/client/portfolio/${item.id}`}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

// Main component
export default function AdminPortfolioPage() {
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [clients, setClients] = useState<{ [key: string]: Client }>({});
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<PortfolioItem | null>(null);
  const [pinDialogOpen, setPinDialogOpen] = useState(false);
  const [itemToSetPin, setItemToSetPin] = useState<PortfolioItem | null>(null);
  const [newPin, setNewPin] = useState('');
  const [pinError, setPinError] = useState('');
  const [copyingId, setCopyingId] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [previewingId, setPreviewingId] = useState<string | null>(null);

  const { user, isAdmin, firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchPortfolioItems();
      fetchClients();
    }
  }, [user, isAdmin, firebaseUser]);

  useEffect(() => {
    filterItems();
  }, [portfolioItems, searchTerm, selectedCategory]);

  const fetchPortfolioItems = async () => {
    try {
      const response = await fetch('/api/portfolio');
      if (response.ok) {
        const data = await response.json();
        setPortfolioItems(data);
      } else {
        throw new Error('Failed to fetch portfolio items');
      }
    } catch (error) {
      console.error('Error fetching portfolio items:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchClients = async () => {
    try {
      const token = await firebaseUser?.getIdToken();
      const response = await fetch('/api/users/clients', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        const clientMap = data.reduce((acc: { [key: string]: Client }, client: Client) => {
          acc[client.id] = client;
          return acc;
        }, {});
        setClients(clientMap);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const filterItems = useCallback(() => {
    let filtered = portfolioItems;
    if (searchTerm) {
      filtered = filtered.filter(
        (item) =>
          item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())) ||
          item.clientName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (item.clientId && clients[item.clientId]?.displayName?.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (item.clientId && clients[item.clientId]?.email?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }
    setFilteredItems(filtered);
  }, [portfolioItems, searchTerm, selectedCategory, clients]);

  const handleDelete = async (item: PortfolioItem) => {
    try {
      const token = await firebaseUser?.getIdToken();
      const response = await fetch(`/api/portfolio/${item.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        setPortfolioItems((prev) => prev.filter((p) => p.id !== item.id));
        setDeleteDialogOpen(false);
        setItemToDelete(null);
        alert('Portfolio item deleted successfully!');
      } else {
        throw new Error('Failed to delete portfolio item');
      }
    } catch (error) {
      console.error('Error deleting portfolio item:', error);
      alert('Failed to delete portfolio item. Please try again.');
    }
  };

  const toggleFeatured = async (item: PortfolioItem) => {
    try {
      const token = await firebaseUser?.getIdToken();
      const formData = new FormData();
      formData.append('featured', String(!item.featured));
      const response = await fetch(`/api/portfolio/${item.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        setPortfolioItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, featured: !p.featured } : p))
        );
      } else {
        throw new Error('Failed to update portfolio item');
      }
    } catch (error) {
      console.error('Error updating portfolio item:', error);
    }
  };

  const copyClientUrl = (item: PortfolioItem) => {
    const url = `${window.location.origin}/client/portfolio/${item.id}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopyingId(item.id);
      setTimeout(() => setCopyingId(null), 2000);
      alert(`Client URL copied: ${url}${item.pin ? `\nPIN: ${item.pin}` : ''}`);
    }).catch((err) => {
      console.error('Failed to copy URL:', err);
      alert('Failed to copy URL. Please try again.');
    });
  };

  const downloadMedia = async (item: PortfolioItem) => {
    setDownloadingId(item.id);
    try {
      if (item.videoUrl) {
        if (item.videoUrl.includes('youtube.com') || item.videoUrl.includes('vimeo.com')) {
          window.open(item.videoUrl, '_blank');
        } else {
          window.location.href = item.videoUrl;
        }
      } else if (item.imageUrls?.length) {
        const zip = new JSZip();
        const folder = zip.folder(item.title || 'portfolio-item');
        for (let i = 0; i < item.imageUrls.length; i++) {
          const url = item.imageUrls[i];
          const response = await fetch(url);
          if (!response.ok) continue;
          const blob = await response.blob();
          const fileName = url.split('/').pop()?.split('?')[0] || `image-${i + 1}.jpg`;
          folder?.file(fileName, blob);
        }
        const content = await zip.generateAsync({ type: 'blob' });
        saveAs(content, `${item.title || 'portfolio-item'}.zip`);
      }
    } catch (error) {
      console.error('Download error:', error);
      alert('Failed to download media. Please try again.');
    } finally {
      setDownloadingId(null);
    }
  };

  const setPin = async () => {
    if (!itemToSetPin) return;
    if (!newPin || newPin.length < 4) {
      setPinError('PIN must be at least 4 characters');
      return;
    }
    try {
      const token = await firebaseUser?.getIdToken();
      const formData = new FormData();
      formData.append('pin', newPin);
      const response = await fetch(`/api/portfolio/${itemToSetPin.id}`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (response.ok) {
        setPortfolioItems((prev) =>
          prev.map((p) => (p.id === itemToSetPin.id ? { ...p, pin: newPin } : p))
        );
        setPinDialogOpen(false);
        setItemToSetPin(null);
        setNewPin('');
        setPinError('');
        alert('PIN set successfully!');
      } else {
        throw new Error('Failed to set PIN');
      }
    } catch (error) {
      console.error('Error setting PIN:', error);
      setPinError('Failed to set PIN. Please try again.');
    }
  };

  const categories = ['all', ...Array.from(new Set(portfolioItems.map((item) => item.category).filter((cat): cat is string => !!cat)))];

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-teal-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 text-sm font-medium">Loading portfolio...</p>
          </div>
          </div>
        </AdminLayout>
      );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <AdminLayout>
      <section className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Portfolio Management</h1>
            <p className="text-sm text-gray-600 mt-1">Manage your studio's portfolio items efficiently</p>
          </div>
          <Link href="/admin/portfolio/upload">
            <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 text-sm flex items-center">
              <Plus className="h-4 w-4 mr-2" />
              Add New Item
            </Button>
          </Link>
        </div>

        <Card className="mb-6 border-gray-200 shadow-sm rounded-xl">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-4 w-4" />
                <Input
                  placeholder="Search by title, category, tags, or client..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-300 focus:ring-teal-600 text-sm rounded-lg"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full sm:w-48 border-gray-300 focus:ring-teal-600 text-sm rounded-lg">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category === 'all' ? 'All Categories' : category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item) => (
            <PortfolioCard
              key={item.id}
              item={item}
              clients={clients}
              toggleFeatured={toggleFeatured}
              copyClientUrl={copyClientUrl}
              downloadMedia={downloadMedia}
              setItemToDelete={setItemToDelete}
              setDeleteDialogOpen={setDeleteDialogOpen}
              setItemToSetPin={setItemToSetPin}
              setPinDialogOpen={setPinDialogOpen}
              previewingId={previewingId}
              setPreviewingId={setPreviewingId}
              downloadingId={downloadingId}
              copyingId={copyingId}
            />
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <Camera className="h-12 w-12 text-gray-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No portfolio items found</h3>
            <p className="text-gray-600 text-sm mb-4">
              {portfolioItems.length === 0
                ? 'Start by uploading your first portfolio item!'
                : 'Try adjusting your search or filter criteria.'}
            </p>
            <Link href="/admin/portfolio/upload">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white rounded-lg px-4 py-2 text-sm flex items-center">
                <Plus className="h-4 w-4 mr-2" />
                Upload Portfolio Item
              </Button>
            </Link>
          </div>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent className="bg-white rounded-xl">
            <DialogHeader>
              <DialogTitle>Delete Portfolio Item</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <p className="text-gray-600 text-sm">
                Are you sure you want to delete "{itemToDelete?.title || 'Untitled'}"? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={() => itemToDelete && handleDelete(itemToDelete)}
                className="bg-red-600 hover:bg-red-700 rounded-lg text-sm"
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        <Dialog open={pinDialogOpen} onOpenChange={setPinDialogOpen}>
          <DialogContent className="bg-white rounded-xl">
            <DialogHeader>
              <DialogTitle>Set PIN for {itemToSetPin?.title || 'Untitled'}</DialogTitle>
            </DialogHeader>
            <div className="py-4">
              <Input
                type="text"
                placeholder="Enter PIN (at least 4 characters)"
                value={newPin}
                onChange={(e) => setNewPin(e.target.value)}
                className="border-gray-300 focus:ring-teal-600 text-sm rounded-lg mb-4"
              />
              {pinError && <p className="text-red-600 text-sm mb-4">{pinError}</p>}
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setPinDialogOpen(false);
                  setItemToSetPin(null);
                  setNewPin('');
                  setPinError('');
                }}
                className="border-gray-300 text-gray-600 hover:bg-gray-100 rounded-lg text-sm"
              >
                Cancel
              </Button>
              <Button
                onClick={setPin}
                className="bg-teal-600 text-white hover:bg-teal-700 rounded-lg text-sm"
              >
                Save PIN
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </AdminLayout>
  );
}