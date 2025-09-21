'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, User, Clock, MapPin, FileText, Eye } from 'lucide-react';

interface Booking {
  id: string;
  bookingId: string;
  userId: string;
  userInfo: {
    displayName: string;
    email: string;
    phone: string;
    profileImageUrl: string | null;
  } | null;
  serviceCategory: string;
  startDateTime: Date;
  endDateTime: Date;
  location: string;
  additionalNotes: string;
  adminNotes: string;
  status: string;
  attachments: any[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminBookingsPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin && firebaseUser) {
      fetchBookings();
    }
  }, [user, isAdmin, firebaseUser]);

  const fetchBookings = async () => {
    try {
      if (!firebaseUser) return;
      
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch bookings');
      }

      const data = await response.json();
      setBookings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'confirmed':
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // Loading state
  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Error state
  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="text-red-600 mb-4">
              <p className="text-xl font-semibold">Error Loading Bookings</p>
              <p className="text-gray-600">{error}</p>
            </div>
            <Button onClick={fetchBookings} className="bg-red-700 hover:bg-red-800">
              Try Again
            </Button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  // Auth check
  if (!user || !isAdmin) {
    return null;
  }

  // Main content
  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Client Bookings</h1>
              <p className="text-gray-600 mt-2">
                Manage and review all client photography session requests
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800 px-3 py-1">
                Total: {bookings.length}
              </Badge>
              <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
                Pending: {bookings.filter(b => b.status === 'pending').length}
              </Badge>
            </div>
          </div>
        </div>

        {/* Bookings List */}
        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400">Client booking requests will appear here</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                      {booking.serviceCategory}
                    </CardTitle>
                    <Badge className={`px-3 py-1 ${getStatusBadgeColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Booking ID: {booking.bookingId} • Created: {new Date(booking.createdAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* Client Information */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{booking.userInfo?.displayName || 'Unknown Client'}</p>
                          <p className="text-sm text-gray-600">{booking.userInfo?.email}</p>
                          {booking.userInfo?.phone && (
                            <p className="text-sm text-gray-600">{booking.userInfo.phone}</p>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <p className="text-sm">{booking.location || 'Location not specified'}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {new Date(booking.startDateTime).toLocaleDateString()}
                          </p>
                          <p className="text-sm text-gray-600">
                            {new Date(booking.startDateTime).toLocaleTimeString()} - {' '}
                            {new Date(booking.endDateTime).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <p className="text-sm">
                          Duration: {Math.round((new Date(booking.endDateTime).getTime() - new Date(booking.startDateTime).getTime()) / (1000 * 60 * 60))} hours
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Notes */}
                  {booking.additionalNotes && (
                    <div className="border-t pt-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-gray-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm">Client Notes:</p>
                          <p className="text-sm text-gray-600 mt-1">{booking.additionalNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {booking.adminNotes && (
                    <div className="border-t pt-4">
                      <div className="flex items-start gap-3">
                        <FileText className="h-5 w-5 text-blue-400 mt-0.5" />
                        <div>
                          <p className="font-medium text-sm text-blue-700">Admin Notes:</p>
                          <p className="text-sm text-gray-600 mt-1">{booking.adminNotes}</p>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Attachments */}
                  {booking.attachments && booking.attachments.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="font-medium text-sm mb-2">Attachments ({booking.attachments.length})</p>
                      <div className="text-sm text-gray-600">
                        Client has uploaded {booking.attachments.length} file(s)
                      </div>
                    </div>
                  )}
                  
                  {/* Actions */}
                  <div className="border-t pt-4 flex gap-2 flex-wrap">
                    <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                    
                    {booking.status === 'pending' && (
                      <>
                        <Button className="bg-green-600 hover:bg-green-700" size="sm">
                          Approve
                        </Button>
                        <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" size="sm">
                          Decline
                        </Button>
                      </>
                    )}
                    
                    <Button variant="outline" size="sm">
                      Contact Client
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
}