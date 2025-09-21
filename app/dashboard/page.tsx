'use client';

import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Booking } from '@/types';
import { Calendar, Clock, MapPin, User, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, firebaseUser, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    fetchBookings();
  }, [user, router]);

  const fetchBookings = async () => {
    try {
      const response = await fetch('/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${await firebaseUser?.getIdToken()}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(data);
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
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

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            {userProfile?.profileImageUrl ? (
              <img 
                src={userProfile.profileImageUrl} 
                alt="Profile" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-200"
              />
            ) : (
              <div className="p-2 bg-amber-100 rounded-full">
                <User className="h-6 w-6 text-amber-700" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.displayName || 'User'}!
              </h1>
              <p className="text-gray-600">Manage your bookings and profile</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="p-3 bg-amber-100 rounded-full w-fit mx-auto mb-4">
                <Camera className="h-6 w-6 text-amber-700" />
              </div>
              <h3 className="font-semibold mb-2">Book New Session</h3>
              <p className="text-gray-600 text-sm mb-4">Schedule your next photography session</p>
              <Link href="/booking">
                <Button className="w-full bg-amber-700 hover:bg-amber-800">Book Now</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <User className="h-6 w-6 text-blue-700" />
              </div>
              <h3 className="font-semibold mb-2">Update Profile</h3>
              <p className="text-gray-600 text-sm mb-4">Edit your personal information</p>
              <Link href="/profile">
                <Button variant="outline" className="w-full">Edit Profile</Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <Camera className="h-6 w-6 text-green-700" />
              </div>
              <h3 className="font-semibold mb-2">View Portfolio</h3>
              <p className="text-gray-600 text-sm mb-4">Browse our latest work</p>
              <Link href="/portfolio">
                <Button variant="outline" className="w-full">View Gallery</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Bookings Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Recent Bookings
            </CardTitle>
            <CardDescription>
              Your recent photography session requests and their status
            </CardDescription>
          </CardHeader>
          <CardContent>
            {bookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No bookings yet</h3>
                <p className="text-gray-600 mb-4">Start by booking your first photography session!</p>
                <Link href="/booking">
                  <Button className="bg-amber-700 hover:bg-amber-800">Book Your First Session</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {bookings.slice(0, 5).map((booking) => (
                  <div key={booking.bookingId} className="border border-gray-200 rounded-lg p-6 hover:shadow-sm transition-shadow">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{booking.serviceCategory}</h3>
                          <Badge className={getStatusColor(booking.status)}>
                            {getStatusText(booking.status)}
                          </Badge>
                        </div>
                        
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
                          <div className="mt-3 p-3 bg-gray-50 rounded-md">
                            <p className="text-sm text-gray-700">
                              <strong>Notes:</strong> {booking.additionalNotes}
                            </p>
                          </div>
                        )}

                        {booking.adminNotes && (
                          <div className="mt-3 p-3 bg-blue-50 rounded-md">
                            <p className="text-sm text-blue-700">
                              <strong>Admin Response:</strong> {booking.adminNotes}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="text-sm text-gray-500">
                        Submitted {new Date(booking.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
                
                {bookings.length > 5 && (
                  <div className="text-center pt-4">
                    <Link href="/bookings">
                      <Button variant="outline">View All Bookings ({bookings.length})</Button>
                    </Link>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}