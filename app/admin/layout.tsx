'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Shield, User, LogOut, Menu, Calendar, Users, MessageSquare, Settings, Home } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, userProfile, signOut, isAdmin, loading } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, loading, router]);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
    setSidebarOpen(false);
  }, [pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-orange-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return null;
  }

  const navigationItems = [
    { href: '/admin', label: 'Dashboard', icon: Home },
    { href: '/admin/bookings', label: 'Bookings', icon: Calendar },
    { href: '/admin/users', label: 'Users', icon: Users },
    { href: '/admin/portfolio', label: 'Portfolio', icon: Shield },
    { href: '/admin/contacts', label: 'Messages', icon: MessageSquare },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50">
      {/* Admin Header */}
      <header className="bg-white shadow-lg border-b-2 border-orange-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Admin Logo */}
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="p-1 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-blue-900">Brain Works Studio</span>
                <div className="text-xs text-orange-600 font-medium">Admin Panel</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navigationItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    pathname === item.href 
                      ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                      : 'text-blue-700 hover:bg-blue-50 hover:text-orange-600'
                  }`}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {/* Admin Profile Section */}
              <div className="hidden md:flex items-center space-x-3">
                {userProfile?.profileImageUrl ? (
                  <img 
                    src={userProfile.profileImageUrl} 
                    alt="Admin Profile" 
                    className="w-8 h-8 rounded-full object-cover border-2 border-orange-300 shadow-sm"
                  />
                ) : (
                  <div className="p-1 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full">
                    <User className="h-6 w-6 text-white" />
                  </div>
                )}
                <div className="text-sm">
                  <div className="font-semibold text-blue-900">{userProfile?.displayName || 'Admin'}</div>
                  <div className="text-orange-600 text-xs font-medium">Studio Team</div>
                </div>
                <Button 
                  variant="outline" 
                  onClick={signOut} 
                  size="sm" 
                  className="border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white hover:border-orange-500 transition-all duration-200"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>

              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-md hover:bg-orange-50 transition-colors duration-200"
              >
                <Menu className="h-6 w-6 text-orange-600" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden border-t border-orange-100 bg-white">
              <div className="py-4 space-y-2">
                {navigationItems.map((item) => (
                  <Link 
                    key={item.href}
                    href={item.href} 
                    className={`flex items-center space-x-3 px-4 py-3 rounded-md mx-2 transition-all duration-200 ${
                      pathname === item.href 
                        ? 'bg-orange-100 text-orange-700 border border-orange-200' 
                        : 'text-blue-700 hover:bg-blue-50 hover:text-orange-600'
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                ))}
                
                {/* Mobile Admin Profile */}
                <div className="px-4 py-3 border-t border-orange-100 mt-4 mx-2">
                  <div className="flex items-center space-x-3 mb-3">
                    {userProfile?.profileImageUrl ? (
                      <img 
                        src={userProfile.profileImageUrl} 
                        alt="Admin Profile" 
                        className="w-8 h-8 rounded-full object-cover border-2 border-orange-300"
                      />
                    ) : (
                      <div className="p-1 bg-gradient-to-r from-orange-400 to-blue-500 rounded-full">
                        <User className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <div>
                      <div className="font-semibold text-blue-900">{userProfile?.displayName || 'Admin'}</div>
                      <div className="text-orange-600 text-xs font-medium">Studio Team</div>
                    </div>
                  </div>
                  <Button 
                    onClick={() => {
                      signOut();
                      setMobileMenuOpen(false);
                    }} 
                    variant="outline"
                    size="sm"
                    className="w-full border-orange-300 text-orange-600 hover:bg-orange-500 hover:text-white"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t-2 border-orange-200 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex items-center space-x-2">
              <div className="p-1 bg-gradient-to-r from-orange-500 to-blue-600 rounded-lg">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-sm font-semibold text-blue-900">Brain Works Studio - Admin Panel</span>
            </div>
            
            <div className="flex flex-wrap justify-center space-x-6 text-sm">
              <Link href="/admin/settings" className="text-blue-700 hover:text-orange-600 transition-colors duration-200">
                Settings
              </Link>
              <Link href="/admin/help" className="text-blue-700 hover:text-orange-600 transition-colors duration-200">
                Help
              </Link>
              <Link href="/" className="text-blue-700 hover:text-orange-600 transition-colors duration-200">
                View Site
              </Link>
            </div>
          </div>
          
          <div className="border-t border-orange-200 mt-6 pt-6 text-center">
            <p className="text-blue-800 text-sm">&copy; 2024 Brain Works Studio Admin. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}