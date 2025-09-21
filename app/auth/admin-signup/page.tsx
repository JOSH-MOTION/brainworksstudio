'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Shield, Camera, User } from 'lucide-react';

export default function AdminSignupPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { signUp } = useAuth();
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    // Verify admin code from environment variables
    const expectedAdminCode = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE || 'BRAINWORKS2024';
    if (formData.adminCode !== expectedAdminCode) {
      setError('Invalid admin access code');
      setLoading(false);
      return;
    }

    try {
      // Create admin user with role set to admin
      await signUp(formData.email, formData.password, {
        displayName: formData.displayName,
        role: 'admin'
      });
      router.push('/admin');
    } catch (error: any) {
      setError(error.message || 'An error occurred during admin signup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 p-3 bg-red-100 rounded-full w-fit">
              <Shield className="h-8 w-8 text-red-700" />
            </div>
            <CardTitle className="text-2xl font-bold text-red-700">Admin Registration</CardTitle>
            <CardDescription>
              Create an administrator account for Brain Works Studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="displayName">Full Name</Label>
                <Input
                  id="displayName"
                  name="displayName"
                  type="text"
                  value={formData.displayName}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="admin@brainworksstudio.com"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="adminCode">Admin Access Code</Label>
                <Input
                  id="adminCode"
                  name="adminCode"
                  type="password"
                  value={formData.adminCode}
                  onChange={handleChange}
                  required
                  placeholder="Enter admin access code"
                />
                <p className="text-xs text-gray-500">
                  Contact the system administrator for the access code
                </p>
              </div>

              {error && (
                <div className="text-red-600 text-sm bg-red-50 p-3 rounded-md">
                  {error}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full bg-red-700 hover:bg-red-800" 
                disabled={loading}
              >
                {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                Regular user?{' '}
                <Link href="/auth/signup" className="text-amber-700 hover:text-amber-800 font-medium">
                  Sign up here
                </Link>
              </p>
              <p className="text-sm text-gray-600 mt-2">
                Already have an account?{' '}
                <Link href="/auth/login" className="text-amber-700 hover:text-amber-800 font-medium">
                  Sign in
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}