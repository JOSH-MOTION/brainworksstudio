'use client';

import { ReactNode, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LogOut, Menu, X, Instagram, Twitter, Facebook, Send, Linkedin, MessageCircle, Phone, Mail } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence, MotionConfig, Variants } from 'framer-motion';
import Image from 'next/image';
import { SITE, SERVICE_PILLARS } from '@/lib/site-config';

const NAV_ITEMS = [
  { href: '/portfolio', label: 'Work' },
  { href: '/services', label: 'Services' },
  { href: '/about', label: 'About' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Insights' },
  { href: '/contact', label: 'Contact' },
];

const isActive = (pathname: string, href: string) => pathname === href || pathname.startsWith(`${href}/`);

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
    <MotionConfig reducedMotion="user">
    <div className="min-h-screen font-sans">
        {/* Header - transparent over the homepage hero (all screen sizes); fills in with navy
            once the visitor scrolls, opens the mobile menu, or is on any other page */}
        <motion.header
          initial="hidden"
          animate={showNavbar ? "visible" : "hidden"}
          variants={{
            hidden: { opacity: 0, y: -100 },
            visible: { opacity: 1, y: 0 },
          }}
          transition={{ duration: 0.3 }}
          className={`fixed top-0 left-0 w-full z-50 transition-colors duration-300 ${
            pathname !== '/' || lastScrollY > 80 || mobileMenuOpen
              ? 'bg-navy-900/95 backdrop-blur-md'
              : 'bg-transparent'
          }`}
        >
          <div className="max-w-[95%] mx-auto px-4 sm:px-6">
            <div className="flex justify-between items-center h-20">
              {/* Logo - Left Aligned */}
              <Link href="/" className="flex items-center" aria-label="Brain Works Studio Africa — home">
                <motion.div
                  whileHover={{ scale: 1.03 }}
                  transition={{ duration: 0.3, type: 'spring' }}
                >
                  <Image
                    src="/logo-white.png"
                    alt="Brain Works Studio Africa"
                    width={112}
                    height={48}
                    priority
                    className="h-7 w-auto lg:h-8"
                  />
                </motion.div>
              </Link>

              {/* Desktop Navigation - Right Aligned with small text */}
              <nav className="hidden lg:flex items-center space-x-8" aria-label="Main">
                {NAV_ITEMS.map((item, index) => (
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
                      aria-current={isActive(pathname, item.href) ? 'page' : undefined}
                      className={`text-xs font-medium uppercase tracking-wider transition-all duration-300 ${
                        isActive(pathname, item.href)
                          ? 'text-gold-300'
                          : 'text-white/80 hover:text-white'
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}

                <Link
                  href="/contact"
                  className="rounded-full bg-gold-500 px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-lg shadow-gold-500/20 transition-colors hover:bg-gold-400"
                >
                  Start a Project
                </Link>

                {/* User Auth Section */}
                {user ? (
                  <div className="flex items-center space-x-6 ml-2 pl-6 border-l border-white/15">
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
                        <Link href="/admin" className="text-xs font-medium text-gold-400 hover:text-gold-300 uppercase tracking-wider transition-colors">
                          Admin
                        </Link>
                      </motion.div>
                    )}
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-white hover:text-white/80 hover:bg-gold-600 uppercase tracking-wider"
                        onClick={signOut}
                      >
                        <LogOut className="h-3 w-3 mr-2" />
                        Logout
                      </Button>
                    </motion.div>
                  </div>
                ) : (
                  <Link href="/auth/login" className="text-xs font-medium text-white/60 hover:text-white uppercase tracking-wider transition-colors">
                    Client Login
                  </Link>
                )}
              </nav>

              {/* Mobile: Start a Project stays visible next to the menu button */}
              <div className="flex items-center gap-2 lg:hidden">
                <Link
                  href="/contact"
                  className="rounded-full bg-gold-500 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-white"
                >
                  Start a Project
                </Link>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2"
                  aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                  aria-expanded={mobileMenuOpen}
                >
                  {mobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
                </motion.button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  variants={mobileMenuVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="lg:hidden absolute top-full left-0 w-full bg-navy-900/95 backdrop-blur-xl"
                >
                  <div className="flex flex-col space-y-1 py-6 px-6">
                    {[{ href: '/', label: 'Home' }, ...NAV_ITEMS].map((item, index) => (
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
                              ? 'text-gold-300'
                              : 'text-white/80 hover:text-white'
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {item.label}
                        </Link>
                      </motion.div>
                    ))}

                    {/* Quick contact */}
                    <div className="grid grid-cols-2 gap-3 pt-4">
                      <a
                        href={SITE.whatsappUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        <MessageCircle className="h-4 w-4" /> WhatsApp
                      </a>
                      <a
                        href={`tel:${SITE.phoneE164}`}
                        className="flex items-center justify-center gap-2 rounded-full border border-white/20 px-4 py-3 text-xs font-bold uppercase tracking-wider text-white"
                      >
                        <Phone className="h-4 w-4" /> Call
                      </a>
                    </div>

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
                      <Link
                        href="/auth/login"
                        onClick={() => setMobileMenuOpen(false)}
                        className="block px-4 pt-4 text-xs font-medium uppercase tracking-wider text-white/60 hover:text-white"
                      >
                        Client Login
                      </Link>
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
          className="bg-navy-950 text-gray-300 border-t border-white/5"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Company Info */}
              <motion.div custom={0} variants={footerSectionVariants} className="col-span-1 sm:col-span-2 lg:col-span-1">
                <Link href="/" className="inline-block mb-5" aria-label="Brain Works Studio Africa — home">
                  <Image
                    src="/logo-white.png"
                    alt="Brain Works Studio Africa"
                    width={150}
                    height={64}
                    className="h-12 w-auto"
                  />
                </Link>
                <p className="text-sm text-gray-400 mb-4 leading-relaxed">
                  {SITE.positioning}
                </p>
                <ul className="mb-5 space-y-2 text-sm">
                  <li>
                    <a href={`mailto:${SITE.email}`} className="flex items-center gap-2 text-gray-400 hover:text-gold-300">
                      <Mail className="h-4 w-4" /> {SITE.email}
                    </a>
                  </li>
                  <li>
                    <a href={`tel:${SITE.phoneE164}`} className="flex items-center gap-2 text-gray-400 hover:text-gold-300">
                      <Phone className="h-4 w-4" /> {SITE.phoneDisplay}
                    </a>
                  </li>
                  <li>
                    <a href={SITE.whatsappUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-400 hover:text-gold-300">
                      <MessageCircle className="h-4 w-4" /> WhatsApp us
                    </a>
                  </li>
                </ul>
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
                      <social.icon className="h-5 w-5 text-gray-400 hover:text-gold-400 transition-colors" />
                    </motion.a>
                  ))}
                </div>
              </motion.div>

              {/* Services */}
              <motion.div custom={1} variants={footerSectionVariants}>
                <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Services</h3>
                <ul className="space-y-2 text-sm">
                  {SERVICE_PILLARS.map((pillar) => (
                    <motion.li key={pillar.slug} whileHover={{ x: 5 }} transition={{ duration: 0.2 }}>
                      <Link href={pillar.href} className="text-gray-400 hover:text-gold-300 transition-colors">
                        {pillar.name}
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Quick Links */}
              <motion.div custom={2} variants={footerSectionVariants}>
                <h3 className="text-base font-bold text-white mb-4 uppercase tracking-wider">Quick Links</h3>
                <ul className="space-y-2 text-sm">
                  {[
                    { href: '/contact', label: 'Start a Project' },
                    { href: '/portfolio', label: 'Our Work' },
                    { href: '/services', label: 'Services' },
                    { href: '/about', label: 'About Us' },
                    { href: '/pricing', label: 'Pricing' },
                    { href: '/blog', label: 'Insights' },
                    { href: '/booking', label: 'Book a Session' },
                  ].map((link, index) => (
                    <motion.li
                      key={index}
                      whileHover={{ x: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Link href={link.href} className="text-gray-400 hover:text-gold-300 transition-colors">
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
                    className="bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:border-gold-400 focus:ring-gold-400/20 rounded-lg"
                    required
                    disabled={loading}
                  />
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Button
                      type="submit"
                      className="w-full bg-gold-500 text-white hover:bg-gold-600 font-semibold rounded-lg shadow-lg shadow-gold-500/20"
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
              <p>&copy; {new Date().getFullYear()} Brain Works Studio Africa. All rights reserved.</p>
            </motion.div>
          </div>
        </motion.footer>
    </div>
    </MotionConfig>
  );
}