// app/admin/reviews/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star, Trash2, Mail, Copy, MessageSquare } from 'lucide-react';
import Image from 'next/image';

const photographyCategories = [
  'Corporate', 'Event', 'Portrait', 'Fashion', 'Product', 'Travel & Landscape',
  'Documentary & Lifestyle', 'Creative/Artistic', 'Others'
];
const videographyCategories = [
  'Corporate', 'Event', 'Music Videos', 'Commercials & Adverts', 'Documentary',
  'Short Films / Creative Projects', 'Promotional', 'Social Media', 'Others'
];
const serviceCategories = Array.from(new Set([...photographyCategories, ...videographyCategories]));

interface Review {
  id: string;
  clientName: string;
  clientEmail: string;
  clientImage?: string;
  rating: number;
  reviewText: string;
  serviceType: string;
  featured: boolean;
  approved: boolean;
  createdAt: string;
  adminResponse?: string;
}

export default function AdminReviewsPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [responseInputs, setResponseInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchReviews();
    }
  }, [user, isAdmin]);

  const fetchReviews = async () => {
    try {
      const response = await fetch('/api/reviews');
      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Failed to fetch reviews:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (id: string, updates: Partial<Review>) => {
    if (!firebaseUser) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        alert('Review updated successfully');
        fetchReviews();
        if (updates.adminResponse) {
          setResponseInputs((prev) => ({ ...prev, [id]: '' }));
        }
      } else {
        alert('Failed to update review');
      }
    } catch (error) {
      console.error('Error updating review:', error);
      alert('An error occurred');
    }
  };

  const deleteReview = async (id: string) => {
    if (!firebaseUser || !confirm('Are you sure you want to delete this review?')) return;

    try {
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/reviews/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        alert('Review deleted successfully');
        fetchReviews();
      } else {
        alert('Failed to delete review');
      }
    } catch (error) {
      console.error('Error deleting review:', error);
      alert('An error occurred');
    }
  };

  const copyReviewLink = () => {
    const link = `${window.location.origin}/reviews/submit`;
    navigator.clipboard.writeText(link);
    alert('Review link copied to clipboard!');
  };

  const sendReviewEmail = (email: string) => {
    const subject = 'Share Your Experience with Brain Works Studio Africa';
    const body = `Hi there!\n\nWe hope you enjoyed our services. We'd love to hear about your experience!\n\nPlease share your review here: ${window.location.origin}/reviews/submit\n\nThank you!\nBrain Works Studio Africa`;
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const filteredReviews = reviews.filter((review) => {
    if (filter === 'pending') return !review.approved;
    if (filter === 'approved') return review.approved;
    return true;
  });

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading reviews...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || !isAdmin) return null;

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Review Management</h1>
              <p className="text-gray-600">Manage client reviews and testimonials</p>
            </div>
            <Button
              variant="outline"
              className="border-teal-300 text-teal-500 hover:bg-teal-50"
              onClick={copyReviewLink}
            >
              <Copy className="h-4 w-4 mr-2" />
              Copy Review Link
            </Button>
          </div>

          <div className="flex gap-2 mb-6">
            {['all', 'pending', 'approved'].map((f) => (
              <Badge
                key={f}
                variant={filter === f ? 'default' : 'outline'}
                className={`cursor-pointer px-4 py-2 ${
                  filter === f
                    ? 'bg-teal-500 text-white'
                    : 'border-teal-300 text-teal-500 hover:bg-teal-50'
                }`}
                onClick={() => setFilter(f as typeof filter)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {filteredReviews.length === 0 ? (
            <Card className="border-gray-200">
              <CardContent className="p-12 text-center">
                <p className="text-gray-600">No reviews found.</p>
              </CardContent>
            </Card>
          ) : (
            filteredReviews.map((review) => (
              <Card
                key={review.id}
                className={review.featured ? 'border-2 border-teal-500' : 'border-gray-200'}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      {review.clientImage ? (
                        <Image
                          src={review.clientImage}
                          alt={review.clientName}
                          width={60}
                          height={60}
                          className="rounded-full object-cover"
                          onError={(e) => (e.currentTarget.src = '/images/profile-placeholder.jpg')}
                        />
                      ) : (
                        <div className="w-15 h-15 rounded-full bg-teal-100 flex items-center justify-center">
                          <span className="text-teal-500 font-semibold text-xl">
                            {review.clientName.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900">{review.clientName}</CardTitle>
                        <CardDescription>
                          {review.clientEmail} • {review.serviceType}
                        </CardDescription>
                        <div className="flex items-center gap-1 mt-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className="ml-2 text-sm text-gray-600">
                            {new Date(review.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <Badge
                            className={
                              review.approved ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }
                          >
                            {review.approved ? 'Approved' : 'Pending'}
                          </Badge>
                          {review.featured && (
                            <Badge className="bg-teal-100 text-teal-700">Featured</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-600 hover:bg-red-50"
                      onClick={() => deleteReview(review.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">{review.reviewText}</p>
                  {review.adminResponse && (
                    <div className="mb-4 p-3 bg-teal-50 border border-teal-200 rounded-md">
                      <p className="text-sm font-semibold text-teal-500">Our Response:</p>
                      <p className="text-sm text-gray-700">{review.adminResponse}</p>
                    </div>
                  )}
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`response-${review.id}`} className="text-[#001F44] text-sm">
                        Admin Response
                      </Label>
                      <Textarea
                        id={`response-${review.id}`}
                        value={responseInputs[review.id] || ''}
                        onChange={(e) =>
                          setResponseInputs((prev) => ({ ...prev, [review.id]: e.target.value }))
                        }
                        placeholder="Enter your response..."
                        rows={3}
                        className="border-gray-300 focus:ring-teal-500 text-sm rounded-lg"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-teal-300 text-teal-500 hover:bg-teal-50"
                        onClick={() =>
                          updateReview(review.id, { adminResponse: responseInputs[review.id] || '' })
                        }
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        {review.adminResponse ? 'Update Response' : 'Add Response'}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-teal-300 text-teal-500 hover:bg-teal-50"
                        onClick={() => sendReviewEmail(review.clientEmail)}
                      >
                        <Mail className="h-4 w-4 mr-1" />
                        Email Client
                      </Button>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={review.approved}
                          onCheckedChange={(checked) => updateReview(review.id, { approved: checked })}
                        />
                        <Label className="text-[#001F44] text-sm">Approve</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={review.featured}
                          onCheckedChange={(checked) => updateReview(review.id, { featured: checked })}
                        />
                        <Label className="text-[#001F44] text-sm">Feature</Label>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
}