'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/AdminLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, CheckCircle, Clock, Settings, BookOpen, AlertCircle, TrendingUp } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalBookings: number;
  pendingBookings: number;
  approvedBookings: number;
  declinedBookings: number;
  recentBookings: any[];
  totalUsers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalBookings: 0,
    pendingBookings: 0,
    approvedBookings: 0,
    declinedBookings: 0,
    recentBookings: [],
    totalUsers: 0,
  });
  const [loading, setLoading] = useState(true);
  
  const { user, firebaseUser, isAdmin, userProfile } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    
    if (!isAdmin) {
      router.push('/dashboard');
      return;
    }
    
    fetchDashboardData();
  }, [user, isAdmin, router]);

  const fetchDashboardData = async () => {
    try {
      if (!firebaseUser) return;
      
      const token = await firebaseUser.getIdToken();
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const bookings = await response.json();
        
        setStats({
          totalBookings: bookings.length,
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          approvedBookings: bookings.filter((b: any) => b.status === 'accepted').length,
          declinedBookings: bookings.filter((b: any) => b.status === 'rejected').length,
          recentBookings: bookings.slice(0, 5),
          totalUsers: 0, // You can add a separate API call for user count
        });
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickApprove = async (bookingId: string) => {
    try {
      if (!firebaseUser) return;
      
      const token = await firebaseUser.getIdToken();
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'accepted',
          adminNotes: 'Quick approved from dashboard',
        }),
      });
      
      if (response.ok) {
        // Refresh dashboard data
        fetchDashboardData();
      }
    } catch (error) {
      console.error('Error approving booking:', error);
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading admin dashboard...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Admin Welcome Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            {userProfile?.profileImageUrl ? (
              <img 
                src={userProfile.profileImageUrl} 
                alt="Admin Profile" 
                className="w-16 h-16 rounded-full object-cover border-4 border-red-200"
              />
            ) : (
              <div className="p-4 bg-red-100 rounded-full">
                <Users className="h-8 w-8 text-red-700" />
              </div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile?.displayName || 'Admin'}!
              </h1>
              <p className="text-gray-600">Brain Works Studio Team Member • Admin Dashboard</p>
            </div>
          </div>
          
          {stats.pendingBookings > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">
                  {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? 's' : ''} awaiting your review
                </p>
                <p className="text-sm text-yellow-700">
                  Clients are waiting for your response. Review pending bookings now.
                </p>
              </div>
              <Link href="/admin/bookings?status=pending">
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white ml-auto">
                  Review Now
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-l-4 border-l-yellow-500">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-yellow-100 rounded-full w-fit mx-auto mb-4">
                <Clock className="h-6 w-6 text-yellow-700" />
              </div>
              <div className="text-3xl font-bold text-yellow-600">{stats.pendingBookings}</div>
              <div className="text-sm text-gray-600">Pending Approvals</div>
              {stats.pendingBookings > 0 && (
                <div className="mt-2">
                  <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                    Action Required
                  </Badge>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-green-500">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-green-100 rounded-full w-fit mx-auto mb-4">
                <CheckCircle className="h-6 w-6 text-green-700" />
              </div>
              <div className="text-3xl font-bold text-green-600">{stats.approvedBookings}</div>
              <div className="text-sm text-gray-600">Approved Sessions</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-red-500">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-red-100 rounded-full w-fit mx-auto mb-4">
                <BookOpen className="h-6 w-6 text-red-700" />
              </div>
              <div className="text-3xl font-bold text-gray-900">{stats.totalBookings}</div>
              <div className="text-sm text-gray-600">Total Bookings</div>
            </CardContent>
          </Card>
          
          <Card className="border-l-4 border-l-blue-500">
            <CardContent className="p-6 text-center">
              <div className="p-3 bg-blue-100 rounded-full w-fit mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-blue-700" />
              </div>
              <div className="text-3xl font-bold text-blue-600">
                {stats.totalBookings > 0 ? Math.round((stats.approvedBookings / stats.totalBookings) * 100) : 0}%
              </div>
              <div className="text-sm text-gray-600">Approval Rate</div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-red-600" />
                Booking Management
              </CardTitle>
              <CardDescription>
                Review client requests and manage studio bookings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-red-600">{stats.pendingBookings}</div>
                    <div className="text-sm text-gray-600">Awaiting your decision</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/admin/bookings" className="flex-1">
                    <Button className="w-full bg-red-600 hover:bg-red-700">
                      Manage All Bookings
                    </Button>
                  </Link>
                  {stats.pendingBookings > 0 && (
                    <Link href="/admin/bookings?status=pending" className="flex-1">
                      <Button variant="outline" className="w-full">
                        Review Pending
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                Client Management
              </CardTitle>
              <CardDescription>
                View and manage studio clients and team members
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600">{stats.totalUsers || '--'}</div>
                    <div className="text-sm text-gray-600">Registered clients</div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Link href="/admin/users" className="flex-1">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      View All Users
                    </Button>
                  </Link>
                  <Link href="/admin/users?role=admin" className="flex-1">
                    <Button variant="outline" className="w-full">
                      Team Members
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Bookings for Admin Review */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Booking Requests</CardTitle>
            <CardDescription>
              Latest client requests requiring your attention as a studio team member
            </CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentBookings.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h3>
                <p className="text-gray-600">New client requests will appear here for your review.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentBookings.map((booking: any) => (
                  <div key={booking.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-shadow">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          {booking.userInfo?.profileImageUrl ? (
                            <img 
                              src={booking.userInfo.profileImageUrl} 
                              alt="Client" 
                              className="w-10 h-10 rounded-full object-cover"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                              <Users className="h-5 w-5 text-gray-600" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium">{booking.serviceCategory}</div>
                          <div className="text-sm text-gray-600">
                            Client: {booking.userInfo?.displayName || 'Unknown'} • {new Date(booking.startDateTime).toLocaleDateString()}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.userInfo?.email}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Badge className={`${
                          booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {booking.status === 'pending' ? 'Needs Review' : 
                           booking.status === 'accepted' ? 'Approved by You' : 'Declined by You'}
                        </Badge>
                        
                        {booking.status === 'pending' && (
                          <Button
                            onClick={() => handleQuickApprove(booking.id)}
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                          >
                            Quick Approve
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="text-center pt-4">
                  <Link href="/admin/bookings">
                    <Button variant="outline">Review All Bookings</Button>
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
} */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Bookings</CardTitle>
          <CardDescription>
            Latest booking requests from clients
          </CardDescription>
        </CardHeader>
        <CardContent>
          {stats.recentBookings.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No recent bookings</h3>
              <p className="text-gray-600">New booking requests will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {stats.recentBookings.map((booking: any) => (
                <div key={booking.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      {booking.userInfo?.profileImageUrl ? (
                        <img 
                          src={booking.userInfo.profileImageUrl} 
                          alt="Client" 
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
                          <Users className="h-5 w-5 text-gray-600" />
                        </div>
                      )}
                    </div>
                    <div>
                      <div className="font-medium">{booking.serviceCategory}</div>
                      <div className="text-sm text-gray-600">
                        {booking.userInfo?.displayName || 'Unknown Client'} • {new Date(booking.startDateTime).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {booking.status === 'pending' ? 'Pending' : 
                       booking.status === 'accepted' ? 'Approved' : 'Declined'}
                    </span>
                  </div>
                </div>
              ))}
              
              <div className="text-center pt-4">
                <Link href="/admin/bookings">
                  <Button variant="outline">View All Bookings</Button>
                </Link>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}