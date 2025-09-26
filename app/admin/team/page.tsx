// app/admin/team/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertCircle, RefreshCw, User as UserIcon, Shield } from 'lucide-react';

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

export default function AdminTeamPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin && firebaseUser && !authLoading) {
      fetchTeamMembers();
    }
  }, [user, isAdmin, firebaseUser, authLoading]);

  const fetchTeamMembers = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdToken();
      const res = await fetch('/api/admin/users?role=admin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(`Failed to fetch team members: ${res.status} - ${err.error || 'Unknown'}`);
        return;
      }

      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: 'admin' | 'client') => {
    setActionLoading(userId);
    setError(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        return;
      }

      const token = await firebaseUser.getIdToken();
      const res = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Failed to update role');
      }

      await fetchTeamMembers();
      alert(`User role updated to ${newRole}`);
    } catch (err: any) {
      setError(err.message || 'Failed to update role');
    } finally {
      setActionLoading(null);
    }
  };

  const deleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to remove this team member? This action cannot be undone.')) return;

    setActionLoading(userId);
    setError(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        return;
      }

      const token = await firebaseUser.getIdToken();
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error || 'Failed to delete user');
      }

      await fetchTeamMembers();
      alert('Team member removed successfully');
    } catch (err: any) {
      setError(err.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || loading) {
    return (
      
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading team members...</p>
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
              <p className="text-xl font-semibold">Error Loading Team Members</p>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>
            <Button onClick={fetchTeamMembers}>
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
            <h1 className="text-3xl font-bold text-gray-900">Team Members</h1>
            <p className="text-gray-600 mt-2">Manage studio team member accounts</p>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={fetchTeamMembers} variant="outline" size="sm">
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
              <p className="text-gray-500 text-lg">No team members found</p>
              <p className="text-gray-400">Team member accounts will appear here</p>
              <Button onClick={fetchTeamMembers} className="mt-4" variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh Team Members
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
                    <Badge className="bg-green-100 text-green-800">Admin</Badge>
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
                  <div className="border-t pt-4 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateUserRole(user.uid, 'client')}
                      disabled={actionLoading === user.uid || user.uid === firebaseUser?.uid}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      {actionLoading === user.uid ? 'Demoting...' : 'Demote to Client'}
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteUser(user.uid)}
                      disabled={actionLoading === user.uid || user.uid === firebaseUser?.uid}
                    >
                      <UserIcon className="h-4 w-4 mr-2" />
                      {actionLoading === user.uid ? 'Removing...' : 'Remove Team Member'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
  
  );
}