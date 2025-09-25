// app/admin/users/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User as UserIcon, RefreshCw, AlertCircle } from 'lucide-react';

import Link from 'next/link';

interface User {
  uid: string;
  email: string;
  displayName: string;
  phone?: string | null;
  address?: string | null;
  location?: string | null;
  profileImageUrl?: string | null;
  role: string;
  createdAt: string | Date;
}

export default function AdminUsersPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const roleFilter = searchParams.get('role');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<any>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin && firebaseUser && !authLoading) {
      fetchUsers();
    }
  }, [user, isAdmin, firebaseUser, authLoading, roleFilter]);

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    setDebugInfo(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdToken();
      const url = roleFilter ? `/api/admin/users?role=${roleFilter}` : '/api/admin/users';

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(`Failed to fetch users: ${res.status} - ${err.error || 'Unknown'}`);
        setDebugInfo(err);
        return;
      }

      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
      setDebugInfo({ message: err.message, stack: err.stack });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
 
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading users...</p>
          </div>
        </div>
     
    );
  }

  if (!user || !isAdmin) {
    return (
    
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 text-xl font-semibold">Access Denied</p>
            <p className="text-gray-600 mt-2">You need admin privileges to access this page.</p>
          </div>
        </div>
     
    );
  }

  if (error) {
    return (
     
        <div className="min-h-screen flex items-center justify-center">
          <div className="max-w-2xl w-full text-center">
            <div className="text-red-600 mb-6">
              <AlertCircle className="h-16 w-16 mx-auto mb-4" />
              <p className="text-xl font-semibold">Error Loading Users</p>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>
            {debugInfo && (
              <div className="mt-4 text-left bg-gray-100 p-4 rounded">
                <p className="font-semibold">Debug Info:</p>
                <pre className="text-sm overflow-auto">{JSON.stringify(debugInfo, null, 2)}</pre>
              </div>
            )}
            <Button onClick={fetchUsers} className="mt-4">
              <RefreshCw className="h-4 w-4 mr-2" /> Try Again
            </Button>
          </div>
        </div>
     
    );
  }

  return (
   
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {roleFilter === 'admin' ? 'Team Members' : 'Client Management'}
            </h1>
            <p className="text-gray-600 mt-2">
              {roleFilter === 'admin'
                ? 'Manage studio team member accounts'
                : 'View and manage studio clients and team members'}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchUsers} variant="outline" size="sm">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
            <Badge className="bg-blue-100 text-blue-800 px-3 py-1">Total: {users.length}</Badge>
          </div>
        </div>

        {users.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <UserIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No {roleFilter === 'admin' ? 'team members' : 'users'} found</p>
              <p className="text-gray-400">
                {roleFilter === 'admin' ? 'Team member accounts' : 'Client and team member accounts'} will appear here
              </p>
              <Button onClick={fetchUsers} className="mt-4" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Users
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            {users.map((user) => (
              <Card key={user.uid} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-semibold">{user.displayName || 'Unknown User'}</CardTitle>
                    <Badge
                      className={`${
                        user.role === 'admin' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-500">
                    User ID: {user.uid} • Joined: {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <UserIcon className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="font-medium">Contact Information</p>
                          <p className="text-sm text-gray-600">{user.email}</p>
                          {user.phone && <p className="text-sm text-gray-600">{user.phone}</p>}
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {user.address && (
                        <div className="flex items-center gap-3">
                          <span className="h-5 w-5 text-gray-400">📍</span>
                          <p className="text-sm">{user.address}</p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="border-t pt-4">
                    <Button variant="outline" size="sm">
                      Contact User
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="mt-6 flex gap-4">
          <Link href="/admin/users">
            <Button variant={roleFilter === null ? 'default' : 'outline'}>View All Users</Button>
          </Link>
          <Link href="/admin/users?role=admin">
            <Button variant={roleFilter === 'admin' ? 'default' : 'outline'}>View Team Members</Button>
          </Link>
        </div>
      </div>
   
  );
}