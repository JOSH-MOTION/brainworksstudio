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
  category: string;
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  caption?: string;
  featured: boolean;
  createdAt: Date;
   clientId?: string | null; // Add clientId
   googleDriveFolderId?: string; // New: Google Drive folder ID for images
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