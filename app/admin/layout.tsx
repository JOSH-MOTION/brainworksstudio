'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield, User, LogOut, Menu, Calendar, Users, MessageSquare, Settings } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, userProfile, signOut, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50">
      {/* Admin Header */}
      <header className="bg-red-800 text-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <Link href="/admin" className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-red-200" />
              <div>
                <span className="text-xl font-bold">Brain Works Studio</span>
                <div className="text-xs text-red-200">Admin Panel</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="/admin" className="text-red-200 hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/admin/bookings" className="text-red-200 hover:text-white transition-colors">
                Bookings
              </Link>
              <Link href="/admin/users" className="text-red-200 hover:text-white transition-colors">
                Users
              </Link>
              <Link href="/admin/portfolio" className="text-red-200 hover:text-white transition-colors">
                Portfolio
              </Link>
              <Link href="/admin/contacts" className="text-red-200 hover:text-white transition-colors">
                Messages
              </Link>
              
              {/* Admin Profile Section */}
              <div className="flex items-center space-x-3 border-l border-red-600 pl-6">
                {userProfile?.profileImageUrl ? (
                  <img 
                    src={userProfile.profileImageUrl} 
                    alt="Admin Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-red-200"
                  />
                ) : (
                  <div className="p-1 bg-red-700 rounded-full">
                    <User className="h-6 w-6 text-red-200" />
                  </div>
                )}
                <div className="text-sm">
                  <div className="font-medium">{userProfile?.displayName || 'Admin'}</div>
                  <div className="text-red-200 text-xs">Studio Team</div>
                </div>
                <Button variant="ghost" onClick={signOut} size="sm" className="text-red-200 hover:text-white hover:bg-red-700">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </nav>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2"
            >
              <Menu className="h-6 w-6 text-red-200" />
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-red-700">
              <div className="flex flex-col space-y-2">
                <Link href="/admin" className="block px-4 py-2 text-red-200 hover:bg-red-700 rounded">
                  Dashboard
                </Link>
                <Link href="/admin/bookings" className="block px-4 py-2 text-red-200 hover:bg-red-700 rounded">
                  Bookings
                </Link>
                <Link href="/admin/users" className="block px-4 py-2 text-red-200 hover:bg-red-700 rounded">
                  Users
                </Link>
                <Link href="/admin/portfolio" className="block px-4 py-2 text-red-200 hover:bg-red-700 rounded">
                  Portfolio
                </Link>
                <Link href="/admin/contacts" className="block px-4 py-2 text-red-200 hover:bg-red-700 rounded">
                  Messages
                </Link>
                
                {/* Mobile Admin Profile */}
                <div className="px-4 py-2 border-t border-red-700 mt-2">
                  <div className="flex items-center space-x-2 mb-2">
                    {userProfile?.profileImageUrl ? (
                      <img 
                        src={userProfile.profileImageUrl} 
                        alt="Admin Profile" 
                        className="w-6 h-6 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 text-red-200" />
                    )}
                    <span className="text-sm font-medium">{userProfile?.displayName || 'Admin'}</span>
                  </div>
                  <button onClick={signOut} className="text-red-200 hover:text-white text-sm">
                    Logout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-screen">{children}</main>

      {/* Admin Footer */}
      <footer className="bg-red-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-red-300" />
              <span className="text-sm">Brain Works Studio - Admin Panel</span>
            </div>
            
            <div className="flex space-x-4 text-sm text-red-300">
              <Link href="/admin/settings" className="hover:text-white">Settings</Link>
              <Link href="/admin/help" className="hover:text-white">Help</Link>
              <Link href="/" className="hover:text-white">View Site</Link>
            </div>
          </div>
          
          <div className="border-t border-red-800 mt-6 pt-6 text-center text-red-300 text-sm">
            <p>&copy; 2024 Brain Works Studio Admin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}