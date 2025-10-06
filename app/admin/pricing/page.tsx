// app/admin/pricing/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Edit, Trash2, Star, DollarSign } from 'lucide-react';

interface RateCard {
  id?: string;
  category: string;
  serviceName: string;
  description: string;
  price: string;
  duration?: string;
  includes: string[];
  featured: boolean;
  order: number;
}

const photographyCategories = [
  'Corporate', 'Event', 'Portrait', 'Fashion', 'Product', 'Travel & Landscape',
  'Documentary & Lifestyle', 'Creative/Artistic', 'Others'
];
const videographyCategories = [
  'Corporate', 'Event', 'Music Videos', 'Commercials & Adverts', 'Documentary',
  'Short Films / Creative Projects', 'Promotional', 'Social Media', 'Others'
];
const serviceCategories = Array.from(new Set([...photographyCategories, ...videographyCategories]));

export default function AdminPricingPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<RateCard | null>(null);

  const [formData, setFormData] = useState({
    category: '',
    serviceName: '',
    description: '',
    price: '',
    duration: '',
    includes: '',
    featured: false,
    order: 0,
  });

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchRateCards();
    }
  }, [user, isAdmin]);

  const fetchRateCards = async () => {
    try {
      const response = await fetch('/api/rate-cards');
      if (response.ok) {
        const data = await response.json();
        setRateCards(data);
      } else {
        console.error('Failed to fetch rate cards:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching rate cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const url = editingCard?.id ? `/api/rate-cards/${editingCard.id}` : '/api/rate-cards';
      const method = editingCard?.id ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          includes: formData.includes.split('\n').filter((item) => item.trim()),
          order: parseInt(formData.order.toString()) || 0,
        }),
      });

      if (response.ok) {
        alert(editingCard ? 'Rate card updated successfully' : 'Rate card created successfully');
        setDialogOpen(false);
        resetForm();
        fetchRateCards();
      } else {
        alert('Failed to save rate card');
      }
    } catch (error) {
      console.error('Error saving rate card:', error);
      alert('An error occurred');
    }
  };

  const handleDelete = async (id: string) => {
    if (!firebaseUser || !confirm('Are you sure you want to delete this rate card?')) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/rate-cards/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Rate card deleted successfully');
        fetchRateCards();
      } else {
        alert('Failed to delete rate card');
      }
    } catch (error) {
      console.error('Error deleting rate card:', error);
      alert('An error occurred');
    }
  };

  const handleEdit = (card: RateCard) => {
    setEditingCard(card);
    setFormData({
      category: card.category,
      serviceName: card.serviceName,
      description: card.description,
      price: card.price,
      duration: card.duration || '',
      includes: card.includes.join('\n'),
      featured: card.featured,
      order: card.order,
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      category: '',
      serviceName: '',
      description: '',
      price: '',
      duration: '',
      includes: '',
      featured: false,
      order: 0,
    });
    setEditingCard(null);
  };

  if (authLoading || loading) {
    return (
   
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading pricing...</p>
          </div>
        </div>
     
    );
  }

  if (!user || !isAdmin) return null;

  return (
    
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Pricing Management</h1>
            <p className="text-gray-600">Manage service rate cards and pricing packages</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={(open) => {
            setDialogOpen(open);
            if (!open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-teal-500 hover:bg-teal-600">
                <Plus className="h-4 w-4 mr-2" />
                New Rate Card
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingCard ? 'Edit Rate Card' : 'Create New Rate Card'}</DialogTitle>
                <DialogDescription>
                  {editingCard ? 'Update rate card details' : 'Add a new service pricing option'}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="border-gray-300 focus:ring-teal-500">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Service Name</Label>
                  <Input
                    value={formData.serviceName}
                    onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
                    placeholder="e.g., Corporate Video Production"
                    className="border-gray-300 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <Label>Description</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Brief description of the service"
                    rows={2}
                    className="border-gray-300 focus:ring-teal-500"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price</Label>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      placeholder="e.g., GH₵ 1,500"
                      className="border-gray-300 focus:ring-teal-500"
                    />
                  </div>
                  <div>
                    <Label>Duration (optional)</Label>
                    <Input
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 3 hours"
                      className="border-gray-300 focus:ring-teal-500"
                    />
                  </div>
                </div>
                <div>
                  <Label>What's Included (one per line)</Label>
                  <Textarea
                    value={formData.includes}
                    onChange={(e) => setFormData({ ...formData, includes: e.target.value })}
                    placeholder="Up to 100 edited photos\nOnline gallery\nHigh-resolution downloads"
                    rows={6}
                    className="border-gray-300 focus:ring-teal-500"
                  />
                </div>
                <div>
                  <Label>Display Order</Label>
                  <Input
                    type="number"
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 0 })}
                    placeholder="1"
                    className="border-gray-300 focus:ring-teal-500"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={formData.featured}
                    onCheckedChange={(checked) => setFormData({ ...formData, featured: checked })}
                  />
                  <Label>Mark as Featured/Popular</Label>
                </div>
                <Button
                  onClick={handleSubmit}
                  className="w-full bg-teal-500 hover:bg-teal-600"
                >
                  {editingCard ? 'Update Rate Card' : 'Create Rate Card'}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rateCards.map((card) => (
            <Card
              key={card.id || card.serviceName}
              className={card.featured ? 'border-2 border-teal-500' : 'border-gray-200'}
            >
              <CardHeader>
                <div className="flex justify-between items-start mb-2">
                  <Badge variant="outline" className="text-xs border-teal-300 text-teal-600">
                    {card.category}
                  </Badge>
                  {card.featured && (
                    <Badge className="bg-teal-100 text-teal-700 flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      Featured
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-lg text-gray-900">{card.serviceName}</CardTitle>
                <CardDescription>{card.description}</CardDescription>
                <div className="mt-3 flex items-baseline gap-2">
                  <DollarSign className="h-4 w-4 text-teal-500" />
                  <span className="text-2xl font-bold text-teal-500">{card.price}</span>
                </div>
                {card.duration && (
                  <p className="text-sm text-gray-500 mt-1">{card.duration}</p>
                )}
              </CardHeader>
              <CardContent>
                <div className="space-y-2 mb-4">
                  <p className="text-sm font-semibold text-gray-700">Includes:</p>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {card.includes.map((item, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-teal-500">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 border-teal-300 text-teal-500 hover:bg-teal-50"
                    onClick={() => handleEdit(card)}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  {card.id && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-red-600 hover:bg-red-50 border-red-300"
                      onClick={() => handleDelete(card.id!)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    
  );
}