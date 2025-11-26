'use client';

import { useState } from 'react';
import { motion, Variants } from 'framer-motion';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

const formVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut', staggerChildren: 0.1 } },
};

const inputVariants: Variants = {
  hidden: { opacity: 0, x: -10 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.3, ease: 'easeOut' } },
};

const buttonVariants: Variants = {
  hover: { scale: 1.05, transition: { type: 'spring', stiffness: 300 } },
  tap: { scale: 0.95 },
};

const logoVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, type: 'spring', stiffness: 200 } },
};

export default function AdminSignupPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminCode: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showAdminCode, setShowAdminCode] = useState(false);
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

    const expectedAdminCode = process.env.NEXT_PUBLIC_ADMIN_ACCESS_CODE || 'BRAINWORKS2024';
    if (formData.adminCode !== expectedAdminCode) {
      setError('Invalid admin access code');
      setLoading(false);
      return;
    }

    try {
      await signUp(formData.email, formData.password, {
        displayName: formData.displayName,
        role: 'admin',
      });
      router.push('/admin');
    } catch (error: any) {
      setError(
        error.message.includes('invalid-email') ? 'Invalid email address' :
        error.message.includes('email-already-in-use') ? 'Email is already in use' :
        error.message.includes('weak-password') ? 'Password is too weak (minimum 6 characters)' :
        error.message || 'An error occurred during admin signup'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-teal-50 to-white">
        <motion.div
          variants={formVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          <Card className="rounded-2xl bg-white shadow-lg border border-teal-200">
            <CardHeader className="text-center">
              <motion.div variants={logoVariants} className="mx-auto mb-4">
                <Image
                  src="/newlogo.png"
                  alt="Brain Works Studio Africa Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-[#001F44]">Admin Registration</CardTitle>
              <CardDescription className="text-gray-600">
                Create an administrator account for Brain Works Studio Africa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="displayName" className="text-[#001F44] font-semibold">
                    Full Name
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </motion.div>

                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-[#001F44] font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="admin@brainworksstudio.com"
                    className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </motion.div>

                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="password" className="text-[#001F44] font-semibold">
                    Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="border-teal-300 focus:border-teal-500 focus:ring-teal-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-[#001F44] font-semibold">
                    Confirm Password
                  </Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                      placeholder="••••••••"
                      className="border-teal-300 focus:border-teal-500 focus:ring-teal-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </motion.div>

                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="adminCode" className="text-[#001F44] font-semibold">
                    Admin Access Code
                  </Label>
                  <div className="relative">
                    <Input
                      id="adminCode"
                      name="adminCode"
                      type={showAdminCode ? 'text' : 'password'}
                      value={formData.adminCode}
                      onChange={handleChange}
                      required
                      placeholder="Enter admin access code"
                      className="border-teal-300 focus:border-teal-500 focus:ring-teal-500 pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminCode(!showAdminCode)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-teal-600 hover:text-teal-700"
                    >
                      {showAdminCode ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                  <p className="text-xs text-gray-500">
                    Contact the system administrator for the access code
                  </p>
                </motion.div>

                {error && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-red-400 text-sm bg-red-50 p-3 rounded-md"
                  >
                    {error}
                  </motion.div>
                )}

                <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                  <Button
                    type="submit"
                    className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                    disabled={loading}
                  >
                    {loading ? 'Creating Admin Account...' : 'Create Admin Account'}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  Regular user?{' '}
                  <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                    Sign up here
                  </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                  Already have an account?{' '}
                  <Link href="/auth/login" className="text-teal-600 hover:text-teal-700 font-medium">
                    Sign in
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}