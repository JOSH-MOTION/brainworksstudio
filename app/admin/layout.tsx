// app/admin/layout.tsx
import { ReactNode } from 'react';
import AdminLayout from '@/components/AdminLayout';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Admin Dashboard | Brain Works Studio',
  description: 'Manage users, content, and settings for Brain Works Studio.',
  icons: {
    icon: '/brain.jpeg', // 👈 use your logo from public/
  },
};

export default function AdminRootLayout({ children }: { children: ReactNode }) {
  return <AdminLayout>{children}</AdminLayout>;
}
