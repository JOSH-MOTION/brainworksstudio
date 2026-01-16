'use client';

import { ReactNode, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, User, LogOut, Menu, Instagram, Twitter, Facebook, Send, Linkedin } from 'lucide-react';
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
    transition: { duration: 0.6, type: 'spring', stiffness: 100, damping: 20 },
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
    transition: { duration: 0.4, delay: i * 0.05, ease: 'easeOut' },
  }),
  hover: { scale: 1.05, y: -2 },
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
  hover: { scale: 1.2, rotate: 5 },
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
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide navbar
        setShowNavbar(false);
      } else {
        // Scrolling up - show navbar
        setShowNavbar(true);
      }
      
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

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
      <body className="min-h-screen font-sans">
        {/* Header - Conditional Background Based on Route and Screen Size */}
        <motion.header
          initial="hidden"
          animate={showNavbar ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: -100 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 w-full backdrop-blur-md z-50 ${
            pathname === '/' ? 'bg-slate-900/95 lg:bg-transparent' : 'bg-slate-900/95'
          }`}
        >
          <div className="max-w-[95%] mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-20">
              {/* Logo - Left Aligned */}
              <Link href="/" className="flex items-center space-x-2 group">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                >
                  <Image
                    src="/newlogo3.png"
                    alt="Brain Works Studio Africa Logo"
                    width={40}
                    height={40}
                    className="drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                  />
                </motion.div>
                <span className="text-lg font-bold tracking-[0.15em] text-white uppercase group-hover:text-teal-400 transition-colors duration-300">
                  BWSA
                </span>
              </Link>

              {/* Desktop Navigation - Right Aligned with small text */}
              <nav className="hidden lg:flex items-center space-x-8">
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
                      className={`text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                        pathname === item.href
                          ? 'text-white'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                {/* User Auth Section */}
                {user ? (
                  <div className="flex items-center space-x-6 ml-4">
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/dashboard" className="text-xs font-medium text-white/80 hover:text-white uppercase tracking-wider transition-colors">
                        Dashboard
                      </Link>
                    </motion.div>
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/bookings" className="text-xs font-medium text-white/80 hover:text-white uppercase tracking-wider transition-colors">
                        Bookings
                      </Link>
                    </motion.div>
                    {isAdmin && (
                      <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                        <Link href="/admin" className="text-xs font-medium text-teal-400 hover:text-teal-300 uppercase tracking-wider transition-colors">
                          Admin
                        </Link>
                      </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-white hover:text-white/80 hover:bg-teal-600 uppercase tracking-wider"
                        onClick={signOut}
                      >
                        <LogOut className="h-3 w-3 mr-2" />
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-6 ml-4">
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/auth/login" className="text-xs font-medium text-white/80 hover:text-white uppercase tracking-wider transition-colors">
                        Login
                      </Link>
                    </motion.div>
                    <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                      <Link href="/auth/signup" className="text-xs font-medium text-white/80 hover:text-white uppercase tracking-wider transition-colors">
                        Sign Up
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
                className="lg:hidden p-2"
                aria-label="Toggle mobile menu"
              >
                <Menu className="h-6 w-6 text-white" />
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
                  className="lg:hidden absolute top-full left-0 w-full bg-slate-900/95 backdrop-blur-xl"
                >
                  <div className="flex flex-col space-y-1 py-6 px-6">
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
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                      >
                        <Link
                          href={item.href}
                          className={`block px-4 py-3 text-sm font-medium uppercase tracking-wider transition-colors ${
                            pathname === item.href
                              ? 'text-white'
                              : 'text-white/80 hover:text-white'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}

                    {/* Mobile Auth Buttons */}
                    {user ? (
                      <div className="pt-4 space-y-3">
                        <Link href="/dashboard" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-xs uppercase tracking-wider">
                            Dashboard
                          </Button>
                        </Link>
                        <Link href="/bookings" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-xs uppercase tracking-wider">
                            Bookings
                          </Button>
                        </Link>
                        {isAdmin && (
                          <Link href="/admin" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-xs uppercase tracking-wider">
                              Admin
                            </Button>
                          </Link>
                        )}
                        <Button
                          variant="outline"
                          className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 text-xs uppercase tracking-wider"
                          onClick={() => {
                            signOut();
                            setMobileMenuOpen(false);
                          }}
                        >
                          Logout
                        </Button>
                      </div>
                    ) : (
                      <div className="pt-4 space-y-3">
                        <Link href="/auth/login" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-xs uppercase tracking-wider">
                            Login
                          </Button>
                        </Link>
                        <Link href="/auth/signup" onClick={() => setMobileMenuOpen(false)}>
                          <Button className="w-full bg-white/10 text-white hover:bg-white/20 backdrop-blur-sm text-xs uppercase tracking-wider">
                            Sign Up
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.header>

        {/* Main Content - Conditional Padding */}
        <main className={pathname === '/' ? '' : 'pt-20'}>{children}</main>

        {/* Footer - Dark Theme */}
        <motion.footer
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={footerVariants}
          className="bg-slate-950 text-gray-300 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <motion.div custom={0} variants={footerSectionVariants} className="col-span-1 sm:col-span-2 lg:col-span-1">
                <Link href="/" className="flex items-center space-x-3 mb-4">
                  <Image
                    src="/newlogo3.png"
                    alt="Brain Works Studio Africa Logo"
                    width={40}
                    height={40}
                    className="drop-shadow-[0_0_8px_rgba(20,184,166,0.3)]"
                  />
                  <span className="text-lg font-bold text-white uppercase tracking-wider">
                    BWSA
                  </span>
                </Link>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  Crafting timeless visuals with passion and creativity. Your moments, our artistry.
                </p>
                <div className="flex space-x-4">
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
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors"
                      aria-label={`Visit our ${social.label}`}
                    >
                      <social.icon className="h-5 w-5 text-gray-400 hover:text-teal-400 transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Services */}
              <motion.div custom={1} variants={footerSectionVariants}>
                <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Services</h3>
                <ul className="space-y-2 text-sm">
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
                      whileHover={{ x: 5, color: '#5eead4' }}
                      transition={{ duration: 0.2 }}
                      className="text-gray-400 hover:text-teal-300 cursor-pointer"
                    >
                      {service}
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Quick Links */}
              <motion.div custom={2} variants={footerSectionVariants}>
                <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-2 text-sm">
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
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={link.href} className="text-gray-400 hover:text-teal-300 transition-colors">
                        {link.label}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Newsletter */}
              <motion.div custom={3} variants={footerSectionVariants}>
                <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Stay Connected</h3>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  Subscribe for updates and exclusive offers.
                </p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Your email"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-teal-400 focus:ring-teal-400/20 rounded-lg"
                    required
                    disabled={loading}
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-teal-500 text-white hover:bg-teal-600 font-semibold rounded-lg shadow-lg shadow-teal-500/20"
                      disabled={loading}
                    >
                      <Send className="h-4 w-4 mr-2" />
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
              className="border-t border-white/5 mt-12 pt-8 text-center text-sm text-gray-500"
            >
              <p>&copy; 2025 Brain Works Studio Africa. All rights reserved.</p>
            </motion.div>
          </div>
        </motion.footer>
      </body>
    </html>
  );
}