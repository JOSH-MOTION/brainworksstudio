'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Calendar, Camera, MessageSquare, BarChart3 } from 'lucide-react';
import Link from 'next/link';

export default function AdminDashboard() {
  const { user, isAdmin, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-amber-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your studio's operations and content</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-blue-100 rounded-full">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-green-100 rounded-full">
                  <Calendar className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Pending Bookings</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-purple-100 rounded-full">
                  <Camera className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Portfolio Items</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="p-2 bg-orange-100 rounded-full">
                  <MessageSquare className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">New Messages</p>
                  <p className="text-2xl font-bold text-gray-900">--</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Portfolio Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5 text-amber-700" />
                Portfolio Management
              </CardTitle>
              <CardDescription>
                Upload, edit, and organize your portfolio items
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/portfolio">
                  <Button className="w-full bg-amber-700 hover:bg-amber-800">
                    Manage Portfolio
                  </Button>
                </Link>
                <Link href="/admin/portfolio/upload">
                  <Button variant="outline" className="w-full">
                    Upload New Item
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Booking Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-700" />
                Booking Management
              </CardTitle>
              <CardDescription>
                Review and manage client booking requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/bookings">
                  <Button className="w-full bg-green-700 hover:bg-green-800">
                    View All Bookings
                  </Button>
                </Link>
                <Link href="/admin/bookings?status=pending">
                  <Button variant="outline" className="w-full">
                    Pending Requests
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* User Management */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-700" />
                User Management
              </CardTitle>
              <CardDescription>
                View and manage registered users
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/users">
                  <Button className="w-full bg-blue-700 hover:bg-blue-800">
                    View All Users
                  </Button>
                </Link>
                <Link href="/admin/users?role=admin">
                  <Button variant="outline" className="w-full">
                    Admin Users
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Contact Messages */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-purple-700" />
                Contact Messages
              </CardTitle>
              <CardDescription>
                Review messages from contact form
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/contacts">
                  <Button className="w-full bg-purple-700 hover:bg-purple-800">
                    View Messages
                  </Button>
                </Link>
                <Link href="/admin/contacts?status=new">
                  <Button variant="outline" className="w-full">
                    New Messages
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Analytics */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-indigo-700" />
                Analytics
              </CardTitle>
              <CardDescription>
                View business metrics and reports
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/analytics">
                  <Button className="w-full bg-indigo-700 hover:bg-indigo-800">
                    View Analytics
                  </Button>
                </Link>
                <Link href="/admin/reports">
                  <Button variant="outline" className="w-full">
                    Generate Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Settings */}
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-gray-700" />
                Settings
              </CardTitle>
              <CardDescription>
                Configure studio settings and preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Link href="/admin/settings">
                  <Button className="w-full bg-gray-700 hover:bg-gray-800">
                    Studio Settings
                  </Button>
                </Link>
                <Link href="/admin/email-templates">
                  <Button variant="outline" className="w-full">
                    Email Templates
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}