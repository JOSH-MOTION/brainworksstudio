'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, User, LogOut, Menu, Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

// Metadata
export const metadata: Metadata = {
  title: 'Brain Works Studio',
  description: 'Professional photography and videography services',
};

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
  children: ReactNode;
}

// Animation variants for header
const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

// Animation variants for mobile menu
const mobileMenuVariants = {
  hidden: { opacity: 0, x: '100%' },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
  exit: { opacity: 0, x: '100%', transition: { duration: 0.2 } },
};

// Animation variants for nav links
const navLinkVariants = {
  hover: { scale: 1.05, color: '#F97316', transition: { duration: 0.2 } }, // orange-500
  tap: { scale: 0.95 },
};

// Animation variants for footer sections
const footerSectionVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
};

// Animation variants for social icons
const socialIconVariants = {
  hover: { scale: 1.2, color: '#F97316', transition: { duration: 0.2 } }, // orange-500
  tap: { scale: 0.9 },
};

export default function RootLayout({ children }: LayoutProps) {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      // Replace with your actual API endpoint
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      if (response.ok) {
        alert('Subscribed successfully!');
        setNewsletterEmail('');
      } else {
        alert('Failed to subscribe. Please try again.');
      }
    } catch (error) {
      console.error('Error subscribing to newsletter:', error);
      alert('An error occurred. Please try again later.');
    }
  };

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white`}>
        {!isAdminRoute && (
          <motion.header
            initial="hidden"
            animate="visible"
            variants={headerVariants}
            className="fixed top-0 left-0 w-full bg-white shadow-md z-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    <Camera className="h-8 w-8 text-orange-500" />
                  </motion.div>
                  <span className="text-xl font-bold text-blue-900">Brain Works Studio</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-6">
                  {[
                    { href: '/', label: 'Home' },
                    { href: '/portfolio', label: 'Portfolio' },
                    { href: '/about', label: 'About' },
                    { href: '/contact', label: 'Contact' },
                    { href: '/booking', label: 'Book Session' },
                  ].map((item) => (
                    <motion.div key={item.href} variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link
                        href={item.href}
                        className={`text-blue-900 hover:text-orange-500 transition-colors ${
                          pathname === item.href ? 'text-orange-600 font-semibold' : ''
                        }`}
                      >
                        {item.label}
                      </Link>
                    </motion.div>
                  ))}
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Link href="/dashboard" className="text-blue-900 hover:text-orange-500">
                          Dashboard
                        </Link>
                      </motion.div>
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Link href="/bookings" className="text-blue-900 hover:text-orange-500">
                          My Bookings
                        </Link>
                      </motion.div>
                      {isAdmin && (
                        <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                          <Link href="/admin" className="text-orange-600 hover:text-orange-500">
                            Admin
                          </Link>
                        </motion.div>
                      )}
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-orange-600 text-orange-600 hover:bg-orange-500 hover:text-white"
                          onClick={signOut}
                        >
                          <LogOut className="h-4 w-4 mr-2" />
                          Logout
                        </Button>
                      </motion.div>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Link href="/auth/login">
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-orange-600 text-orange-600 hover:bg-orange-500 hover:text-white"
                          >
                            Login
                          </Button>
                        </Link>
                      </motion.div>
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Link href="/auth/signup">
                          <Button size="sm" className="bg-orange-600 hover:bg-orange-500 text-white">
                            Sign Up
                          </Button>
                        </Link>
                      </motion.div>
                    </div>
                  )}
                </nav>

                {/* Mobile Menu Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2"
                >
                  <Menu className="h-6 w-6 text-orange-600" />
                </motion.button>
              </div>

              {/* Mobile Navigation */}
              <AnimatePresence>
                {mobileMenuOpen && (
                  <motion.div
                    variants={mobileMenuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    className="md:hidden bg-white border-t border-orange-100 absolute top-16 left-0 w-full shadow-lg"
                  >
                    <div className="flex flex-col space-y-2 py-4 px-4">
                      {[
                        { href: '/', label: 'Home' },
                        { href: '/portfolio', label: 'Portfolio' },
                        { href: '/about', label: 'About' },
                        { href: '/contact', label: 'Contact' },
                        { href: '/booking', label: 'Book Session' },
                      ].map((item) => (
                        <motion.div
                          key={item.href}
                          whileHover={{ x: 10 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Link
                            href={item.href}
                            className={`block px-4 py-2 text-blue-900 hover:bg-orange-50 hover:text-orange-500 ${
                              pathname === item.href ? 'text-orange-600 font-semibold' : ''
                            }`}
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                      {user ? (
                        <>
                          <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              href="/dashboard"
                              className="block px-4 py-2 text-blue-900 hover:bg-orange-50 hover:text-orange-500"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Dashboard
                            </Link>
                          </motion.div>
                          <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              href="/bookings"
                              className="block px-4 py-2 text-blue-900 hover:bg-orange-50 hover:text-orange-500"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              My Bookings
                            </Link>
                          </motion.div>
                          {isAdmin && (
                            <>
                              {userProfile?.profileImageUrl && (
                                <motion.img
                                  src={userProfile.profileImageUrl}
                                  alt="Profile"
                                  className="w-8 h-8 rounded-full object-cover border border-orange-200 mx-4 my-2"
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  transition={{ duration: 0.3 }}
                                />
                              )}
                              <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                  href="/admin"
                                  className="block px-4 py-2 text-orange-600 hover:bg-orange-50 hover:text-orange-500"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Admin
                                </Link>
                              </motion.div>
                              <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                                <Link
                                  href="/admin/bookings"
                                  className="block px-4 py-2 text-orange-600 hover:bg-orange-50 hover:text-orange-500"
                                  onClick={() => setMobileMenuOpen(false)}
                                >
                                  Manage Bookings
                                </Link>
                              </motion.div>
                            </>
                          )}
                          <motion.button
                            whileHover={{ x: 10 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                              signOut();
                              setMobileMenuOpen(false);
                            }}
                            className="block text-left px-4 py-2 text-blue-900 hover:bg-orange-50 hover:text-orange-500"
                          >
                            Logout
                          </motion.button>
                        </>
                      ) : (
                        <>
                          <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              href="/auth/login"
                              className="block px-4 py-2 text-blue-900 hover:bg-orange-50 hover:text-orange-500"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Login
                            </Link>
                          </motion.div>
                          <motion.div whileHover={{ x: 10 }} whileTap={{ scale: 0.95 }}>
                            <Link
                              href="/auth/signup"
                              className="block px-4 py-2 text-orange-600 hover:bg-orange-50 hover:text-orange-500"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              Sign Up
                            </Link>
                          </motion.div>
                        </>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.header>
        )}

        {/* Main Content */}
        <main className={`${!isAdminRoute ? 'pt-16' : ''}`}>{children}</main>

        {!isAdminRoute && (
          <motion.footer
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={sectionVariants}
            className="bg-white text-blue-900 border-t border-orange-200"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
                {/* Company Info */}
                <motion.div custom={0} variants={footerSectionVariants} className="col-span-1 sm:col-span-2 lg:col-span-2">
                  <div className="flex items-center space-x-2 mb-4">
                    <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                      <Camera className="h-8 w-8 text-orange-600" />
                    </motion.div>
                    <span className="text-xl font-bold text-blue-900">Brain Works Studio</span>
                  </div>
                  <p className="text-blue-800 mb-4">
                    Transforming moments into timeless art with professional photography and videography.
                  </p>
                  <div className="flex space-x-4">
                    <motion.a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialIconVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Instagram className="h-6 w-6 text-blue-900" />
                    </motion.a>
                    <motion.a
                      href="https://twitter.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialIconVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Twitter className="h-6 w-6 text-blue-900" />
                    </motion.a>
                    <motion.a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialIconVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <Facebook className="h-6 w-6 text-blue-900" />
                    </motion.a>
                  </div>
                </motion.div>

                {/* Services */}
                <motion.div custom={1} variants={footerSectionVariants}>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Our Services</h3>
                  <ul className="space-y-2 text-blue-800">
                    {[
                      'Event Photography',
                      'Portrait Sessions',
                      'Product Photography',
                      'Commercial Work',
                      'Wedding Photography',
                      'Video Production',
                    ].map((service, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5, color: '#F97316' }}
                        transition={{ duration: 0.2 }}
                      >
                        {service}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Quick Links */}
                <motion.div custom={2} variants={footerSectionVariants}>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Quick Links</h3>
                  <ul className="space-y-2 text-blue-800">
                    {[
                      { href: '/about', label: 'About Us' },
                      { href: '/portfolio', label: 'Portfolio' },
                      { href: '/booking', label: 'Book a Session' },
                      { href: '/privacy', label: 'Privacy Policy' },
                      { href: '/terms', label: 'Terms of Service' },
                    ].map((link, index) => (
                      <motion.li
                        key={index}
                        whileHover={{ x: 5, color: '#F97316' }}
                        transition={{ duration: 0.2 }}
                      >
                        <Link href={link.href} className="hover:text-orange-500">
                          {link.label}
                        </Link>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>

                {/* Contact */}
                <motion.div custom={3} variants={footerSectionVariants}>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Contact Us</h3>
                  <div className="space-y-2 text-blue-800">
                    <p>
                      Email:{' '}
                      <a href="mailto:hello@brainworksstudio2.com" className="hover:text-orange-500">
                        hello@brainworksstudio2.com
                      </a>
                    </p>
                    <p>
                      Phone:{' '}
                      <a href="tel:+5551234567" className="hover:text-orange-500">
                        +233 242403450
                      </a>
                    </p>
                    <p>Location: Your City, State</p>
                  </div>
                </motion.div>

                {/* Newsletter */}
                <motion.div custom={4} variants={footerSectionVariants}>
                  <h3 className="text-lg font-semibold text-blue-900 mb-4">Stay Connected</h3>
                  <p className="text-blue-800 mb-4">Join our newsletter for updates, tips, and exclusive offers.</p>
                  <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-gray-50 text-blue-900 border-orange-300 focus:ring-orange-500"
                      required
                    />
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        type="submit"
                        className="bg-orange-600 text-white hover:bg-orange-500"
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Subscribe
                      </Button>
                    </motion.div>
                  </form>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="border-t border-orange-200 mt-12 pt-8 text-center text-blue-800"
              >
                <p>&copy; 2025 Brain Works Studio. All rights reserved.</p>
              </motion.div>
            </div>
          </motion.footer>
        )}
      </body>
    </html>
  );
}

// Animation variants for footer sections
const sectionVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
};