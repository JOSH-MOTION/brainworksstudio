// components/Layout.tsx
'use client';

import { ReactNode, FormEvent } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, User, LogOut, Menu, Instagram, Twitter, Facebook, Send,Linkedin } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import Image from 'next/image';

// Animation variants for header
const headerVariants: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, type: 'spring', stiffness: 140, damping: 20 },
  },
};

// Animation variants for mobile menu
const mobileMenuVariants: Variants = {
  hidden: { opacity: 0, x: '100%' },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.4, type: 'spring', stiffness: 120 },
  },
  exit: {
    opacity: 0,
    x: '100%',
    transition: { duration: 0.3, ease: 'easeInOut' },
  },
};

// Animation variants for nav links
const navLinkVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' },
  }),
  hover: { scale: 1.05, color: '#F56565' }, // coral-500
  tap: { scale: 0.95 },
};

// Animation variants for footer sections
const footerSectionVariants: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, delay: i * 0.08, ease: 'easeOut' },
  }),
};

// Animation variants for social icons
const socialIconVariants: Variants = {
  hover: { scale: 1.2, color: '#F56565' }, // coral-500
  tap: { scale: 0.9 },
};

// Animation variants for footer
const footerVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 },
  },
};

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();

  const handleNewsletterSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-white font-sans">
        {/* Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="fixed top-0 left-0 w-full bg-teal-50 shadow-sm z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              {/* Logo */}
<Link href="/" className="flex items-center space-x-2">
  <motion.div
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  >
    <Image
      src="/newlogo.png"     // 👈 your logo from public/
      alt="Brain Works Studio Africa Logo"
      width={60}            // adjust size as needed
      height={60}
      // className="filter invert-[0.35] sepia-[1] saturate-[8] hue-rotate-[140deg]" // teal tint
    />
  </motion.div>
  <span className="text-base font-bold text-[#001F44]">
    Brain Works Studio Africa
  </span>
</Link>


              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {[
                  { href: '/', label: 'Home' },
                  { href: '/portfolio', label: 'Portfolio' },
                  { href: '/pricing', label: 'Pricing' },
                  { href: '/blog', label: 'Blog' },
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
                      className={`text-[#001F44] hover:text-[#CB9D06] text-sm ${
                        pathname === item.href ? 'text-[#CB9D06] font-semibold' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                {user ? (
                  <div className="flex items-center space-x-4">
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/dashboard" className="text-[#001F44] hover:text-coral-500 text-sm">
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/bookings" className="text-[#001F44] hover:text-coral-500 text-sm">
                        Bookings
                      </Link>
                    </motion.div>
                    {isAdmin && (
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Link href="/admin" className="text-coral-500 hover:text-coral-600 text-sm">
                          Admin
                        </Link>
                      </motion.div>
                    )}
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-coral-100 text-coral-500 hover:bg-coral-50 text-sm"
                        onClick={signOut}
                      >
                        <LogOut className="h-4 w-4 mr-1" />
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3">
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/auth/login">
                        <Button
                          variant="outline"
                          size="sm"
                          className="border-coral-100 text-coral-500 hover:bg-coral-50 text-sm"
                        >
                          Login
                        </Button>
                      </Link>
                    </motion.div>
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/auth/signup">
                        <Button
                          size="sm"
                          className="bg-coral-500 text-white hover:bg-coral-600 text-sm"
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
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-5 w-5 text-coral-500" />
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
                  className="md:hidden bg-teal-50 absolute top-16 left-0 w-full shadow-sm"
                >
                  <div className="flex flex-col space-y-2 py-3 px-4">
                    {[
                      { href: '/', label: 'Home' },
                      { href: '/portfolio', label: 'Portfolio' },
                      { href: '/pricing', label: 'Pricing' },
                      { href: '/blog', label: 'Blog' },
                      { href: '/about', label: 'About' },
                      { href: '/contact', label: 'Contact' },
                      { href: '/booking', label: 'Book' },
                    ].map((item, index) => (
                      <motion.div
                        key={item.href}
                        custom={index}
                        initial={{ opacity: 0, x: 15 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.08 }}
                      >
                        <Link
                          href={item.href}
                          className={`block px-3 py-1 text-[#001F44] hover:bg-coral-50 hover:text-coral-500 text-sm ${
                            pathname === item.href ? 'text-coral-500 font-semibold' : ''
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}
                    {user ? (
                      <>
                        {userProfile?.profileImageUrl && (
                          <motion.img
                            src={userProfile.profileImageUrl}
                            alt="User profile"
                            className="w-6 h-6 rounded-full object-contain border border-coral-100 mx-3 my-1"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3 }}
                            onError={(e) => {
                              console.error('Failed to load profile image');
                              e.currentTarget.src = '/images/profile-placeholder.jpg';
                            }}
                          />
                        )}
                        <motion.div
                          custom={7}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                        >
                          <Link
                            href="/dashboard"
                            className="block px-3 py-1 text-[#001F44] hover:bg-coral-50 hover:text-coral-500 text-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={8}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.8 }}
                        >
                          <Link
                            href="/bookings"
                            className="block px-3 py-1 text-[#001F44] hover:bg-coral-50 hover:text-coral-500 text-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Bookings
                          </Link>
                        </motion.div>
                        {isAdmin && (
                          <>
                            <motion.div
                              custom={9}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 0.9 }}
                            >
                              <Link
                                href="/admin"
                                className="block px-3 py-1 text-coral-500 hover:bg-coral-50 hover:text-coral-600 text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Admin
                              </Link>
                            </motion.div>
                            <motion.div
                              custom={10}
                              initial={{ opacity: 0, x: 15 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.3, delay: 1.0 }}
                            >
                              <Link
                                href="/admin/bookings"
                                className="block px-3 py-1 text-coral-500 hover:bg-coral-50 hover:text-coral-600 text-sm"
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                Manage Bookings
                              </Link>
                            </motion.div>
                          </>
                        )}
                        <motion.button
                          custom={11}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 1.1 }}
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                          className="block text-left px-3 py-1 text-[#001F44] hover:bg-coral-50 hover:text-coral-500 text-sm"
                        >
                          Logout
                        </motion.button>
                      </>
                    ) : (
                      <>
                        <motion.div
                          custom={7}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.7 }}
                        >
                          <Link
                            href="/auth/login"
                            className="block px-3 py-1 text-[#001F44] hover:bg-coral-50 hover:text-coral-500 text-sm"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            Login
                          </Link>
                        </motion.div>
                        <motion.div
                          custom={8}
                          initial={{ opacity: 0, x: 15 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: 0.8 }}
                        >
                          <Link
                            href="/auth/signup"
                            className="block px-3 py-1 text-coral-500 hover:bg-coral-50 hover:text-coral-600 text-sm"
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
        <main className="pt-16">{children}</main>

        {/* Footer */}
        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
          className="bg-teal-50 text-[#001F44]"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Company Info */}
              <motion.div custom={0} variants={footerSectionVariants} className="col-span-1 sm:col-span-2 lg:col-span-1">
               <Link href="/" className="flex items-center space-x-2">
  <motion.div
    whileHover={{ scale: 1.1 }}
    transition={{ duration: 0.3 }}
  >
    <Image
      src="/newlogo.png"     // 👈 your logo from public/
      alt="Brain Works Studio Africa Logo"
      width={32}            // adjust size as needed
      height={32}
      // className="filter invert-[0.35] sepia-[1] saturate-[8] hue-rotate-[140deg]" // teal tint
    />
  </motion.div>
  <span className="text-base font-bold text-[#001F44]">
    Brain Works Studio Africa
  </span>
</Link>
                <p className="text-sm text-gray-600 mb-3">
                  Crafting timeless visuals with passion and creativity.
                </p>
                <div className="flex space-x-3">
                  {[
                    { href: 'https://www.instagram.com/brainworks_studio_africa?igsh=dmg2MzU5NDNnOXg%3D&utm_source=qr', icon: Instagram, label: 'Instagram' },
                    { href: 'https://x.com/bws_africa?s=21', icon: Twitter, label: 'Twitter' },
                    { href: 'https://www.facebook.com/share/17AbCs7VRQ/?mibextid=wwXIfr', icon: Facebook, label: 'Facebook' },
                     { href: 'https://www.linkedin.com/in/brain-works-studio-africa-06491b381?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app', icon: Linkedin, label: 'Linkedin' },
                  ].map((social, index) => (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      variants={socialIconVariants}
                      whileHover="hover"
                      whileTap="tap"
                      aria-label={`Visit our ${social.label}`}
                    >
                      <social.icon className="h-5 w-5 text-gray-600 hover:text-coral-500" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Services */}
              <motion.div custom={1} variants={footerSectionVariants}>
                <h3 className="text-base font-semibold text-[#001F44] mb-3">Our Services</h3>
                <ul className="space-y-1 text-sm text-gray-600">
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
                      whileHover={{ x: 5, color: '#F56565' }}
                      transition={{ duration: 0.3 }}
                    >
                      {service}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Quick Links */}
              <motion.div custom={2} variants={footerSectionVariants}>
                <h3 className="text-base font-semibold text-[#001F44] mb-3">Quick Links</h3>
                <ul className="space-y-1 text-sm text-gray-600">
                  {[
                    { href: '/about', label: 'About Us' },
                    { href: '/portfolio', label: 'Portfolio' },
                    { href: '/pricing', label: 'Pricing' },
                    { href: '/blog', label: 'Blog' },
                    { href: '/booking', label: 'Book a Session' },
                    { href: '/privacy', label: 'Privacy Policy' },
                    { href: '/terms', label: 'Terms of Service' },
                  ].map((link, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5, color: '#F56565' }}
                      transition={{ duration: 0.3 }}
                    >
                      <Link href={link.href} className="hover:text-coral-500">
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Newsletter */}
              <motion.div custom={3} variants={footerSectionVariants}>
                <h3 className="text-base font-semibold text-[#001F44] mb-3">Stay Connected</h3>
                <p className="text-sm text-gray-600 mb-3">Subscribe for updates and exclusive offers.</p>
                <form onSubmit={handleNewsletterSubmit} className="flex flex-col space-y-2">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-white text-gray-600 border-coral-100 focus:ring-coral-500 placeholder-gray-600 text-sm"
                    required
                    disabled={loading}
                  />
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="submit"
                      className="bg-coral-500 text-white hover:bg-coral-600 text-sm"
                      disabled={loading}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      {loading ? 'Subscribing...' : 'Subscribe'}
                    </Button>
                  </motion.div>
                </form>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className="border-t border-coral-100 mt-8 pt-6 text-center text-sm text-gray-600"
            >
              <p>&copy; 2025 Brain Works Studio Africa . All rights reserved.</p>
            </motion.div>
          </div>
        </motion.footer>
      </body>
    </html>
  );
}