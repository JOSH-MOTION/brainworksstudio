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
import { Camera, Eye, EyeOff } from 'lucide-react';
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

export default function SignupPage() {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: '',
    profileImage: null as File | null,
  });
  const [imagePreview, setImagePreview] = useState<string>('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, profileImage: file });
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    try {
      let profileImageUrl = '';
      if (formData.profileImage) {
        const imageFormData = new FormData();
        imageFormData.append('file', formData.profileImage);
        imageFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
        imageFormData.append('folder', 'profiles');

        const uploadResponse = await fetch(
          `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
          {
            method: 'POST',
            body: imageFormData,
          }
        );

        if (uploadResponse.ok) {
          const uploadResult = await uploadResponse.json();
          profileImageUrl = uploadResult.secure_url;
        }
      }

      await signUp(formData.email, formData.password, {
        displayName: formData.displayName,
        profileImageUrl: profileImageUrl || undefined,
      });
      router.push('/dashboard');
    } catch (error: any) {
      setError(error.message || 'An error occurred during signup');
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
                  src="/brain2.png"
                  alt="Brain Works Studio Logo"
                  width={48}
                  height={48}
                  className="object-contain"
                />
              </motion.div>
              <CardTitle className="text-3xl font-bold text-teal-900">Create Your Account</CardTitle>
              <CardDescription className="text-gray-600">
                Join Brain Works Studio to start capturing your moments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-5">
                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="displayName" className="text-teal-900 font-semibold">
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
                  <Label htmlFor="profileImage" className="text-teal-900 font-semibold">
                    Profile Picture (Optional)
                  </Label>
                  <div className="flex items-center gap-4">
                    {imagePreview ? (
                      <div className="relative">
                        <motion.img
                          src={imagePreview}
                          alt="Profile preview"
                          className="w-24 h-24 rounded-full object-cover border-4 border-teal-200"
                          whileHover={{ scale: 1.1 }}
                          transition={{ type: 'spring', stiffness: 200 }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, profileImage: null });
                            setImagePreview('');
                          }}
                          className="absolute -top-2 -right-2 bg-red-400 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-500 transition-colors"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded-full bg-teal-50 flex items-center justify-center border-4 border-teal-200">
                        <Camera className="h-8 w-8 text-teal-400" />
                      </div>
                    )}
                    <Input
                      id="profileImage"
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="flex-1 border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                    />
                  </div>
                </motion.div>

                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="email" className="text-teal-900 font-semibold">
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="border-teal-300 focus:border-teal-500 focus:ring-teal-500"
                  />
                </motion.div>

                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="password" className="text-teal-900 font-semibold">
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
                  <Label htmlFor="confirmPassword" className="text-teal-900 font-semibold">
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
                    {loading ? 'Creating Account...' : 'Create Account'}
                  </Button>
                </motion.div>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
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