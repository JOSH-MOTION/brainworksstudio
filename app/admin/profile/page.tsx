'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { User, Camera, Mail, Phone, MapPin, Save, InstagramIcon, Twitter, Linkedin, AlertCircle, Users,Star } from 'lucide-react';
import { motion, Variants } from 'framer-motion';
import { SocialLink, User as UserType } from '@/types';

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

export default function AdminProfilePage() {
  const { user, userProfile, updateUserProfile, isAdmin } = useAuth();
  const router = useRouter();

  const [formData, setFormData] = useState<{
    displayName: string;
    email: string;
    phone: string;
    address: string;
    profileImageUrl: string;
    description: string;
    role: 'user' | 'admin' | 'photographer' | 'ceo' | 'director' | 'cinematographer';
    socials: SocialLink[];
  }>({
    displayName: '',
    email: '',
    phone: '',
    address: '',
    profileImageUrl: '',
    description: '',
    role: 'admin',
    socials: [
      { platform: 'Instagram', url: '' },
      { platform: 'Twitter', url: '' },
      { platform: 'LinkedIn', url: '' },
    ],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || !isAdmin) {
      router.push('/auth/login');
      return;
    }

    if (userProfile) {
      setFormData({
        displayName: userProfile.displayName || '',
        email: userProfile.email || user.email || '',
        phone: userProfile.phone || '',
        address: userProfile.address || '',
        profileImageUrl: userProfile.profileImageUrl || '',
        description: userProfile.description || '',
        role: userProfile.role || 'admin',
        socials: userProfile.socials || [
          { platform: 'Instagram', url: '' },
          { platform: 'Twitter', url: '' },
          { platform: 'LinkedIn', url: '' },
        ],
      });
      setImagePreview(userProfile.profileImageUrl || '');
    }
  }, [user, userProfile, isAdmin, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSocialChange = (index: number, value: string) => {
    setFormData((prev) => ({
      ...prev,
      socials: prev.socials.map((social, i) => (i === index ? { ...social, url: value } : social)),
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const imageFormData = new FormData();
    imageFormData.append('file', file);
    imageFormData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);
    imageFormData.append('folder', `profiles/${user?.uid}`);

    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: imageFormData,
      }
    );

    if (!uploadResponse.ok) {
      throw new Error('Failed to upload image');
    }

    const uploadResult = await uploadResponse.json();
    return uploadResult.secure_url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    try {
      let profileImageUrl = formData.profileImageUrl;

      if (imageFile) {
        profileImageUrl = await uploadImageToCloudinary(imageFile);
      }

      const updatedProfile: Partial<UserType> = {
        displayName: formData.displayName,
        phone: formData.phone,
        address: formData.address,
        profileImageUrl,
        description: formData.description,
        socials: formData.socials.filter((s) => s.url.trim() !== ''),
        role: formData.role,
      };

      await updateUserProfile(updatedProfile);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error: any) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  if (!user || !isAdmin) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <motion.div variants={formVariants} initial="hidden" animate="visible">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-6 w-6" />
              Admin Profile Settings
            </CardTitle>
            <CardDescription>
              Manage your admin profile and position for Brain Works Studio
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-red-50 text-red-700 rounded-md flex items-center gap-2"
                >
                  <AlertCircle className="h-5 w-5" />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3 bg-green-50 text-green-700 rounded-md flex items-center gap-2"
                >
                  <Save className="h-4 w-4" />
                  <span className="font-medium">Profile updated successfully!</span>
                </motion.div>
              )}
              {/* Profile Picture */}
              <motion.div variants={inputVariants} className="flex flex-col items-center gap-4">
                <div className="relative">
                  {imagePreview ? (
                    <motion.img
                      src={imagePreview}
                      alt="Profile preview"
                      className="w-32 h-32 rounded-full object-cover border-4 border-amber-200"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 200 }}
                    />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center border-4 border-amber-200">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 bg-amber-700 hover:bg-amber-800 text-white rounded-full p-2 cursor-pointer">
                    <Camera className="h-4 w-4" />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Click the camera icon to upload a new profile picture
                </p>
              </motion.div>
              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="displayName">
                    <User className="inline h-4 w-4 mr-1" />
                    Full Name
                  </Label>
                  <Input
                    id="displayName"
                    name="displayName"
                    type="text"
                    value={formData.displayName}
                    onChange={handleChange}
                    placeholder="Your full name"
                    required
                  />
                </motion.div>
                <motion.div variants={inputVariants} className="space-y-2">
                  <Label htmlFor="email">
                    <Mail className="inline h-4 w-4 mr-1" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    disabled
                    className="bg-gray-50"
                  />
                  <p className="text-xs text-gray-500">
                    Email cannot be changed from this page
                  </p>
                </motion.div>
              </div>
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="role">
                  <Users className="inline h-4 w-4 mr-1" />
                  Position
                </Label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="user">Client</option>
                  <option value="admin">Studio Manager</option>
                  <option value="photographer">Photographer</option>
                  <option value="ceo">CEO</option>
                  <option value="director">Director</option>
                  <option value="cinematographer">Cinematographer</option>
                </select>
              </motion.div>
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="phone">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                />
              </motion.div>
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="address">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Address
                </Label>
                <Textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Your address"
                  rows={3}
                />
              </motion.div>
              <motion.div variants={inputVariants} className="space-y-2">
                <Label htmlFor="description">
                  <Star className="inline h-4 w-4 mr-1" />
                  Bio
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Tell us about yourself"
                  rows={4}
                />
              </motion.div>
              <motion.div variants={inputVariants} className="space-y-2">
                <Label>Social Media Links</Label>
                <div className="space-y-4">
                  {formData.socials.map((social, index) => (
                    <div key={social.platform} className="flex items-center gap-2">
                      {social.platform === 'Instagram' && <InstagramIcon className="h-5 w-5 text-amber-700" />}
                      {social.platform === 'Twitter' && <Twitter className="h-5 w-5 text-amber-700" />}
                      {social.platform === 'LinkedIn' && <Linkedin className="h-5 w-5 text-amber-700" />}
                      <Input
                        placeholder={`${social.platform} URL`}
                        value={social.url}
                        onChange={(e) => handleSocialChange(index, e.target.value)}
                        className="border-amber-300 focus:border-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
              <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
                <Button
                  type="submit"
                  className="w-full bg-amber-700 hover:bg-amber-800"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Updating Profile...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Save className="h-4 w-4" />
                      Save Changes
                    </div>
                  )}
                </Button>
              </motion.div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}