// components/Navbar.tsx
'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Camera, User, LogOut, Menu } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const { user, userProfile, signOut, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-amber-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-amber-700" />
            <span className="text-xl font-bold text-amber-900">Brain Works Studio</span>
          </Link>

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
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="bg-amber-700 hover:bg-amber-800">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </nav>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2"
          >
            <Menu className="h-6 w-6 text-gray-600" />
          </button>
        </div>

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
  );
}