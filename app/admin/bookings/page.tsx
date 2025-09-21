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
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Calendar, Clock, MapPin, User, Search, Filter, CheckCircle, XCircle, Eye, Mail, Phone } from 'lucide-react';

interface UserInfo {
  displayName: string;
  email: string;
  phone?: string;
  profileImageUrl?: string;
}

interface BookingWithUserInfo {
  id: string;
  bookingId: string;
  userId: string;
  userInfo: UserInfo;
  serviceCategory: string;
  startDateTime: Date;
  endDateTime: Date;
  location: { address: string };
  additionalNotes?: string;
  adminNotes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  attachments?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingWithUserInfo[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<BookingWithUserInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<BookingWithUserInfo | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  
  const { user, isAdmin, firebaseUser, loading: authLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchBookings();
    }
  }, [user, isAdmin]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter, categoryFilter]);

  const fetchBookings = async () => {
    try {
      const token = await firebaseUser?.getIdToken();
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Fetched bookings with user info:', data);
        setBookings(data);
      } else {
        console.error('Failed to fetch bookings:', response.status);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterBookings = () => {
    let filtered = bookings;
    
    if (searchTerm) {
      filtered = filtered.filter(booking => 
        booking.userInfo?.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.userInfo?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }
    
    if (categoryFilter !== 'all') {
      filtered = filtered.filter(booking => booking.serviceCategory === categoryFilter);
    }
    
    setFilteredBookings(filtered);
  };

  const updateBookingStatus = async (bookingId: string, status: 'accepted' | 'rejected', notes: string) => {
    setUpdating(true);
    try {
      const token = await firebaseUser?.getIdToken();
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          adminNotes: notes,
        }),
      });
      
      if (response.ok) {
        // Update local state
        setBookings(prev => 
          prev.map(booking => 
            booking.id === bookingId 
              ? { ...booking, status, adminNotes: notes, updatedAt: new Date() }
              : booking
          )
        );
        setDialogOpen(false);
        setSelectedBooking(null);
        setAdminNotes('');
      } else {
        console.error('Failed to update booking status');
      }
    } catch (error) {
      console.error('Error updating booking status:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Approved';
      case 'rejected':
        return 'Declined';
      default:
        return 'Pending Review';
    }
  };

  const categories = ['all', ...Array.from(new Set(bookings.map(booking => booking.serviceCategory)))];

  if (authLoading || loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading bookings...</p>
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
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Management</h1>
          <p className="text-gray-600">Review and manage client booking requests</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-yellow-100 rounded-full">
                  <Clock className="h-6 w-6 text-yellow-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'pending').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'accepted').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-red-100 rounded-full">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Declined</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {bookings.filter(b => b.status === 'rejected').length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total</p>
                  <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search by client name, email, service, or location..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="accepted">Approved</SelectItem>
                  <SelectItem value="rejected">Declined</SelectItem>
                </SelectContent>
              </Select>

              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
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
            </div>
          </CardContent>
        </Card>

        {/* Bookings List */}
        <Card>
          <CardHeader>
            <CardTitle>All Bookings</CardTitle>
            <CardDescription>
              Click on any booking to review details and update status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings found</h3>
                <p className="text-gray-600">
                  {bookings.length === 0 
                    ? "No booking requests have been submitted yet."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredBookings.map((booking) => (
                  <div 
                    key={booking.id} 
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedBooking(booking);
                      setAdminNotes(booking.adminNotes || '');
                      setDialogOpen(true);
                    }}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <h3 className="text-lg font-semibold">{booking.serviceCategory}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                        
                        {/* Client Information */}
                        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                          <h4 className="font-medium mb-2 text-sm text-gray-700">Client Information</h4>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                            <div className="flex items-center gap-2">
                              {booking.userInfo?.profileImageUrl ? (
                                <img 
                                  src={booking.userInfo.profileImageUrl} 
                                  alt="Profile" 
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-gray-300 flex items-center justify-center">
                                  <User className="h-3 w-3 text-gray-600" />
                                </div>
                              )}
                              <span className="font-medium">{booking.userInfo?.displayName || 'Unknown User'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Mail className="h-3 w-3 text-gray-400" />
                              <span className="text-gray-600">{booking.userInfo?.email || 'No email'}</span>
                            </div>
                            {booking.userInfo?.phone && (
                              <div className="flex items-center gap-2">
                                <Phone className="h-3 w-3 text-gray-400" />
                                <span className="text-gray-600">{booking.userInfo.phone}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Booking Details */}
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            <span>{new Date(booking.startDateTime).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4" />
                            <span>
                              {new Date(booking.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - 
                              {new Date(booking.endDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{booking.location.address}</span>
                          </div>
                        </div>

                        {booking.additionalNotes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-700">
                              <strong>Client Notes:</strong> {booking.additionalNotes}
                            </p>
                          </div>
                        )}

                        {booking.adminNotes && (
                          <div className="mt-3 p-3 bg-green-50 rounded-md">
                            <p className="text-sm text-green-700">
                              <strong>Admin Response:</strong> {booking.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-500 flex items-center gap-2 flex-shrink-0">
                        <Eye className="h-4 w-4" />
                        <div>
                          <div>Submitted</div>
                          <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Review Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Review Booking Request</DialogTitle>
            </DialogHeader>
            
            {selectedBooking && (
              <div className="space-y-6">
                {/* Client Information */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold mb-3">Client Information</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2">
                      {selectedBooking.userInfo?.profileImageUrl ? (
                        <img 
                          src={selectedBooking.userInfo.profileImageUrl} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{selectedBooking.userInfo?.displayName || 'Unknown User'}</p>
                        <p className="text-sm text-gray-600">{selectedBooking.userInfo?.email || 'No email'}</p>
                      </div>
                    </div>
                    {selectedBooking.userInfo?.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-400" />
                        <span>{selectedBooking.userInfo.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Booking Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Service Details</h4>
                    <p><strong>Service:</strong> {selectedBooking.serviceCategory}</p>
                    <p><strong>Date:</strong> {new Date(selectedBooking.startDateTime).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {new Date(selectedBooking.startDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} - {new Date(selectedBooking.endDateTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Location</h4>
                    <p>{selectedBooking.location.address}</p>
                  </div>
                </div>

                {selectedBooking.additionalNotes && (
                  <div>
                    <h4 className="font-semibold mb-2">Client Notes</h4>
                    <div className="p-3 bg-blue-50 rounded-md">
                      <p className="text-sm">{selectedBooking.additionalNotes}</p>
                    </div>
                  </div>
                )}

                {selectedBooking.attachments && selectedBooking.attachments.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Attachments</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedBooking.attachments.map((url, index) => (
                        <img 
                          key={index} 
                          src={url} 
                          alt={`Attachment ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Admin Response */}
                <div>
                  <h4 className="font-semibold mb-2">Admin Response</h4>
                  <Textarea
                    value={adminNotes}
                    onChange={(e) => setAdminNotes(e.target.value)}
                    placeholder="Add notes for the client (optional)..."
                    rows={3}
                  />
                </div>

                {/* Action Buttons */}
                {selectedBooking.status === 'pending' && (
                  <div className="flex gap-3">
                    <Button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'accepted', adminNotes)}
                      disabled={updating}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      {updating ? 'Updating...' : 'Approve Booking'}
                    </Button>
                    
                    <Button
                      onClick={() => updateBookingStatus(selectedBooking.id, 'rejected', adminNotes)}
                      disabled={updating}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      {updating ? 'Updating...' : 'Decline Booking'}
                    </Button>
                  </div>
                )}

                {selectedBooking.status !== 'pending' && (
                  <div className="p-3 bg-gray-100 rounded-md text-center">
                    <p className="text-gray-600">
                      This booking has already been {selectedBooking.status === 'accepted' ? 'approved' : 'declined'}.
                    </p>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </Layout>
  );
}