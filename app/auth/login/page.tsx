'use client';

import { useState, useEffect } from 'react';
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

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { signIn, sendPasswordResetEmail, user, isAdmin, loading: authLoading } = useAuth();
  const router = useRouter();

  // Redirect if user is logged in
  useEffect(() => {
    if (authLoading) {
      console.log('Auth loading, waiting for user state...');
      return;
    }
    if (user) {
      console.log('User detected:', { uid: user.uid, email: user.email, role: user.role, isAdmin });
      const destination = isAdmin ? '/admin' : '/dashboard';
      console.log('Redirecting to:', destination);
      router.replace(destination);
    }
  }, [user, isAdmin, authLoading, router]);

  // Show loading screen during auth state check or redirect
  if (authLoading || (user && !isResetMode)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 to-white">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-teal-600 text-lg"
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Attempting sign-in with email:', email);
      await signIn(email, password);
      console.log('Sign-in successful, waiting for redirect...');
    } catch (error: any) {
      console.error('Sign-in error:', error);
      setError(
        error.code === 'auth/invalid-email' ? 'Invalid email address' :
        error.code === 'auth/user-not-found' ? 'No account found with this email' :
        error.code === 'auth/wrong-password' ? 'Incorrect password' :
        error.code === 'auth/invalid-credential' ? 'Invalid email or password' :
        error.code === 'auth/too-many-requests' ? 'Too many attempts, try again later' :
        error.message || 'An error occurred during login'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      console.log('Sending password reset email to:', resetEmail);
      await sendPasswordResetEmail(resetEmail);
      setSuccess('Password reset email sent. Check your inbox.');
      setResetEmail('');
    } catch (error: any) {
      console.error('Password reset error:', error);
      setError(
        error.code === 'auth/invalid-email' ? 'Invalid email address' :
        error.code === 'auth/user-not-found' ? 'No account found with this email' :
        error.message || 'An error occurred while sending the reset email'
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
              <CardTitle className="text-3xl font-bold text-[#001F44]">
                {isResetMode ? 'Reset Password' : 'Welcome Back'}
              </CardTitle>
              <CardDescription className="text-gray-600">
                {isResetMode
                  ? 'Enter your email to receive a password reset link'
                  : 'Sign in to your Brain Works Studio Africa account'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!isResetMode ? (
                <form onSubmit={handleLoginSubmit} className="space-y-5">
                  <motion.div variants={inputVariants} className="space-y-2">
                    <Label htmlFor="email" className="text-[#001F44] font-semibold">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
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
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
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
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(true);
                        setError('');
                        setSuccess('');
                      }}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Forgot Password?
                    </button>
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
                      {loading ? 'Signing In...' : 'Sign In'}
                    </Button>
                  </motion.div>
                </form>
              ) : (
                <form onSubmit={handleResetSubmit} className="space-y-5">
                  <motion.div variants={inputVariants} className="space-y-2">
                    <Label htmlFor="resetEmail" className="text-[#001F44] font-semibold">
                      Email
                    </Label>
                    <Input
                      id="resetEmail"
                      type="email"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      required
                      placeholder="your@email.com"
                      className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                    />
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

                  {success && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-teal-600 text-sm bg-teal-50 p-3 rounded-md"
                    >
                      {success}
                    </motion.div>
                  )}

                  <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                    <Button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white"
                      disabled={loading}
                    >
                      {loading ? 'Sending Reset Email...' : 'Send Reset Email'}
                    </Button>
                  </motion.div>

                  <motion.div variants={inputVariants} className="text-center">
                    <button
                      type="button"
                      onClick={() => {
                        setIsResetMode(false);
                        setError('');
                        setSuccess('');
                        setResetEmail('');
                      }}
                      className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Back to Sign In
                    </button>
                  </motion.div>
                </form>
              )}

              {!isResetMode && (
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    Don&apos;t have an account?{' '}
                    <Link href="/auth/signup" className="text-teal-600 hover:text-teal-700 font-medium">
                      Sign up
                    </Link>
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </Layout>
  );
}