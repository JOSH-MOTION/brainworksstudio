// types/index.ts
import { LucideIcon } from 'lucide-react';

export type SocialPlatform = 'Instagram' | 'Twitter' | 'LinkedIn';

export interface SocialLink {
  platform: SocialPlatform;
  url: string;
}

export interface User {
  uid: string;
  displayName: string;
  email: string;
  phone?: string;
  address?: string;
  location?: {
    lat: number;
    lng: number;
  };
  profileImageUrl?: string;
  role: 'user' | 'admin' | 'photographer' | 'ceo' | 'director' | 'cinematographer'; // Updated positions
  createdAt: Date;
  description?: string;
  socials?: SocialLink[];
}

export interface Booking {
  bookingId: string;
  userId: string;
  serviceCategory: 'Event' | 'Portrait' | 'Product' | 'Commercial' | 'Wedding';
  startDateTime: Date;
  endDateTime: Date;
  location: {
    address: string;
    lat?: number;
    lng?: number;
  };
  attachments: string[];
  additionalNotes?: string;
  status: 'pending' | 'accepted' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface TeamMember {
  id: string;
  displayName: string;
  role: string;
  description: string;
  profileImageUrl: string;
  socials: { platform: SocialPlatform; url: string; icon: LucideIcon }[]; // Use LucideIcon instead of React.ComponentType
}

export interface PortfolioItem {
  id: string;
  title: string;
  type: 'photography' | 'videography';
  category: string;
  tags: string[];
  imageUrls: string[];
  videoUrl: string | null;
  caption: string | null;
  clientName: string | null;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  clientId: string | null;
  pin?: string;
}

export interface Client {
  id: string;
  displayName: string;
  email: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: Date;
}

// types/blog.ts
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featuredImage: string;
  author: {
    name: string;
    uid: string;
  };
  category: string;
  tags: string[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  views: number;
}

export interface RateCard {
  id: string;
  serviceType: 'photography' | 'videography' | 'both'; 
  category: string;
  serviceName: string;
  description: string;
  price: string;
  duration?: string;
  includes: string[];
  featured: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}