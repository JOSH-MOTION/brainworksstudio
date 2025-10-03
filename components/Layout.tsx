'use client';

import { ReactNode, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, User, LogOut, Menu, Instagram, Twitter, Facebook, Send } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Animation variants for header
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -100 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 15 },
  },
};

// Animation variants for mobile menu
const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: '100%', scale: 0.9 },
  visible: {
    opacity: 1,
    x: 0,
    scale: 1,
    transition: { duration: 0.4, type: 'spring', stiffness: 120 },
  },
  exit: {
    opacity: 0,
    x: '100%',
    scale: 0.9,
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

// Animation variants for nav links
const navLinkVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' },
  }),
  hover: { scale: 1.1, color: '#FF6B6B', transition: { duration: 0.3 } }, // coral-400
  tap: { scale: 0.95 },
};

// Animation variants for footer sections
const footerSectionVariants: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: (i: number) => ({
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, delay: i * 0.15, type: 'spring', stiffness: 80 },
  }),
};

// Animation variants for social icons
const socialIconVariants: Variants = {
  hover: { scale: 1.3, rotate: 10, color: '#FF6B6B', transition: { duration: 0.3 } }, // coral-400
  tap: { scale: 0.9 },
};

// Animation variants for footer
const footerVariants: Variants = {
  hidden: { opacity: 0, y: 50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: 'easeInOut', staggerChildren: 0.2 },
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const pathname = usePathname();

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

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans">
        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="fixed top-0 left-0 w-full bg-white/80 backdrop-blur-md shadow-sm z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/" className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ duration: 0.5 }}
                >
                  <Camera className="h-8 w-8 text-teal-500" />
                </motion.div>
                <span className="text-xl font-extrabold text-teal-900">Brain Works Studio</span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-8">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/portfolio', label: 'Portfolio' },
                  { href: '/about', label: 'About' },
                  { href: '/contact', label: 'Contact' },
                  { href: '/booking', label: 'Book' },
                ].map((item, index) => (
                  <motion.div
                    key={item.href}
                    custom={index}
                    initial="hidden"
                    animate="visible"
                    variants={navLinkVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Link
                      href={item.href}
                      className={`text-teal-900 hover:text-coral-400 transition-colors ${
                        pathname === item.href ? 'text-coral-400 font-semibold' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {user ? (
                  <div className="flex items-center space-x-4">
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/dashboard" className="text-teal-900 hover:text-coral-400">
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/bookings" className="text-teal-900 hover:text-coral-400">
                        Bookings
                      </Link>
                    </motion.div>
                    {isAdmin && (
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Link href="/admin" className="text-coral-400 hover:text-coral-500">
                          Admin
                        </Link>
                      </motion.div>
                    )}
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-teal-500 text-teal-500 hover:bg-coral-400 hover:text-white"
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-4">
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/auth/login">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-teal-500 text-teal-500 hover:bg-coral-400 hover:text-white"
                        >
                          Login
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/auth/signup">
                        <Button
                          size="sm"
                          className="bg-coral-400 text-white hover:bg-coral-500"
                        >
                          Sign Up
                        </Button>
                      </Link>
                    </motion.div>
                  </div>
                )}
              </nav>

              {/* Mobile Menu Button */}
              <motion.button
                whileHover={{ scale: 1.2, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
              >
                <Menu className="h-6 w-6 text-coral-400" />
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
                  className="md:hidden bg-white/95 backdrop-blur-md absolute top-16 left-0 w-full shadow-lg"
                >
                  <div className="flex flex-col space-y-2 py-4 px-4">
                    {[
                      { href: '/', label: 'Home' },
                      { href: '/portfolio', label: 'Portfolio' },
                      { href: '/about', label: 'About' },
                      { href: '/contact', label: 'Contact' },
                      { href: '/booking', label: 'Book' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.href}
                        custom={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <Link
                          href={item.href}
                          className={`block px-4 py-2 text-teal-900 hover:bg-coral-50 hover:text-coral-400 ${
                            pathname === item.href ? 'text-coral-400 font-semibold' : ''
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    {user ? (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <Link
                            href="/dashboard"
                            className="block px-4 py-2 text-teal-900 hover:bg-coral-50 hover:text-coral-400"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <Link
                            href="/bookings"
                            className="block px-4 py-2 text-teal-900 hover:bg-coral-50 hover:text-coral-400"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Bookings
                          </Link>
                        </motion.div>
                        {isAdmin && (
                          <>
                            {userProfile?.profileImageUrl && (
                              <motion.img
                                src={userProfile.profileImageUrl}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover border border-coral-200 mx-4 my-2"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.4 }}
                              />
                            )}
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.7 }}
                            >
                              <Link
                                href="/admin"
                                className="block px-4 py-2 text-coral-400 hover:bg-coral-50 hover:text-coral-500"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Admin
                              </Link>
                            </motion.div>
                            <motion.div
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.8 }}
                            >
                              <Link
                                href="/admin/bookings"
                                className="block px-4 py-2 text-coral-400 hover:bg-coral-50 hover:text-coral-500"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Manage Bookings
                              </Link>
                            </motion.div>
                          </>
                        )}
                        <motion.button
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.9 }}
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="block text-left px-4 py-2 text-teal-900 hover:bg-coral-50 hover:text-coral-400"
                        >
                          Logout
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.5 }}
                        >
                          <Link
                            href="/auth/login"
                            className="block px-4 py-2 text-teal-900 hover:bg-coral-50 hover:text-coral-400"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                        </motion.div>
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.6 }}
                        >
                          <Link
                            href="/auth/signup"
                            className="block px-4 py-2 text-coral-400 hover:bg-coral-50 hover:text-coral-500"
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

        {/* Main Content */}
        <main className="pt-20">{children}</main>

        {/* Footer */}
        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
          className="bg-teal-900 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <motion.div custom={0} variants={footerSectionVariants} className="col-span-1 sm:col-span-2 lg:col-span-1">
                <div className="flex items-center space-x-2 mb-4">
                  <motion.div
                    whileHover={{ scale: 1.2, rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Camera className="h-8 w-8 text-coral-400" />
                  </motion.div>
                  <span className="text-xl font-extrabold text-white">Brain Works Studio</span>
                </div>
                <p className="text-gray-200 mb-4">
                  Crafting timeless visuals with passion and creativity.
                </p>
                <div className="flex space-x-4">
                  {[
                    { href: 'https://instagram.com', icon: Instagram },
                    { href: 'https://twitter.com', icon: Twitter },
                    { href: 'https://facebook.com', icon: Facebook },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialIconVariants}
                      whileHover="hover"
                      whileTap="tap"
                    >
                      <social.icon className="h-6 w-6 text-gray-200" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Services */}
              <motion.div custom={1} variants={footerSectionVariants}>
                <h3 className="text-lg font-semibold text-white mb-4">Our Services</h3>
                <ul className="space-y-2 text-gray-200">
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
                      whileHover={{ x: 10, color: '#FF6B6B' }}
                      transition={{ duration: 0.3 }}
                    >
                      {service}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Quick Links */}
              <motion.div custom={2} variants={footerSectionVariants}>
                <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
                <ul className="space-y-2 text-gray-200">
                  {[
                    { href: '/about', label: 'About Us' },
                    { href: '/portfolio', label: 'Portfolio' },
                    { href: '/booking', label: 'Book a Session' },
                    { href: '/privacy', label: 'Privacy Policy' },
                    { href: '/terms', label: 'Terms of Service' },
                  ].map((link, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 10, color: '#FF6B6B' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={link.href} className="hover:text-coral-400">
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Newsletter */}
              <motion.div custom={3} variants={footerSectionVariants}>
                <h3 className="text-lg font-semibold text-white mb-4">Stay Connected</h3>
                <p className="text-gray-200 mb-4">Subscribe for updates and exclusive offers.</p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-teal-800 text-white border-teal-600 focus:ring-coral-400 placeholder-gray-400"
                    required
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      className="bg-coral-400 text-white hover:bg-coral-500"
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
              transition={{ duration: 0.6, delay: 0.5 }}
              className="border-t border-teal-800 mt-12 pt-8 text-center text-gray-200"
            >
              <p>&copy; 2025 Brain Works Studio. All rights reserved.</p>
            </motion.div>
          </div>
        </motion.footer>
      </body>
    </html>
  );
}