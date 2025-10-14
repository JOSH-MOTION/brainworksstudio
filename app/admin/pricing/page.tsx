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
import { Plus, Edit, Trash2, Star, X, Camera, Video, Zap } from 'lucide-react';

interface RateCard {
  id?: string;
  serviceType: 'photography' | 'videography' | 'both';
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

const combinedCategories = [
  'Wedding', 'Corporate Event', 'Brand Campaign', 'Real Estate', 'Fashion Show',
  'Product Launch', 'Conference', 'Workshop'
];

// Combine all categories for selection
const allCategories = Array.from(new Set([
  ...photographyCategories,
  ...videographyCategories,
  ...combinedCategories
]));

const serviceTypes = [
  { value: 'photography', label: 'Photography', icon: Camera },
  { value: 'videography', label: 'Videography', icon: Video },
  { value: 'both', label: 'Photography & Videography', icon: Zap }
];

const MAX_INCLUDES = 17;

const formatGHS = (value: string): string => {
  const numericValue = value.replace(/[^0-9.]/g, '');
  const number = parseFloat(numericValue);
  if (isNaN(number)) return '';
  return `₵${number.toLocaleString('en-GH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const parseGHS = (value: string): string => {
  return value.replace(/[^0-9.]/g, '');
};

export default function AdminPricingPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [rateCards, setRateCards] = useState<RateCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<RateCard | null>(null);
  const [includesInputs, setIncludesInputs] = useState<string[]>(['']);
  const [selectedServiceType, setSelectedServiceType] = useState<'photography' | 'videography' | 'both'>('photography');
  const [filterServiceType, setFilterServiceType] = useState<'all' | 'photography' | 'videography' | 'both'>('all');

  const [formData, setFormData] = useState({
    serviceType: 'photography' as 'photography' | 'videography' | 'both',
    category: '',
    serviceName: '',
    description: '',
    price: '',
    duration: '',
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

  const handleServiceTypeChange = (type: 'photography' | 'videography' | 'both') => {
    setSelectedServiceType(type);
    setFormData({ ...formData, serviceType: type });
    // Reset category when service type changes
    setFormData({ ...formData, serviceType: type, category: '' });
  };

  const getFilteredCategories = () => {
    switch (selectedServiceType) {
      case 'photography':
        return photographyCategories;
      case 'videography':
        return videographyCategories;
      case 'both':
        return combinedCategories;
      default:
        return allCategories;
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
          price: formatGHS(formData.price),
          includes: includesInputs.filter((item) => item.trim()),
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
    setSelectedServiceType(card.serviceType);
    setFormData({
      serviceType: card.serviceType,
      category: card.category,
      serviceName: card.serviceName,
      description: card.description,
      price: parseGHS(card.price),
      duration: card.duration || '',
      featured: card.featured,
      order: card.order,
    });
    setIncludesInputs(card.includes.length > 0 ? card.includes : ['']);
    setDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      serviceType: 'photography',
      category: '',
      serviceName: '',
      description: '',
      price: '',
      duration: '',
      featured: false,
      order: 0,
    });
    setIncludesInputs(['']);
    setSelectedServiceType('photography');
    setEditingCard(null);
  };

  const handleAddInclude = () => {
    if (includesInputs.length < MAX_INCLUDES) {
      setIncludesInputs([...includesInputs, '']);
    }
  };

  const handleRemoveInclude = (index: number) => {
    setIncludesInputs(includesInputs.filter((_, i) => i !== index));
  };

  const handleIncludeChange = (index: number, value: string) => {
    const newIncludes = [...includesInputs];
    newIncludes[index] = value;
    setIncludesInputs(newIncludes);
  };

  const getServiceTypeIcon = (type: string) => {
    const serviceType = serviceTypes.find(st => st.value === type);
    const IconComponent = serviceType?.icon || Camera;
    return <IconComponent className="h-4 w-4" />;
  };

  const getServiceTypeColor = (type: string) => {
    switch (type) {
      case 'photography':
        return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'videography':
        return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'both':
        return 'bg-amber-100 text-amber-700 border-amber-300';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const filteredRateCards = filterServiceType === 'all' 
    ? rateCards 
    : rateCards.filter(card => card.serviceType === filterServiceType);

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
          <p className="text-gray-600">Manage service rate cards by photography, videography, or combined packages</p>
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
              {/* Service Type Selection */}
              <div>
                <Label>Service Type</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {serviceTypes.map((type) => (
                    <Button
                      key={type.value}
                      type="button"
                      variant={selectedServiceType === type.value ? "default" : "outline"}
                      className={`flex items-center gap-2 ${
                        selectedServiceType === type.value 
                          ? 'bg-teal-500 text-white' 
                          : 'border-gray-300'
                      }`}
                      onClick={() => handleServiceTypeChange(type.value as any)}
                    >
                      <type.icon className="h-4 w-4" />
                      {type.label}
                    </Button>
                  ))}
                </div>
              </div>

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
                    {getFilteredCategories().map((category) => (
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
                  <Label>Price (GHS)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₵</span>
                    <Input
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseGHS(e.target.value) })}
                      placeholder="1500"
                      className="border-gray-300 focus:ring-teal-500 pl-8"
                    />
                  </div>
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
                <Label>What's Included</Label>
                {includesInputs.map((include, index) => (
                  <div key={index} className="flex items-center gap-2 mb-2">
                    <Input
                      value={include}
                      onChange={(e) => handleIncludeChange(index, e.target.value)}
                      placeholder={`Feature ${index + 1}`}
                      className="border-gray-300 focus:ring-teal-500"
                    />
                    {includesInputs.length > 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-300 text-red-600 hover:bg-red-50"
                        onClick={() => handleRemoveInclude(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                ))}
                {includesInputs.length < MAX_INCLUDES && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal-300 text-teal-500 hover:bg-teal-50"
                    onClick={handleAddInclude}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Feature
                  </Button>
                )}
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

      {/* Service Type Filter */}
      <div className="flex gap-2 mb-6">
        <Badge
          variant={filterServiceType === 'all' ? 'default' : 'outline'}
          className="cursor-pointer px-4 py-2"
          onClick={() => setFilterServiceType('all')}
        >
          All Services
        </Badge>
        {serviceTypes.map((type) => (
          <Badge
            key={type.value}
            variant={filterServiceType === type.value ? 'default' : 'outline'}
            className={`cursor-pointer px-4 py-2 flex items-center gap-2 ${getServiceTypeColor(type.value)}`}
            onClick={() => setFilterServiceType(type.value as any)}
          >
            <type.icon className="h-3 w-3" />
            {type.label}
          </Badge>
        ))}
      </div>

      {/* Rate Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredRateCards.map((card) => (
          <Card
            key={card.id || card.serviceName}
            className={card.featured ? 'border-2 border-teal-500' : 'border-gray-200'}
          >
            <CardHeader>
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <Badge className={`text-xs border ${getServiceTypeColor(card.serviceType)} flex items-center gap-1`}>
                    {getServiceTypeIcon(card.serviceType)}
                    {card.serviceType.charAt(0).toUpperCase() + card.serviceType.slice(1)}
                  </Badge>
                  <Badge variant="outline" className="text-xs border-teal-300 text-teal-600">
                    {card.category}
                  </Badge>
                </div>
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
                <span className="text-2xl font-bold text-teal-500">{card.price}</span>
              </div>
              {card.duration && (
                <p className="text-sm text-gray-500 mt-1">{card.duration}</p>
              )}
            </CardHeader>
            <CardContent>
              <div className="space-y-2 mb-4">
                <p className="text-sm font-semibold text-gray-700">Includes:</p>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  {card.includes.map((item, index) => (
                    <li key={index}>{item}</li>
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