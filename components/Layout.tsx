// components/Layout.tsx
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, User, LogOut, Menu, Instagram, Twitter, Facebook, Send, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

export const metadata: Metadata = {
  title: 'Brain Works Studio',
  description: 'Professional photography and videography services',
};

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
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

  const navigationItems = [
    { href: '/', label: 'Home' },
    { href: '/portfolio', label: 'Portfolio' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
    { href: '/booking', label: 'Book Session' },
  ];

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-white`}>
        {/* Enhanced Navbar */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
            scrolled
              ? 'bg-white/95 backdrop-blur-md shadow-lg py-3'
              : 'bg-transparent py-5'
          }`}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.95 }}
                  className={`p-2 rounded-xl transition-all duration-300 ${
                    scrolled
                      ? 'bg-gradient-to-br from-orange-500 to-blue-600'
                      : 'bg-white/10 backdrop-blur-sm'
                  }`}
                >
                  <Camera className="h-7 w-7 text-white" />
                </motion.div>
                <div>
                  <span
                    className={`text-xl font-bold transition-colors ${
                      scrolled ? 'text-gray-900' : 'text-white'
                    }`}
                  >
                    Brain Works Studio
                  </span>
                  <div
                    className={`text-xs font-medium transition-colors ${
                      scrolled ? 'text-orange-600' : 'text-orange-300'
                    }`}
                  >
                    Professional Production team
                  </div>
                </div>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navigationItems.map((item) => (
                  <motion.div
                    key={item.href}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      href={item.href}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        pathname === item.href
                          ? scrolled
                            ? 'bg-orange-50 text-orange-600'
                            : 'bg-white/20 text-white'
                          : scrolled
                          ? 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                          : 'text-white hover:bg-white/10'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
              </nav>

              {/* Desktop CTA Buttons */}
              <div className="hidden lg:flex items-center space-x-3">
                {user ? (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/dashboard">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${
                            scrolled
                              ? 'text-gray-700 hover:bg-gray-100'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          Dashboard
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/bookings">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
                        >
                          My Bookings
                        </Button>
                      </Link>
                    </motion.div>
                    {isAdmin && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/admin">
                          <Button
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800"
                          >
                            Admin
                          </Button>
                        </Link>
                      </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="outline"
                        size="sm"
                        className={`${
                          scrolled
                            ? 'border-orange-300 text-orange-600 hover:bg-orange-50'
                            : 'border-white/30 text-white bg-orange-500 hover:bg-white/10'
                        }`}
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4 mr-2 "  />
                        Logout
                      </Button>
                    </motion.div>
                  </>
                ) : (
                  <>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/auth/login">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`${
                            scrolled
                              ? 'text-gray-700 hover:bg-gray-100'
                              : 'text-white hover:bg-white/10'
                          }`}
                        >
                          Login
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/booking">
                        <Button
                          size="sm"
                          className="bg-gradient-to-r from-orange-500 to-orange-600 text-white hover:from-orange-600 hover:to-orange-700 shadow-lg shadow-orange-500/30"
                        >
                          Book Session
                        </Button>
                      </Link>
                    </motion.div>
                  </>
                )}
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`lg:hidden p-2 rounded-lg transition-all ${
                  scrolled
                    ? 'text-gray-900 hover:bg-gray-100'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </motion.button>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`lg:hidden mt-4 rounded-2xl overflow-hidden ${
                    scrolled ? 'bg-white shadow-xl' : 'bg-gray-900/95 backdrop-blur-md'
                  }`}
                >
                  <div className="py-4 space-y-2 px-2">
                    {navigationItems.map((item) => (
                      <motion.div
                        key={item.href}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Link
                          href={item.href}
                          className={`block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                            pathname === item.href
                              ? scrolled
                                ? 'bg-orange-50 text-orange-600'
                                : 'bg-white/20 text-white'
                              : scrolled
                              ? 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                              : 'text-white hover:bg-white/10'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    <div className="pt-4 space-y-2 border-t border-gray-200/20">
                      {user ? (
                        <>
                          <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                              Dashboard
                            </Button>
                          </Link>
                          <Link href="/bookings" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                              My Bookings
                            </Button>
                          </Link>
                          {isAdmin && (
                            <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                              <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700">
                                Admin
                              </Button>
                            </Link>
                          )}
                          <Button
                            variant="outline"
                            className="w-full"
                            onClick={() => {
                              signOut();
                              setMobileMenuOpen(false);
                            }}
                          >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                          </Button>
                        </>
                      ) : (
                        <>
                          <Link href="/booking" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600">
                              Book Session
                            </Button>
                          </Link>
                          <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="outline" className="w-full">
                              Login
                            </Button>
                          </Link>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Main Content */}
        <main className="pt-0">{children}</main>

        {/* Footer remains the same */}
        <motion.footer
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="bg-white text-blue-900 border-t border-orange-200"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
              {/* Company Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0, duration: 0.5 }}
                className="col-span-1 sm:col-span-2 lg:col-span-2"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div whileHover={{ scale: 1.1, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                    <Camera className="h-8 w-8 text-orange-600" />
                  </motion.div>
                  <span className="text-xl font-bold text-blue-900">Brain Works Studio</span>
                </div>
                <p className="text-blue-800 mb-4">
                  Transforming moments into timeless art with professional photography and videography.
                </p>
                <div className="flex space-x-4">
                  {[
                    { icon: Instagram, href: 'https://instagram.com' },
                    { icon: Twitter, href: 'https://twitter.com' },
                    { icon: Facebook, href: 'https://facebook.com' },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.2, color: '#F97316' }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <social.icon className="h-6 w-6 text-blue-900" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Services */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
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
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
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
                    <a href="tel:+233242403450" className="hover:text-orange-500">
                      +233 242403450
                    </a>
                  </p>
                  <p>Location: Your City, State</p>
                </div>
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
      </body>
    </html>
  );
}