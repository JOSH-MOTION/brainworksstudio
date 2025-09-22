// app/layout.tsx
'use client';

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Camera, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export const metadata: Metadata = {
  title: 'Brain Works Studio',
  description: 'Photography studio management',
};

const inter = Inter({ subsets: ['latin'] });

interface LayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: LayoutProps) {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen bg-gradient-to-br from-amber-50 to-orange-50`}>
        {!isAdminRoute && (
          <header className="bg-white shadow-sm border-b border-amber-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                {/* Logo */}
                <Link href="/" className="flex items-center space-x-2">
                  <Camera className="h-8 w-8 text-amber-700" />
                  <span className="text-xl font-bold text-amber-900">Brain Works Studio</span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center space-x-8">
                  <Link href="/" className="text-gray-600 hover:text-amber-700 transition-colors">
                    Home
                  </Link>
                  <Link href="/portfolio" className="text-gray-600 hover:text-amber-700 transition-colors">
                    Portfolio
                  </Link>
                  <Link href="/about" className="text-gray-600 hover:text-amber-700 transition-colors">
                    About
                  </Link>
                  <Link href="/contact" className="text-gray-600 hover:text-amber-700 transition-colors">
                    Contact
                  </Link>
                  <Link href="/booking" className="text-gray-600 hover:text-amber-700 transition-colors">
                    Book Session
                  </Link>
                  {user ? (
                    <div className="flex items-center space-x-4">
                      <Link href="/dashboard" className="text-gray-600 hover:text-amber-700 transition-colors">
                        Dashboard
                      </Link>
                      <Link href="/bookings" className="text-gray-600 hover:text-amber-700 transition-colors">
                        My Bookings
                      </Link>
                      {isAdmin && (
                        <Link href="/admin" className="text-red-600 hover:text-red-700 transition-colors">
                          Admin
                        </Link>
                      )}
                      <Button variant="outline" onClick={signOut} size="sm">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Link href="/auth/login">
                        <Button variant="outline" size="sm">Login</Button>
                      </Link>
                      <Link href="/auth/signup">
                        <Button size="sm" className="bg-amber-700 hover:bg-amber-800">Sign Up</Button>
                      </Link>
                    </div>
                  )}
                </nav>

                {/* Mobile menu button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="md:hidden p-2"
                >
                  <Menu className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Mobile Navigation */}
              {mobileMenuOpen && (
                <div className="md:hidden py-4 border-t border-amber-200">
                  <div className="flex flex-col space-y-2">
                    <Link href="/" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                      Home
                    </Link>
                    <Link href="/portfolio" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                      Portfolio
                    </Link>
                    <Link href="/about" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                      About
                    </Link>
                    <Link href="/contact" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                      Contact
                    </Link>
                    <Link href="/booking" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                      Book Session
                    </Link>
                    {user ? (
                      <>
                        <Link href="/dashboard" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                          Dashboard
                        </Link>
                        <Link href="/bookings" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                          My Bookings
                        </Link>
                        {isAdmin && (
                          <>
                            {userProfile?.profileImageUrl && (
                              <img
                                src={userProfile.profileImageUrl}
                                alt="Profile"
                                className="w-8 h-8 rounded-full object-cover border border-amber-200 mx-4"
                              />
                            )}
                            <Link href="/admin" className="block px-4 py-2 text-red-600 hover:bg-red-50">
                              Admin
                            </Link>
                            <Link href="/admin/bookings" className="block px-4 py-2 text-red-600 hover:bg-red-50">
                              Manage Bookings
                            </Link>
                          </>
                        )}
                        <button
                          onClick={signOut}
                          className="block text-left px-4 py-2 text-gray-600 hover:bg-amber-50"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <>
                        <Link href="/auth/login" className="block px-4 py-2 text-gray-600 hover:bg-amber-50">
                          Login
                        </Link>
                        <Link href="/auth/signup" className="block px-4 py-2 text-amber-700 hover:bg-amber-50">
                          Sign Up
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </header>
        )}

        {/* Main Content */}
        <main>{children}</main>

        {!isAdminRoute && (
          <footer className="bg-amber-900 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <div className="flex items-center space-x-2 mb-4">
                    <Camera className="h-6 w-6" />
                    <span className="text-lg font-bold">Brain Works Studio</span>
                  </div>
                  <p className="text-amber-100">
                    Professional photography and videography services for all your creative needs.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Services</h3>
                  <ul className="space-y-2 text-amber-100">
                    <li>Event Photography</li>
                    <li>Portrait Sessions</li>
                    <li>Product Photography</li>
                    <li>Commercial Work</li>
                    <li>Wedding Photography</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Contact</h3>
                  <div className="space-y-2 text-amber-100">
                    <p>Email: hello@brainworksstudio.com</p>
                    <p>Phone: (555) 123-4567</p>
                    <p>Location: Your City, State</p>
                  </div>
                </div>
              </div>
              <div className="border-t border-amber-800 mt-8 pt-8 text-center text-amber-100">
                <p>&copy; 2025 Brain Works Studio. All rights reserved.</p>
              </div>
            </div>
          </footer>
        )}
      </body>
    </html>
  );
}