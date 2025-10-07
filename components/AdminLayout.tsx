'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Camera, LogOut, Menu, Calendar, Users, Settings, Folder, FileText, DollarSign, Star, User } from 'lucide-react';
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

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  if (!user || !isAdmin) {
    return null; // Redirect handled in child components
  }

  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 font-sans">
        {/* Admin Header */}
        <motion.header
          initial="hidden"
          animate="visible"
          variants={headerVariants}
          className="fixed top-0 left-0 w-full bg-teal-900 text-white shadow-sm z-50"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo */}
              <Link href="/admin" className="flex items-center space-x-2">
                <motion.div
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/brain1.png"
                    alt="Brain Works Studio Logo"
                    width={32}
                    height={32}
                  />
                </motion.div>
                <span className="text-base font-bold text-white">
                  Brain Works Studio
                </span>
              </Link>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-6">
                {[
                  { href: '/admin', label: 'Dashboard', icon: Settings },
                  { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
                  { href: '/admin/portfolio', label: 'Portfolio', icon: Folder },
                  { href: '/admin/blog', label: 'Blog', icon: FileText },
                  { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
                  { href: '/admin/reviews', label: 'Reviews', icon: Star },
                  { href: '/admin/users', label: 'Clients', icon: Users },
                  { href: '/admin/profile', label: 'Profile', icon: User }, // Updated to /admin/profile
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
                      className={`text-white hover:text-coral-500 text-sm ${
                        pathname === item.href ? 'text-coral-500 font-semibold' : ''
                      }`}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <motion.div variants={navLinkVariants} whileHover="hover" whileTap="tap">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-coral-100 text-teal-500 hover:bg-coral-50 hover:text-coral-600 text-sm"
                    onClick={signOut}
                  >
                    <LogOut className="h-4 w-4 mr-1" />
                    Logout
                  </Button>
                </motion.div>
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
                  className="md:hidden bg-teal-900 absolute top-16 left-0 w-full shadow-sm"
                >
                  <div className="flex flex-col space-y-2 py-3 px-4">
                    {[
                      { href: '/admin', label: 'Dashboard', icon: Settings },
                      { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
                      { href: '/admin/portfolio', label: 'Portfolio', icon: Folder },
                      { href: '/admin/blog', label: 'Blog', icon: FileText },
                      { href: '/admin/pricing', label: 'Pricing', icon: DollarSign },
                      { href: '/admin/reviews', label: 'Reviews', icon: Star },
                      { href: '/admin/users', label: 'Clients', icon: Users },
                      { href: '/admin/profile', label: 'Profile', icon: User }, // Updated to /admin/profile
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
                          className={`block px-3 py-1 text-white hover:bg-coral-50 hover:text-coral-500 text-sm flex items-center space-x-2 ${
                            pathname === item.href ? 'text-coral-500 font-semibold' : ''
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          <item.icon className="h-4 w-4" />
                          <span>{item.label}</span>
                        </Link>
                      </motion.div>
                    ))}
                    <motion.button
                      custom={8}
                      initial={{ opacity: 0, x: 15 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.8 }}
                      onClick={() => {
                        signOut();
                        setMobileMenuOpen(false);
                      }}
                      className="block text-left px-3 py-1 text-white hover:bg-coral-50 hover:text-coral-500 text-sm flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </motion.button>
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
          variants={headerVariants}
          className="bg-teal-900 text-white"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 text-center">
            <p className="text-sm">&copy; 2025 Brain Works Studio - Admin Portal. All rights reserved.</p>
          </div>
        </motion.footer>
      </body>
    </html>
  );
}