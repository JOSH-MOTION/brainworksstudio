'use client';

import { useState, useEffect } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth';
import { Booking } from '@/types';
import { Calendar, Clock, MapPin, Search, Filter } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// Animation variants for sections
const sectionVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

// Animation variants for hero content
const heroContentVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.4, type: 'spring', stiffness: 140, damping: 20 },
  },
};

// Animation variants for hero words
const wordVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, delay: index * 0.07, ease: 'easeOut' },
  }),
};

// Animation variants for cards (stats and bookings)
const cardVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (index: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: index * 0.08, ease: 'easeOut' },
  }),
  hover: {
    scale: 1.02,
    y: -3,
    transition: { duration: 0.3, type: 'spring', stiffness: 140 },
  },
};

export default function UserBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { user, firebaseUser } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push('/auth/login');
      return;
    }
    fetchBookings();
  }, [user, router]);

  useEffect(() => {
    filterBookings();
  }, [bookings, searchTerm, statusFilter]);

  const fetchBookings = async () => {
    try {
      const token = await firebaseUser?.getIdToken();
      const response = await fetch('/api/bookings/user', {
        headers: {
          'Authorization': `Bearer ${token}`,
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

  const filterBookings = () => {
    let filtered = bookings;
    if (searchTerm) {
      filtered = filtered.filter(
        (booking) =>
          booking.serviceCategory.toLowerCase().includes(searchTerm.toLowerCase()) ||
          booking.location.address.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }
    setFilteredBookings(filtered);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'bg-teal-100 text-teal-800';
      case 'rejected':
        return 'bg-coral-100 text-coral-800';
      default:
        return 'bg-teal-50 text-teal-600';
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

  // Split the heading text for animation
  const headingText = 'Your Bookings'.split(' ');

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <Layout>
        <motion.div
          initial="hidden"
          animate="visible"
          variants={sectionVariants}
          className="min-h-screen flex items-center justify-center"
        >
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 border-b-2 border-teal-500 mx-auto"></div>
            <p className="mt-3 text-sm text-gray-600">Loading your bookings...</p>
          </div>
        </motion.div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Hero Section */}
      <motion.section
        initial="hidden"
        animate="visible"
        variants={sectionVariants}
        className="relative min-h-[30vh] flex items-center justify-center bg-teal-50"
      >
        <motion.div
          variants={heroContentVariants}
          className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
        >
          <motion.h1 className="text-2xl md:text-3xl font-bold text-[#001F44] mb-3">
            {headingText.map((word, index) => (
              <motion.span
                key={index}
                custom={index}
                variants={wordVariants}
                initial="hidden"
                animate="visible"
                className="inline-block mr-2"
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>
          <motion.p
            custom={0}
            variants={wordVariants}
            className="text-sm md:text-base text-gray-600 max-w-lg mx-auto"
          >
            View and manage your photography session requests.
          </motion.p>
        </motion.div>
      </motion.section>

      {/* Main Content */}
      <motion.div
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={sectionVariants}
        className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8"
      >
        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          {[
            { number: bookings.length, label: 'Total Bookings', color: 'text-[#001F44]' },
            { number: bookings.filter((b) => b.status === 'pending').length, label: 'Pending', color: 'text-teal-600' },
            { number: bookings.filter((b) => b.status === 'accepted').length, label: 'Approved', color: 'text-teal-600' },
            { number: bookings.filter((b) => b.status === 'rejected').length, label: 'Declined', color: 'text-coral-600' },
          ].map((stat, index) => (
            <motion.div
              key={index}
              custom={index}
              variants={cardVariants}
              whileHover="hover"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              <Card className="bg-teal-50 border-coral-100 rounded-xl shadow-sm">
                <CardContent className="p-4 text-center">
                  <div className={`text-xl font-bold ${stat.color}`}>{stat.number}</div>
                  <div className="text-xs text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="bg-teal-50 border-coral-100 rounded-xl shadow-sm mb-6">
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coral-500 h-4 w-4" />
                    <Input
                      placeholder="Search by service or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-coral-200 focus:ring-teal-500 rounded-md text-sm"
                    />
                  </div>
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[140px] border-coral-200 focus:ring-teal-500 rounded-md">
                    <Filter className="h-4 w-4 mr-2 text-coral-500" />
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="accepted">Approved</SelectItem>
                    <SelectItem value="rejected">Declined</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Bookings List */}
        <motion.div
          custom={1}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Card className="bg-teal-50 border-coral-100 rounded-xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-xl text-[#001F44]">Your Booking History</CardTitle>
              <CardDescription className="text-sm text-gray-600">
                All your session requests and their current status
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredBookings.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="h-10 w-10 text-gray-400 mx-auto mb-3" />
                  <h3 className="text-base font-medium text-[#001F44] mb-2">
                    {bookings.length === 0 ? 'No bookings yet' : 'No bookings match your filters'}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {bookings.length === 0
                      ? 'Start by booking your first photography session!'
                      : 'Try adjusting your search or filter criteria.'}
                  </p>
                  {bookings.length === 0 && (
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/booking">
                        <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full text-sm">
                          Book Your First Session
                        </Button>
                      </Link>
                    </motion.div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredBookings.map((booking, index) => (
                    <motion.div
                      key={booking.bookingId}
                      custom={index}
                      variants={cardVariants}
                      whileHover="hover"
                      initial="hidden"
                      whileInView="visible"
                      viewport={{ once: true }}
                      className="border border-coral-100 rounded-lg p-4 hover:bg-teal-100 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-base font-semibold text-[#001F44]">{booking.serviceCategory}</h3>
                            <Badge className={getStatusColor(booking.status)}>
                              {getStatusText(booking.status)}
                            </Badge>
                          </div>
                          <div className="space-y-1 text-xs text-gray-600">
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4 text-coral-500" />
                              <span>{new Date(booking.startDateTime).toLocaleDateString()}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-coral-500" />
                              <span>
                                {new Date(booking.startDateTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}{' '}
                                -{' '}
                                {new Date(booking.endDateTime).toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4 text-coral-500" />
                              <span>{booking.location.address}</span>
                            </div>
                          </div>
                          {booking.additionalNotes && (
                            <div className="mt-2 p-2 bg-teal-50 rounded-md">
                              <p className="text-xs text-gray-700">
                                <strong>Your Notes:</strong> {booking.additionalNotes}
                              </p>
                            </div>
                          )}
                          {booking.adminNotes && (
                            <div className="mt-2 p-2 bg-coral-50 rounded-md">
                              <p className="text-xs text-coral-700">
                                <strong>Studio Response:</strong> {booking.adminNotes}
                              </p>
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500 text-right">
                          <div>Submitted</div>
                          <div>{new Date(booking.createdAt).toLocaleDateString()}</div>
                          {booking.updatedAt && booking.updatedAt !== booking.createdAt && (
                            <>
                              <div className="mt-1">Updated</div>
                              <div>{new Date(booking.updatedAt).toLocaleDateString()}</div>
                            </>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Quick Action */}
        <motion.div
          custom={2}
          variants={cardVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="mt-6 text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/booking">
              <Button className="bg-teal-500 hover:bg-teal-600 text-white rounded-full text-sm">
                <Calendar className="h-4 w-4 mr-2" />
                Book Another Session
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </motion.div>
    </Layout>
  );
}