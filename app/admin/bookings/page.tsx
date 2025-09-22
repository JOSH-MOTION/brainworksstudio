// app/admin/bookings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import {
  Calendar,
  User,
  Clock,
  MapPin,
  FileText,
  Check,
  X,
  MessageSquare,
  RefreshCw,
  AlertCircle,
  Info,
} from 'lucide-react';

interface Booking {
  id: string;
  bookingId: string;
  userId?: string;
  userInfo: {
    displayName?: string;
    email?: string;
    phone?: string | null;
    profileImageUrl?: string | null;
  } | null;
  serviceCategory?: string;
  startDateTime?: string | Date | null;
  endDateTime?: string | Date | null;
  location?: any;
  additionalNotes?: string;
  adminNotes?: string;
  status?: string;
  attachments?: any[];
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

export default function AdminBookingsPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [updatingBooking, setUpdatingBooking] = useState<string | null>(null);
  const [declineNotes, setDeclineNotes] = useState<{ [key: string]: string }>({});
  const [showDeclineForm, setShowDeclineForm] = useState<{ [key: string]: boolean }>({});
  const [showDebugInfo, setShowDebugInfo] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin && firebaseUser && !authLoading) {
      fetchBookings();
    }
  }, [user, isAdmin, firebaseUser, authLoading]);

  const fetchBookings = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdToken();

      const res = await fetch('/api/admin/bookings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(`Failed to fetch bookings: ${res.status} - ${err.error || 'Unknown'}`);
        setDebugInfo(err.debug || err);
        return;
      }

      const data = await res.json();
      const normalized = Array.isArray(data)
        ? data.map((b: any) => ({
            ...b,
            startDateTime: b.startDateTime ? new Date(b.startDateTime).toString() : null,
            endDateTime: b.endDateTime ? new Date(b.endDateTime).toString() : null,
            createdAt: b.createdAt ? new Date(b.createdAt).toString() : null,
            updatedAt: b.updatedAt ? new Date(b.updatedAt).toString() : null,
          }))
        : [];

      setBookings(normalized);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
      setDebugInfo(err);
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId: string, status: 'accepted' | 'rejected', adminNotes = '') => {
    if (!firebaseUser) return;
    setUpdatingBooking(bookingId);

    try {
      const token = await firebaseUser.getIdToken();

      const res = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status, adminNotes }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown' }));
        throw new Error(err.error || 'Failed to update status');
      }

      await fetchBookings();
      setShowDeclineForm((prev) => ({ ...prev, [bookingId]: false }));
      setDeclineNotes((prev) => ({ ...prev, [bookingId]: '' }));
      alert(`Booking ${status === 'accepted' ? 'approved' : 'declined'} successfully`);
    } catch (err) {
      console.error('Update error', err);
      alert(`Failed to update booking: ${(err as any).message || 'Unknown error'}`);
    } finally {
      setUpdatingBooking(null);
    }
  };

  const getStatusBadgeColor = (status?: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'accepted':
      case 'confirmed':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLocationText = (location: any) => {
    if (!location) return 'Location not specified';
    if (typeof location === 'string') return location;
    if (location.address) return location.address;
    return JSON.stringify(location);
  };

  if (authLoading || loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
            <p className="text-sm text-gray-500 mt-2">
              Auth: {authLoading ? 'Loading...' : 'Ready'} • Data: {loading ? 'Loading...' : 'Ready'}
            </p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!user || !isAdmin) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl font-semibold">Access Denied</p>
            <p className="text-gray-600 mt-2">You need admin privileges to access this page.</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl w-full text-center">
            <div className="text-red-600 mb-6">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <p className="text-xl font-semibold">Error Loading Bookings</p>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>

            <div className="flex justify-center gap-2">
              <Button onClick={fetchBookings}>
                <RefreshCw className="h-4 w-4 mr-2" /> Try Again
              </Button>
              <Button variant="outline" onClick={() => setShowDebugInfo((s) => !s)}>
                <Info className="h-4 w-4 mr-2" />
                {showDebugInfo ? 'Hide' : 'Show'} Debug Info
              </Button>
            </div>

            {showDebugInfo && (
              <Card className="mt-6 text-left">
                <CardHeader>
                  <CardTitle className="text-lg">Debug Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <strong>User:</strong> {user?.email || 'None'}
                  </div>
                  <div>
                    <strong>User ID:</strong> {user?.uid || 'None'}
                  </div>
                  <div>
                    <strong>Admin Status:</strong> {isAdmin ? 'Yes' : 'No'}
                  </div>
                  <div>
                    <strong>Firebase User:</strong> {firebaseUser ? 'Available' : 'None'}
                  </div>
                  {debugInfo && (
                    <pre className="mt-2 p-2 bg-gray-100 rounded text-xs overflow-auto">
                      {JSON.stringify(debugInfo, null, 2)}
                    </pre>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Client Bookings</h1>
            <p className="text-gray-600 mt-2">Manage and review all client photography session requests</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchBookings} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">Total: {bookings.length}</Badge>
            <Badge className="bg-yellow-100 text-yellow-800 px-3 py-1">
              Pending: {bookings.filter((b) => b.status === 'pending').length}
            </Badge>
          </div>
        </div>

        {bookings.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No bookings found</p>
              <p className="text-gray-400">Client booking requests will appear here</p>
              <Button onClick={fetchBookings} className="mt-4" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Bookings
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking) => (
              <Card key={booking.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">
                      {booking.serviceCategory || 'Unknown Category'}
                    </CardTitle>
                    <Badge className={`px-3 py-1 ${getStatusBadgeColor(booking.status)}`}>
                      {booking.status ? booking.status.charAt(0).toUpperCase() + booking.status.slice(1) : 'Unknown'}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    Booking ID: {booking.bookingId} • Created:{' '}
                    {booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'Unknown'}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <User className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">{booking.userInfo?.displayName || 'Unknown Client'}</p>
                          <p className="text-sm text-gray-600">{booking.userInfo?.email || 'No email'}</p>
                          {booking.userInfo?.phone && (
                            <p className="text-sm text-gray-600">{booking.userInfo.phone}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin className="h-5 w-5 text-gray-400" />
                        <p className="text-sm">{getLocationText(booking.location)}</p>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <Calendar className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">
                            {booking.startDateTime ? new Date(booking.startDateTime).toLocaleDateString() : 'N/A'}
                          </p>
                          <p className="text-sm text-gray-600">
                            {booking.startDateTime
                              ? new Date(booking.startDateTime).toLocaleTimeString()
                              : 'N/A'}{' '}
                            -{' '}
                            {booking.endDateTime ? new Date(booking.endDateTime).toLocaleTimeString() : 'N/A'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-gray-400" />
                        <p className="text-sm">
                          Duration:{' '}
                          {booking.startDateTime && booking.endDateTime
                            ? Math.round(
                                (new Date(booking.endDateTime).getTime() -
                                  new Date(booking.startDateTime).getTime()) /
                                  (1000 * 60 * 60)
                              )
                            : 'N/A'}{' '}
                          hours
                        </p>
                      </div>
                    </div>
                  </div>

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

                  {booking.attachments && booking.attachments.length > 0 && (
                    <div className="border-t pt-4">
                      <p className="font-medium text-sm mb-2">Attachments ({booking.attachments.length})</p>
                      <div className="text-sm text-gray-600">
                        Client has uploaded {booking.attachments.length} file(s)
                      </div>
                    </div>
                  )}

                  <div className="border-t pt-4">
                    {booking.status === 'pending' ? (
                      <div className="space-y-4">
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            className="bg-green-600 hover:bg-green-700"
                            size="sm"
                            onClick={() => updateBookingStatus(booking.id, 'accepted')}
                            disabled={updatingBooking === booking.id}
                          >
                            <Check className="h-4 w-4 mr-2" />
                            {updatingBooking === booking.id ? 'Approving...' : 'Approve'}
                          </Button>

                          <Button
                            variant="outline"
                            className="border-red-200 text-red-600 hover:bg-red-50"
                            size="sm"
                            onClick={() =>
                              setShowDeclineForm((prev) => ({ ...prev, [booking.id]: !prev[booking.id] }))
                            }
                            disabled={updatingBooking === booking.id}
                          >
                            <X className="h-4 w-4 mr-2" />
                            Decline
                          </Button>

                          <Button variant="outline" size="sm">
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Contact Client
                          </Button>
                        </div>

                        {showDeclineForm[booking.id] && (
                          <div className="border rounded-lg p-4 bg-red-50">
                            <p className="font-medium text-sm text-red-800 mb-2">Decline Booking</p>
                            <Textarea
                              placeholder="Reason for declining (optional)"
                              value={declineNotes[booking.id] || ''}
                              onChange={(e) =>
                                setDeclineNotes((prev) => ({ ...prev, [booking.id]: e.target.value }))
                              }
                              rows={3}
                              className="mb-3"
                            />
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateBookingStatus(booking.id, 'rejected', declineNotes[booking.id] || '')
                                }
                                className="bg-red-600 hover:bg-red-700"
                                disabled={updatingBooking === booking.id}
                              >
                                {updatingBooking === booking.id ? 'Declining...' : 'Confirm Decline'}
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() =>
                                  setShowDeclineForm((prev) => ({ ...prev, [booking.id]: false }))
                                }
                              >
                                Cancel
                              </Button>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Badge className={getStatusBadgeColor(booking.status)}>
                          {booking.status === 'accepted'
                            ? 'Approved'
                            : booking.status === 'rejected'
                            ? 'Declined'
                            : booking.status}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Contact Client
                        </Button>
                      </div>
                    )}
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