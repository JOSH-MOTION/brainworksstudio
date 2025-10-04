// app/admin/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, Clock, TrendingUp, Shield, AlertCircle,Settings } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminStats {
  pendingBookings: number;
  totalBookings: number;
  totalUsers: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const { user, isAdmin, loading, firebaseUser } = useAuth();
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
      if (!firebaseUser) {
        return;
      }
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const bookings = await response.json();
        setStats({
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          totalBookings: bookings.length,
          totalUsers: 0,
          recentActivity: bookings.slice(0, 3),
        });
      } else {
        console.error('Failed to fetch bookings:', await response.text());
      }
    } catch (error) {
      console.error('Error fetching admin stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-orange-100 rounded-full">
            <Shield className="h-8 w-8 text-orange-600" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Studio Management Dashboard</h1>
            <p className="text-gray-600">Brain Works Studio Team Member Portal</p>
          </div>
        </div>
        {stats.pendingBookings > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-orange-600 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-medium text-orange-800">
                {stats.pendingBookings} client booking{stats.pendingBookings !== 1 ? 's' : ''} require{stats.pendingBookings === 1 ? 's' : ''} your immediate attention
              </p>
              <p className="text-sm text-orange-700">
                As a studio team member, please review and respond to pending requests promptly.
              </p>
            </div>
            <Link href="/admin/bookings?status=pending">
              <Button className="bg-orange-600 hover:bg-orange-700 text-white">
                Review Bookings
              </Button>
            </Link>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-full">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-2xl font-bold text-orange-600">{stats.pendingBookings}</p>
              </div>
            </div>
            {stats.pendingBookings > 0 && (
              <div className="mt-2">
                <Badge variant="destructive" className="text-xs bg-orange-600 text-white">
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
                  {stats.totalBookings > 0
                    ? Math.round(((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-600">
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
                <div className="p-2 bg-orange-50 rounded-md">
                  <p className="text-sm font-medium text-orange-800">
                    {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? 's' : ''} awaiting review
                  </p>
                </div>
              )}
              <Link href="/admin/bookings">
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white">
                  Manage All Bookings
                </Button>
              </Link>
              <Link href="/admin/bookings?status=pending">
                <Button variant="outline" className="w-full border-orange-300 text-orange-600 hover:bg-orange-100">
                  Review Pending ({stats.pendingBookings})
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <Users className="h-5 w-5" />
              Client Management
            </CardTitle>
            <CardDescription>
              View and manage studio clients and team member accounts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/users">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  View All Clients
                </Button>
              </Link>
              <Link href="/admin/users?role=admin">
                <Button variant="outline" className="w-full border-blue-300 text-blue-600 hover:bg-blue-100">
                  Team Members
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-600">
              <Settings className="h-5 w-5" />
              Studio Settings
            </CardTitle>
            <CardDescription>
              Configure studio settings, preferences, and team access
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Link href="/admin/settings">
                <Button className="w-full bg-gray-600 hover:bg-gray-700 text-white">
                  Studio Configuration
                </Button>
              </Link>
              <Link href="/admin/team">
                <Button variant="outline" className="w-full border-gray-300 text-gray-600 hover:bg-gray-100">
                  Team Management
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      {stats.recentActivity.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-900">Recent Client Activity</CardTitle>
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
                      <p className="font-medium text-gray-900">{booking.serviceCategory} Request</p>
                      <p className="text-sm text-gray-600">
                        Client: {booking.userInfo?.displayName || 'Unknown'} •{' '}
                        {new Date(booking.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge
                    className={`${
                      booking.status === 'pending'
                        ? 'bg-yellow-100 text-yellow-800'
                        : booking.status === 'accepted'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {booking.status === 'pending'
                      ? 'Awaiting Review'
                      : booking.status === 'accepted'
                      ? 'Approved'
                      : 'Declined'}
                  </Badge>
                </div>
              ))}
              <div className="text-center pt-2">
                <Link href="/admin/bookings">
                  <Button variant="outline" className="border-orange-300 text-orange-600 hover:bg-orange-100">
                    View All Client Requests
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}