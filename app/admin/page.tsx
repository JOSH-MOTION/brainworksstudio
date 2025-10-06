'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Users, Clock, TrendingUp, Shield, AlertCircle, Settings, Moon, Sun, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, Variants } from 'framer-motion';

interface AdminStats {
  pendingBookings: number;
  totalBookings: number;
  totalUsers: number;
  recentActivity: any[];
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const sectionVariants: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.2, ease: 'easeOut' } },
};

export default function AdminDashboard() {
  const { user, isAdmin, loading, firebaseUser, userProfile } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats>({
    pendingBookings: 0,
    totalBookings: 0,
    totalUsers: 0,
    recentActivity: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    console.log('AdminDashboard: User state:', { user, firebaseUser, userProfile, isAdmin });
    if (!loading && (!user || !isAdmin)) {
      console.log('No user or not admin, redirecting to /auth/login');
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
        console.error('fetchStats: No firebaseUser available');
        return;
      }
      const token = await firebaseUser.getIdToken();
      console.log('Fetching stats from /api/admin/bookings');
      const response = await fetch('/api/admin/bookings', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const bookings = await response.json();
        console.log('Fetched stats:', bookings);
        setStats({
          pendingBookings: bookings.filter((b: any) => b.status === 'pending').length,
          totalBookings: bookings.length,
          totalUsers: 0, // Update if API provides user count
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

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-coral-50 dark:from-gray-900 dark:to-gray-800">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="rounded-full h-16 w-16 border-t-2 border-coral-600 dark:border-coral-400 mx-auto"
          />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading Studio Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-teal-50 text-gray-900'} transition-colors duration-300`}>
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="sticky top-0 z-10 bg-white dark:bg-gray-800 shadow-md"
      >
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            {userProfile?.profileImageUrl ? (
              <motion.img
                src={userProfile.profileImageUrl}
                alt="Profile"
                className="w-12 h-12 rounded-full object-cover border-4 border-white dark:border-gray-700"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                onError={(e) => {
                  console.error(`Failed to load profile image: ${userProfile.profileImageUrl}`);
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <motion.div
                className="p-3 bg-white dark:bg-gray-700 rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <User className="h-6 w-6 text-teal-900 dark:text-teal-400" />
              </motion.div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-teal-900 dark:text-teal-300">Studio Dashboard</h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">Welcome, {userProfile?.displayName || user.displayName || 'Admin'}</p>
            </div>
          </div>
          <Button
            onClick={toggleTheme}
            variant="outline"
            className="border-teal-300 text-teal-600 dark:border-teal-500 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900 rounded-full"
          >
            {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
          </Button>
        </div>
      </motion.header>

      <motion.div
        variants={sectionVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8"
      >
        {/* Alert for Pending Bookings */}
        {stats.pendingBookings > 0 && (
          <motion.div
            variants={cardVariants}
            className="mb-8 bg-coral-50 dark:bg-coral-900/50 border border-coral-200 dark:border-coral-700 rounded-lg p-6 flex items-center gap-4"
          >
            <AlertCircle className="h-6 w-6 text-coral-600 dark:text-coral-400 flex-shrink-0" />
            <div className="flex-1">
              <p className="font-semibold text-coral-800 dark:text-coral-300">
                {stats.pendingBookings} Pending Booking{stats.pendingBookings !== 1 ? 's' : ''}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Review and respond to pending client requests promptly.
              </p>
            </div>
            <Link href="/admin/bookings?status=pending">
              <Button className="bg-coral-600 hover:bg-coral-700 dark:bg-coral-500 dark:hover:bg-coral-600 text-white rounded-lg">
                Review Now
              </Button>
            </Link>
          </motion.div>
        )}

        {/* Stats Grid */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
        >
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-coral-500 dark:border-coral-400 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-coral-100 dark:bg-coral-900/50 rounded-full">
                    <Clock className="h-6 w-6 text-coral-600 dark:text-coral-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending Approvals</p>
                    <p className="text-2xl font-bold text-coral-600 dark:text-coral-400">{stats.pendingBookings}</p>
                  </div>
                </div>
                {stats.pendingBookings > 0 && (
                  <Badge className="mt-3 bg-coral-600 dark:bg-coral-500 text-white">Action Required</Badge>
                )}
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-full">
                    <Calendar className="h-6 w-6 text-teal-600 dark:text-teal-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Bookings</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalBookings}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-full">
                    <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Studio Clients</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{stats.totalUsers || '--'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                    <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Approval Rate</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                      {stats.totalBookings > 0
                        ? Math.round(((stats.totalBookings - stats.pendingBookings) / stats.totalBookings) * 100)
                        : 0}%
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Management Cards */}
        <motion.div
          variants={sectionVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
        >
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 border-l-4 border-coral-500 dark:border-coral-400 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-coral-600 dark:text-coral-400">
                  <Calendar className="h-5 w-5" />
                  Booking Management
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage client photography session requests
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.pendingBookings > 0 && (
                    <div className="p-2 bg-coral-50 dark:bg-coral-900/50 rounded-md">
                      <p className="text-sm font-medium text-coral-800 dark:text-coral-300">
                        {stats.pendingBookings} booking{stats.pendingBookings !== 1 ? 's' : ''} awaiting review
                      </p>
                    </div>
                  )}
                  <Link href="/admin/bookings">
                    <Button className="w-full bg-coral-600 hover:bg-coral-700 dark:bg-coral-500 dark:hover:bg-coral-600 text-white rounded-lg">
                      Manage Bookings
                    </Button>
                  </Link>
                  <Link href="/admin/bookings?status=pending">
                    <Button
                      variant="outline"
                      className="w-full border-coral-300 text-coral-600 dark:border-coral-500 dark:text-coral-400 hover:bg-coral-100 dark:hover:bg-coral-900/50 rounded-lg"
                    >
                      Review Pending ({stats.pendingBookings})
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-teal-400">
                  <Users className="h-5 w-5" />
                  Client Management
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Manage studio clients and team accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/admin/users">
                    <Button className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-600 text-white rounded-lg">
                      View Clients
                    </Button>
                  </Link>
                  <Link href="/admin/users?role=admin">
                    <Button
                      variant="outline"
                      className="w-full border-teal-300 text-teal-600 dark:border-teal-500 dark:text-teal-400 hover:bg-teal-100 dark:hover:bg-teal-900/50 rounded-lg"
                    >
                      Team Members
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <Settings className="h-5 w-5" />
                  Studio Settings
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Configure studio settings and team access
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Link href="/admin/settings">
                    <Button className="w-full bg-gray-600 hover:bg-gray-700 dark:bg-gray-500 dark:hover:bg-gray-600 text-white rounded-lg">
                      Studio Configuration
                    </Button>
                  </Link>
                  <Link href="/admin/team">
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-600 dark:border-gray-400 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    >
                      Team Management
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>

        {/* Recent Activity */}
        {stats.recentActivity.length > 0 && (
          <motion.div variants={cardVariants}>
            <Card className="bg-white dark:bg-gray-800 shadow-lg">
              <CardHeader>
                <CardTitle className="text-gray-900 dark:text-gray-100">Recent Client Activity</CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-400">
                  Latest booking requests requiring attention
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.recentActivity.map((booking: any) => (
                    <motion.div
                      key={booking.id}
                      variants={cardVariants}
                      className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-teal-100 dark:bg-teal-900/50 rounded-full">
                          <Calendar className="h-4 w-4 text-teal-600 dark:text-teal-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-100">{booking.serviceCategory} Request</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Client: {booking.userInfo?.displayName || 'Unknown'} •{' '}
                            {new Date(booking.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <Badge
                        className={`${
                          booking.status === 'pending'
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-400'
                            : booking.status === 'accepted'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-400'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-400'
                        }`}
                      >
                        {booking.status === 'pending'
                          ? 'Awaiting Review'
                          : booking.status === 'accepted'
                          ? 'Approved'
                          : 'Declined'}
                      </Badge>
                    </motion.div>
                  ))}
                  <div className="text-center pt-4">
                    <Link href="/admin/bookings">
                      <Button
                        variant="outline"
                        className="border-coral-300 text-coral-600 dark:border-coral-500 dark:text-coral-400 hover:bg-coral-100 dark:hover:bg-coral-900/50 rounded-lg"
                      >
                        View All Requests
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}