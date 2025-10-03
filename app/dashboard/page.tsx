'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { Booking } from '@/types';
import { Calendar, Clock, MapPin, User, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.4, ease: 'easeOut' } },
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, transition: { duration: 0.2 } },
  tap: { scale: 0.95 },
};

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
        return 'bg-teal-500 text-white hover:bg-teal-600';
      case 'rejected':
        return 'bg-coral-500 text-white hover:bg-coral-600';
      default:
        return 'bg-yellow-400 text-gray-900 hover:bg-yellow-500';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Approved';
      case 'rejected':
        return 'Declined';
      default:
        return 'Pending';
    }
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="min-h-screen flex items-center justify-center bg-gray-100"
        >
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="rounded-full h-16 w-16 border-t-2 border-teal-500 mx-auto"
            />
            <p className="mt-4 text-teal-900 text-lg font-medium">Loading dashboard...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8 bg-gray-100 min-h-screen"
      >
        {/* Header Section */}
        <motion.div
          variants={sectionVariants}
          className="bg-gradient-to-r from-teal-500 to-coral-500 rounded-2xl p-6 mb-8 shadow-lg"
        >
          <div className="flex items-center gap-4">
            {userProfile?.profileImageUrl ? (
              <motion.img
                src={userProfile.profileImageUrl}
                alt="Profile"
                className="w-16 h-16 rounded-full object-cover border-4 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              />
            ) : (
              <motion.div
                className="p-3 bg-white rounded-full"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <User className="h-8 w-8 text-teal-900" />
              </motion.div>
            )}
            <div>
              <h1 className="text-3xl font-bold text-white">
                Welcome, {userProfile?.displayName || 'User'}!
              </h1>
              <p className="text-teal-100">Manage your bookings and explore your photography journey.</p>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          variants={sectionVariants}
          className="flex flex-col sm:flex-row gap-4 mb-8"
        >
          {[
            {
              title: 'Book New Session',
              description: 'Schedule your next photography session',
              icon: <Camera className="h-6 w-6 text-teal-900" />,
              link: '/booking',
              buttonText: 'Book Now',
              buttonClass: 'bg-teal-500 hover:bg-teal-600 text-white',
            },
            {
              title: 'Update Profile',
              description: 'Edit your personal information',
              icon: <User className="h-6 w-6 text-teal-900" />,
              link: '/profile',
              buttonText: 'Edit Profile',
              buttonClass: 'border-teal-500 text-teal-500 hover:bg-teal-100',
            },
            {
              title: 'View Portfolio',
              description: 'Browse our latest work',
              icon: <Camera className="h-6 w-6 text-teal-900" />,
              link: '/portfolio',
              buttonText: 'View Gallery',
              buttonClass: 'border-teal-500 text-teal-500 hover:bg-teal-100',
            },
          ].map((action, index) => (
            <motion.div
              key={action.title}
              variants={cardVariants}
              custom={index}
              initial="hidden"
              animate="visible"
              transition={{ delay: index * 0.1 }}
              className="flex-1"
            >
              <Card className="text-center bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6">
                  <motion.div
                    className="p-3 bg-teal-100 rounded-full w-fit mx-auto mb-4"
                    whileHover={{ rotate: 360, transition: { duration: 0.5 } }}
                  >
                    {action.icon}
                  </motion.div>
                  <h3 className="font-semibold text-teal-900 mb-2">{action.title}</h3>
                  <p className="text-gray-600 text-sm mb-4">{action.description}</p>
                  <Link href={action.link}>
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button className={`w-full rounded-full ${action.buttonClass}`}>
                        {action.buttonText}
                      </Button>
                    </motion.div>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Bookings Section */}
        <motion.div variants={sectionVariants}>
          <Card className="bg-white rounded-xl shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-900">
                <Calendar className="h-5 w-5" />
                Recent Bookings
              </CardTitle>
              <p className="text-gray-600">Your recent photography session requests and their status</p>
            </CardHeader>
            <CardContent>
              {bookings.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="text-center py-8"
                >
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-teal-900 mb-2">No bookings yet</h3>
                  <p className="text-gray-600 mb-4">Start by booking your first photography session!</p>
                  <Link href="/booking">
                    <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                      <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full">
                        Book Your First Session
                      </Button>
                    </motion.div>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {bookings.slice(0, 5).map((booking, index) => (
                    <motion.div
                      key={booking.bookingId}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: index * 0.1 }}
                      className="relative border-l-4 border-teal-500 bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-300"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-lg font-semibold text-teal-900">{booking.serviceCategory}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-teal-500" />
                              <span>{new Date(booking.startDateTime).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-teal-500" />
                              <span>
                                {new Date(booking.startDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                                {new Date(booking.endDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-teal-500" />
                              <span>{booking.location.address}</span>
                            </div>
                          </div>
                          {booking.additionalNotes && (
                            <div className="mt-3 p-3 bg-teal-50 rounded-md">
                              <p className="text-sm text-teal-900">
                                <strong>Notes:</strong> {booking.additionalNotes}
                              </p>
                            </div>
                          )}
                          {booking.adminNotes && (
                            <div className="mt-3 p-3 bg-coral-50 rounded-md">
                              <p className="text-sm text-coral-900">
                                <strong>Admin Response:</strong> {booking.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 self-end sm:self-start">
                          Submitted {new Date(booking.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                  {bookings.length > 5 && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                      className="text-center pt-4"
                    >
                      <Link href="/bookings">
                        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                          <Button variant="outline" className="rounded-full border-teal-500 text-teal-500 hover:bg-teal-100">
                            View All Bookings ({bookings.length})
                          </Button>
                        </motion.div>
                      </Link>
                    </motion.div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </Layout>
  );
}