// app/admin/pricing-categories/page.tsx
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
  Plus, Edit, Trash2, Star, X, ChevronDown, ChevronUp, Image as ImageIcon, 
  Package, Check, ArrowUp, ArrowDown 
} from 'lucide-react';

interface PricingPackage {
  name: string;
  price: string;
  duration?: string;
  description: string;
  includes: string[];
  featured: boolean;
  order: number;
}

interface PricingCategory {
  id?: string;
  name: string;
  slug: string;
  description: string;
  longDescription: string;
  imageUrl: string;
  published: boolean;
  order: number;
  packages: PricingPackage[];
  createdAt?: string;
  updatedAt?: string;
}

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

export default function AdminPricingCategoriesPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [categories, setCategories] = useState<PricingCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [packageDialogOpen, setPackageDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<PricingCategory | null>(null);
  const [editingPackage, setEditingPackage] = useState<{ categoryId: string; packageIndex: number; package: PricingPackage } | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [includesInputs, setIncludesInputs] = useState<string[]>(['']);

  const [categoryForm, setCategoryForm] = useState({
    name: '',
    slug: '',
    description: '',
    longDescription: '',
    imageUrl: '',
    published: true,
    order: 0,
  });

  const [uploadingImage, setUploadingImage] = useState(false);
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');


  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  

  const [packageForm, setPackageForm] = useState({
    name: '',
    price: '',
    duration: '',
    description: '',
    featured: false,
    order: 0,
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('');

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchCategories();
    }
  }, [user, isAdmin]);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/pricing-categories');
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      } else {
        console.error('Failed to fetch categories:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const handleImageFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    const MAX_SIZE = 25 * 1024 * 1024; // 25MB
    if (file.size > MAX_SIZE) {
      alert(`File size ${(file.size / 1024 / 1024).toFixed(2)}MB exceeds 25MB limit`);
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Please select a valid image file (JPEG, PNG, or WebP)');
      return;
    }

    setSelectedImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const uploadImageToImageKit = async (file: File): Promise<string | null> => {
    if (!firebaseUser) return null;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('fileName', `pricing-category-${Date.now()}-${file.name}`);
      formData.append('folder', '/pricing-categories');

      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data.url;
      } else {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(`Failed to upload image: ${error.message}`);
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCreateCategory = async () => {
    if (!firebaseUser || !categoryForm.name) {
      alert('Please provide a category name');
      return;
    }

    try {
      // Upload image first if file is selected
      let imageUrl = categoryForm.imageUrl;
      if (selectedImageFile) {
        const uploadedUrl = await uploadImageToImageKit(selectedImageFile);
        if (!uploadedUrl) {
          alert('Image upload failed. Please try again.');
          return;
        }
        imageUrl = uploadedUrl;
      }

      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/pricing-categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...categoryForm,
          imageUrl,
          slug: categoryForm.slug || generateSlug(categoryForm.name),
        }),
      });

      if (response.ok) {
        alert('Category created successfully');
        setCategoryDialogOpen(false);
        resetCategoryForm();
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create category');
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('An error occurred');
    }
  };

  const handleUpdateCategory = async () => {
    if (!firebaseUser || !editingCategory?.id) return;

    try {
      // Upload new image if file is selected
      let imageUrl = categoryForm.imageUrl;
      if (selectedImageFile) {
        const uploadedUrl = await uploadImageToImageKit(selectedImageFile);
        if (!uploadedUrl) {
          alert('Image upload failed. Please try again.');
          return;
        }
        imageUrl = uploadedUrl;
      }

      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/pricing-categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...categoryForm,
          imageUrl,
          packages: editingCategory.packages, // Keep existing packages
        }),
      });

      if (response.ok) {
        alert('Category updated successfully');
        setCategoryDialogOpen(false);
        resetCategoryForm();
        setEditingCategory(null);
        fetchCategories();
      } else {
        alert('Failed to update category');
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('An error occurred');
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!firebaseUser || !confirm('Are you sure you want to delete this category? This will also delete all packages inside it.')) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/pricing-categories/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Category deleted successfully');
        fetchCategories();
      } else {
        alert('Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('An error occurred');
    }
  };

  const handleAddPackage = async () => {
    if (!firebaseUser || !selectedCategoryId || !packageForm.name) return;

    const category = categories.find(c => c.id === selectedCategoryId);
    if (!category) return;

    const newPackage: PricingPackage = {
      ...packageForm,
      price: formatGHS(packageForm.price),
      includes: includesInputs.filter(item => item.trim()),
      order: packageForm.order || (category.packages?.length || 0),
    };

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/pricing-categories/${selectedCategoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packages: [...(category.packages || []), newPackage],
        }),
      });

      if (response.ok) {
        alert('Package added successfully');
        setPackageDialogOpen(false);
        resetPackageForm();
        fetchCategories();
      } else {
        alert('Failed to add package');
      }
    } catch (error) {
      console.error('Error adding package:', error);
      alert('An error occurred');
    }
  };

  const handleUpdatePackage = async () => {
    if (!firebaseUser || !editingPackage) return;

    const category = categories.find(c => c.id === editingPackage.categoryId);
    if (!category) return;

    const updatedPackages = [...(category.packages || [])];
    updatedPackages[editingPackage.packageIndex] = {
      ...packageForm,
      price: formatGHS(packageForm.price),
      includes: includesInputs.filter(item => item.trim()),
      order: packageForm.order,
    };

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/pricing-categories/${editingPackage.categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packages: updatedPackages,
        }),
      });

      if (response.ok) {
        alert('Package updated successfully');
        setPackageDialogOpen(false);
        resetPackageForm();
        setEditingPackage(null);
        fetchCategories();
      } else {
        alert('Failed to update package');
      }
    } catch (error) {
      console.error('Error updating package:', error);
      alert('An error occurred');
    }
  };

  const handleDeletePackage = async (categoryId: string, packageIndex: number) => {
    if (!firebaseUser || !confirm('Are you sure you want to delete this package?')) return;

    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const updatedPackages = (category.packages || []).filter((_, index) => index !== packageIndex);

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/pricing-categories/${categoryId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          packages: updatedPackages,
        }),
      });

      if (response.ok) {
        alert('Package deleted successfully');
        fetchCategories();
      } else {
        alert('Failed to delete package');
      }
    } catch (error) {
      console.error('Error deleting package:', error);
      alert('An error occurred');
    }
  };

  const handleEditCategory = (category: PricingCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      longDescription: category.longDescription,
      imageUrl: category.imageUrl,
      published: category.published,
      order: category.order,
    });
    // Set existing image as preview
    if (category.imageUrl) {
      setImagePreview(category.imageUrl);
    }
    setCategoryDialogOpen(true);
  };

  const handleEditPackage = (categoryId: string, packageIndex: number, pkg: PricingPackage) => {
    setSelectedCategoryId(categoryId);
    setEditingPackage({ categoryId, packageIndex, package: pkg });
    setPackageForm({
      name: pkg.name,
      price: parseGHS(pkg.price),
      duration: pkg.duration || '',
      description: pkg.description,
      featured: pkg.featured,
      order: pkg.order,
    });
    setIncludesInputs(pkg.includes.length > 0 ? pkg.includes : ['']);
    setPackageDialogOpen(true);
  };

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      slug: '',
      description: '',
      longDescription: '',
      imageUrl: '',
      published: true,
      order: 0,
    });
    setEditingCategory(null);
    setSelectedImageFile(null);
    setImagePreview('');
  };

  const resetPackageForm = () => {
    setPackageForm({
      name: '',
      price: '',
      duration: '',
      description: '',
      featured: false,
      order: 0,
    });
    setIncludesInputs(['']);
    setEditingPackage(null);
    setSelectedCategoryId('');
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

  const toggleCategoryExpanded = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading pricing categories...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Pricing Categories & Packages</h1>
          <p className="text-gray-600">Manage service categories and their pricing packages</p>
        </div>
        <Dialog open={categoryDialogOpen} onOpenChange={(open) => {
          setCategoryDialogOpen(open);
          if (!open) resetCategoryForm();
        }}>
          <DialogTrigger asChild>
            <Button className="bg-teal-500 hover:bg-teal-600">
              <Plus className="h-4 w-4 mr-2" />
              New Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Create New Category'}</DialogTitle>
              <DialogDescription>
                {editingCategory ? 'Update category details' : 'Add a new service category'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Category Name</Label>
                <Input
                  value={categoryForm.name}
                  onChange={(e) => {
                    setCategoryForm({ ...categoryForm, name: e.target.value });
                    if (!editingCategory) {
                      setCategoryForm(prev => ({ ...prev, slug: generateSlug(e.target.value) }));
                    }
                  }}
                  placeholder="e.g., Wedding, Engagement, Corporate Events"
                  className="border-gray-300 focus:ring-teal-500"
                />
              </div>

              <div>
                <Label>URL Slug</Label>
                <Input
                  value={categoryForm.slug}
                  onChange={(e) => setCategoryForm({ ...categoryForm, slug: generateSlug(e.target.value) })}
                  placeholder="wedding-photography"
                  className="border-gray-300 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">Will appear in URL: /pricing/{categoryForm.slug || 'category-slug'}</p>
              </div>

              <div>
                <Label>Short Description</Label>
                <Textarea
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Brief tagline for the category"
                  rows={2}
                  className="border-gray-300 focus:ring-teal-500"
                />
              </div>

              <div>
                <Label>Long Description (Optional)</Label>
                <Textarea
                  value={categoryForm.longDescription}
                  onChange={(e) => setCategoryForm({ ...categoryForm, longDescription: e.target.value })}
                  placeholder="Detailed description of what this category offers"
                  rows={4}
                  className="border-gray-300 focus:ring-teal-500"
                />
              </div>

              <div>
                <Label>Category Image</Label>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <label className="flex-1">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-teal-500 cursor-pointer transition-colors">
                        <input
                          type="file"
                          accept="image/jpeg,image/jpg,image/png,image/webp"
                          onChange={handleImageFileSelect}
                          className="hidden"
                        />
                        <div className="flex items-center justify-center gap-2 text-gray-600">
                          <ImageIcon className="h-5 w-5" />
                          <span className="text-sm">
                            {selectedImageFile ? selectedImageFile.name : 'Click to upload image'}
                          </span>
                        </div>
                      </div>
                    </label>
                  </div>
                  
                  {imagePreview && (
                    <div className="relative">
                      <img 
                        src={imagePreview} 
                        alt="Preview" 
                        className="h-40 w-full object-cover rounded-lg border border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedImageFile(null);
                          setImagePreview('');
                        }}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  
                  <p className="text-xs text-gray-500">
                    Recommended: 1200x600px or larger. Max size: 25MB. Formats: JPEG, PNG, WebP
                  </p>
                </div>
              </div>

              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={categoryForm.order}
                  onChange={(e) => setCategoryForm({ ...categoryForm, order: parseInt(e.target.value) || 0 })}
                  placeholder="0"
                  className="border-gray-300 focus:ring-teal-500"
                />
                <p className="text-xs text-gray-500 mt-1">Lower numbers appear first</p>
              </div>

              <div className="flex items-center gap-2">
                <Switch
                  checked={categoryForm.published}
                  onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, published: checked })}
                />
                <Label>Published (visible to public)</Label>
              </div>

              <Button
                onClick={editingCategory ? handleUpdateCategory : handleCreateCategory}
                disabled={uploadingImage}
                className="w-full bg-teal-500 hover:bg-teal-600"
              >
                {uploadingImage ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Uploading Image...
                  </>
                ) : (
                  editingCategory ? 'Update Category' : 'Create Category'
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        {categories.map((category) => (
          <Card key={category.id} className="border-gray-200">
            <CardHeader className="cursor-pointer" onClick={() => toggleCategoryExpanded(category.id!)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  {category.imageUrl && (
                    <img 
                      src={category.imageUrl} 
                      alt={category.name}
                      className="h-16 w-16 object-cover rounded-lg"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  )}
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <CardTitle className="text-xl text-gray-900">{category.name}</CardTitle>
                      {!category.published && (
                        <Badge variant="outline" className="text-xs">Draft</Badge>
                      )}
                      <Badge variant="outline" className="text-xs">Order: {category.order}</Badge>
                      <Badge className="bg-teal-100 text-teal-700">
                        {category.packages?.length || 0} packages
                      </Badge>
                    </div>
                    <CardDescription>{category.description}</CardDescription>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-teal-300 text-teal-500 hover:bg-teal-50"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditCategory(category);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 hover:bg-red-50 border-red-300"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCategory(category.id!);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {expandedCategories.has(category.id!) ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </div>
              </div>
            </CardHeader>

            {expandedCategories.has(category.id!) && (
              <CardContent>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900">Packages</h3>
                    <Dialog 
                      open={packageDialogOpen && (selectedCategoryId === category.id || editingPackage?.categoryId === category.id)} 
                      onOpenChange={(open) => {
                        if (selectedCategoryId === category.id || editingPackage?.categoryId === category.id) {
                          setPackageDialogOpen(open);
                          if (!open) {
                            resetPackageForm();
                          }
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button 
                          size="sm"
                          className="bg-teal-500 hover:bg-coral-600"
                          onClick={() => {
                            setSelectedCategoryId(category.id!);
                            setEditingPackage(null);
                            resetPackageForm();
                          }}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add Package
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                          <DialogTitle>{editingPackage ? 'Edit Package' : 'Add New Package'}</DialogTitle>
                          <DialogDescription>
                            {editingPackage ? 'Update package details' : `Add a pricing package to ${category.name}`}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Package Name</Label>
                            <Input
                              value={packageForm.name}
                              onChange={(e) => setPackageForm({ ...packageForm, name: e.target.value })}
                              placeholder="e.g., Silver Package, Gold Package"
                              className="border-gray-300 focus:ring-teal-500"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label>Price (GHS)</Label>
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₵</span>
                                <Input
                                  value={packageForm.price}
                                  onChange={(e) => setPackageForm({ ...packageForm, price: parseGHS(e.target.value) })}
                                  placeholder="1500"
                                  className="border-gray-300 focus:ring-teal-500 pl-8"
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Duration (optional)</Label>
                              <Input
                                value={packageForm.duration}
                                onChange={(e) => setPackageForm({ ...packageForm, duration: e.target.value })}
                                placeholder="e.g., 3 hours, Full day"
                                className="border-gray-300 focus:ring-teal-500"
                              />
                            </div>
                          </div>

                          <div>
                            <Label>Description</Label>
                            <Textarea
                              value={packageForm.description}
                              onChange={(e) => setPackageForm({ ...packageForm, description: e.target.value })}
                              placeholder="Brief description of the package"
                              rows={2}
                              className="border-gray-300 focus:ring-teal-500"
                            />
                          </div>

                          <div>
                            <Label>What&apos;s Included</Label>
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
                                className="border-teal-300 text-teal-500 hover:bg-teal-50 mt-2"
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
                              value={packageForm.order}
                              onChange={(e) => setPackageForm({ ...packageForm, order: parseInt(e.target.value) || 0 })}
                              placeholder="0"
                              className="border-gray-300 focus:ring-teal-500"
                            />
                          </div>

                          <div className="flex items-center gap-2">
                            <Switch
                              checked={packageForm.featured}
                              onCheckedChange={(checked) => setPackageForm({ ...packageForm, featured: checked })}
                            />
                            <Label>Mark as Featured/Popular</Label>
                          </div>

                          <Button
                            onClick={editingPackage ? handleUpdatePackage : handleAddPackage}
                            className="w-full bg-teal-500 hover:bg-teal-600"
                          >
                            {editingPackage ? 'Update Package' : 'Add Package'}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>

                  {category.packages && category.packages.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {category.packages.map((pkg, index) => (
                        <Card key={index} className={pkg.featured ? 'border-2 border-coral-500' : 'border-gray-200'}>
                          <CardHeader>
                            <div className="flex justify-between items-start mb-2">
                              <CardTitle className="text-lg text-gray-900">{pkg.name}</CardTitle>
                              {pkg.featured && (
                                <Badge className="bg-coral-100 text-coral-700 flex items-center gap-1">
                                  <Star className="h-3 w-3" />
                                  Featured
                                </Badge>
                              )}
                            </div>
                            <CardDescription>{pkg.description}</CardDescription>
                            <div className="mt-3 flex items-baseline gap-2">
                              <span className="text-2xl font-bold text-coral-600">{pkg.price}</span>
                            </div>
                            {pkg.duration && (
                              <p className="text-sm text-gray-500 mt-1">{pkg.duration}</p>
                            )}
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-2 mb-4">
                              <p className="text-sm font-semibold text-gray-700">Includes:</p>
                              <ul className="text-sm text-gray-600 space-y-1">
                                {pkg.includes.map((item, i) => (
                                  <li key={i} className="flex items-start gap-2">
                                    <Check className="h-4 w-4 text-green-600 flex-shrink-0 mt-0.5" />
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
                                onClick={() => handleEditPackage(category.id!, index, pkg)}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="text-red-600 hover:bg-red-50 border-red-300"
                                onClick={() => handleDeletePackage(category.id!, index)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                      <Package className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-600 mb-2">No packages yet</p>
                      <p className="text-sm text-gray-500 mb-4">Add your first pricing package to this category</p>
                      <Button
                        size="sm"
                        className="bg-coral-500 hover:bg-coral-600"
                        onClick={() => {
                          setSelectedCategoryId(category.id!);
                          setEditingPackage(null);
                          resetPackageForm();
                          setPackageDialogOpen(true);
                        }}
                      >
                        <Plus className="h-4 w-4 mr-1" />
                        Add First Package
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        {categories.length === 0 && (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="text-center py-12">
              <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No categories yet</h3>
              <p className="text-gray-600 mb-4">Create your first pricing category to get started</p>
              <Button
                className="bg-teal-500 hover:bg-teal-600"
                onClick={() => setCategoryDialogOpen(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create First Category
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}