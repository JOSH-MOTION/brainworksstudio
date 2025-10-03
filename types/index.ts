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
  role: 'user' | 'admin';
  createdAt: Date;
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

export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: Date;
}