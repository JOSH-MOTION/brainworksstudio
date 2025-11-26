import { ReactNode } from 'react';
import AdminLayout from '@/components/AdminLayout';
import type { Metadata } from 'next';

// Define the base URL for correct path resolution
const BASE_URL = 'https://brainworksstudioafrica.com';

export const metadata: Metadata = {
  // Add metadataBase for proper path resolution (optional, but good practice)
  metadataBase: new URL(BASE_URL),
  
  title: 'Admin Dashboard | Brain Works Studio Africa',
  description: 'Manage users, content, and settings for Brain Works Studio Africa.',
  icons: {
    icon: '/newlogo3.png', // 👈 use your logo from public/
  },
  
  // --- ADDED: Explicitly tell crawlers not to index this page ---
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
  // ---------------------------------------------------------------
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
