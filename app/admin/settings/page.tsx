// app/admin/settings/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, Check, RefreshCw, Settings } from 'lucide-react';


interface StudioSettings {
  studioName: string;
  address: string;
  contactEmail: string;
  maxBookingsPerDay: number;
}

export default function AdminSettingsPage() {
  const { user, isAdmin, loading: authLoading, firebaseUser } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<StudioSettings>({
    studioName: '',
    address: '',
    contactEmail: '',
    maxBookingsPerDay: 5,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!authLoading && (!user || !isAdmin)) {
      router.push('/auth/login');
    }
  }, [user, isAdmin, authLoading, router]);

  useEffect(() => {
    if (user && isAdmin && firebaseUser && !authLoading) {
      fetchSettings();
    }
  }, [user, isAdmin, firebaseUser, authLoading]);

  const fetchSettings = async () => {
    setLoading(true);
    setError(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        setLoading(false);
        return;
      }

      const token = await firebaseUser.getIdToken();
      const res = await fetch('/api/admin/settings', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(`Failed to fetch settings: ${res.status} - ${err.error || 'Unknown'}`);
        return;
      }

      const data = await res.json();
      setSettings({
        studioName: data.studioName || 'Brain Works Studio Africa',
        address: data.address || '',
        contactEmail: data.contactEmail || '',
        maxBookingsPerDay: data.maxBookingsPerDay || 5,
      });
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      if (!firebaseUser) {
        setError('Authentication required');
        setIsSubmitting(false);
        return;
      }

      const token = await firebaseUser.getIdToken();
      const res = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        setError(`Failed to update settings: ${err.error || 'Unknown'}`);
        return;
      }

      setSuccess('Settings updated successfully');
    } catch (err: any) {
      setError(err?.message || 'Unexpected error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading || loading) {
    return (
      
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-700 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading settings...</p>
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
              <p className="text-xl font-semibold">Error Loading Settings</p>
              <p className="text-gray-600 mt-2">{error}</p>
            </div>
            <Button onClick={fetchSettings}>
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
            <h1 className="text-3xl font-bold text-gray-900">Studio Settings</h1>
            <p className="text-gray-600 mt-2">Configure studio preferences and booking rules</p>
          </div>
          <Button onClick={fetchSettings} variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Studio Configuration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="studioName">Studio Name</Label>
                <Input
                  id="studioName"
                  value={settings.studioName}
                  onChange={(e) => setSettings({ ...settings, studioName: e.target.value })}
                  placeholder="Enter studio name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Studio Address</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  placeholder="Enter studio address"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  placeholder="Enter contact email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="maxBookingsPerDay">Max Bookings Per Day</Label>
                <Input
                  id="maxBookingsPerDay"
                  type="number"
                  min="1"
                  value={settings.maxBookingsPerDay}
                  onChange={(e) => setSettings({ ...settings, maxBookingsPerDay: parseInt(e.target.value) || 1 })}
                  placeholder="Enter max bookings per day"
                  required
                />
              </div>
              {success && (
                <div className="text-green-600 flex items-center gap-2">
                  <Check className="h-5 w-5" />
                  {success}
                </div>
              )}
              {error && (
                <div className="text-red-600 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </div>
              )}
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Settings'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
  
  );
}