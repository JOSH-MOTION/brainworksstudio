'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, CheckCircle, Clock, Settings, BookOpen, AlertCircle, TrendingUp, Shield } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminStats {
  pendingBookings: number;
  totalBookings: number;
  totalUsers: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, userProfile, firebaseUser } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    pendingBookings: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentActivity: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, loading, router]);

  useEffect(() => {
    if (user && isAdmin) {
      fetchStats();
    }
  }, [user, isAdmin]);

  const fetchStats = async () => {
    try {
      console.log('=== ADMIN DASHBOARD DEBUG ===');
      console.log('User:', user?.uid);
      console.log('Is Admin:', isAdmin);
      console.log('Firebase User:', firebaseUser?.uid);
      
      if (!firebaseUser) {
        console.log('No firebase user, returning');
        return;
      }
      
      const token = await firebaseUser.getIdToken();
      console.log('Token obtained, length:', token.length);
      
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);
      
      if (response.ok) {
        const bookings = await response.json();
        console.log('Bookings received:', bookings.length);
        console.log('Sample booking:', bookings[0]);
        
        setStats({
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          totalBookings: bookings.length,
          totalUsers: 0,
          recentActivity: bookings.slice(0, 3),
        });
      } else {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
      }
    } catch (error) {
      console.error('=== ADMIN FETCH ERROR ===');
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    console.log('User or admin check failed:', { user: !!user, isAdmin });
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      {/* Debug Info - Remove this in production */}
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <h3 className="font-bold text-yellow-800">Debug Info:</h3>
        <p className="text-sm text-yellow-700">User ID: {user?.uid}</p>
        <p className="text-sm text-yellow-700">Is Admin: {isAdmin ? 'Yes' : 'No'}</p>
        <p className="text-sm text-yellow-700">Total Bookings: {stats.totalBookings}</p>
        <p className="text-sm text-yellow-700">Pending Bookings: {stats.pendingBookings}</p>
      </div>

      {/* Admin Header with Team Member Info */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-red-100 rounded-full">
            <Shield className="h-8 w-8 text-red-700" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Studio Management Dashboard</h1>
            <p className="text-gray-600">Brain Works Studio Team Member Portal</p>
          </div>
        </div>
        
        {/* Admin Alert Section */}
        {stats.pendingBookings > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-red-800">
                {stats.pendingBookings} client booking{stats.pendingBookings !== 1 ? 's' : ''} require{stats.pendingBookings === 1 ? 's' : ''} your immediate attention
              </p>
              <p className="text-sm text-red-700">
                As a studio team member, please review and respond to pending requests promptly.
              </p>
            </div>
            <Link href="/admin/bookings?status=pending">
              <Button className="bg-red-600 hover:bg-red-700 text-white">
                Review Bookings
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Admin Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-full">
                <Clock className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-red-600">{stats.pendingBookings}</p>
              </div>
            </div>
            {stats.pendingBookings > 0 && (
              <div className="mt-2">
                <Badge variant="destructive" className="text-xs">
                  Requires Action
                </Badge>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-full">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalBookings}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-full">
                <Users className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Studio Clients</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers || '--'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-full">
                <TrendingUp className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Approval Rate</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalBookings > 0 ? 
                    Math.round(((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100) : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Admin Management Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {/* Booking Management - Priority */}
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-red-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <Calendar className="h-5 w-5" />
              Client Booking Management
            </CardTitle>
            <CardDescription>
              Review, approve, and manage client photography session requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.pendingBookings > 0 && (
                <div className="p-2 bg-red-50 rounded-md">
                  <p className="text-sm font-medium text-red-800">
                    {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? 's' : ''} awaiting review
                  </p>
                </div>
              )}
              <Link href="/admin/bookings">
                <Button className="w-full bg-red-700 hover:bg-red-800">
                  Manage All Bookings
                </Button>
              </Link>
              <Link href="/admin/bookings?status=pending">
                <Button variant="outline" className="w-full">
                  Review Pending ({stats.pendingBookings})
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Client Management */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-700" />
              Client Management
            </CardTitle>
            <CardDescription>
              View and manage studio clients and team member accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/users">
                <Button className="w-full bg-blue-700 hover:bg-blue-800">
                  View All Clients
                </Button>
              </Link>
              <Link href="/admin/users?role=admin">
                <Button variant="outline" className="w-full">
                  Team Members
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Studio Settings */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-gray-700" />
              Studio Settings
            </CardTitle>
            <CardDescription>
              Configure studio settings, preferences, and team access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/settings">
                <Button className="w-full bg-gray-700 hover:bg-gray-800">
                  Studio Configuration
                </Button>
              </Link>
              <Link href="/admin/team">
                <Button variant="outline" className="w-full">
                  Team Management
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity for Team Members */}
      {stats.recentActivity.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Client Activity</CardTitle>
            <CardDescription>
              Latest client booking requests requiring team attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {stats.recentActivity.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-100 rounded-full">
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.serviceCategory} Request</p>
                      <p className="text-sm text-gray-600">
                        Client: {booking.userInfo?.displayName || 'Unknown'} • {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {booking.status === 'pending' ? 'Awaiting Review' : 
                     booking.status === 'accepted' ? 'Approved' : 'Declined'}
                  </Badge>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link href="/admin/bookings">
                  <Button variant="outline">View All Client Requests</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}