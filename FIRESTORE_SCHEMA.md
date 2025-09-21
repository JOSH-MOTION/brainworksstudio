# Firestore Database Schema

## Collections Overview

### users
```javascript
{
  uid: string,                    // Firebase Auth UID (document ID)
  displayName: string,            // User's full name
  email: string,                  // User's email address
  phone?: string,                 // Optional phone number
  address?: string,               // Optional address
  location?: {                    // Optional location coordinates
    lat: number,
    lng: number
  },
  profileImageUrl?: string,       // Cloudinary URL for profile image
  role: 'user' | 'admin',        // User role (default: 'user')
  createdAt: Date,               // Account creation timestamp
  updatedAt?: Date               // Last profile update
}
```

### bookings
```javascript
{
  bookingId: string,              // Auto-generated document ID
  userId: string,                 // Reference to user document
  serviceCategory: 'Event' | 'Portrait' | 'Product' | 'Commercial' | 'Wedding',
  startDateTime: Date,            // Session start date/time
  endDateTime: Date,              // Session end date/time
  location: {
    address: string,              // Session location address
    lat?: number,                 // Optional latitude
    lng?: number                  // Optional longitude
  },
  attachments: string[],          // Array of Cloudinary URLs
  additionalNotes?: string,       // Client's additional requirements
  status: 'pending' | 'accepted' | 'rejected',  // Booking status
  adminNotes?: string,            // Admin response notes
  createdAt: Date,               // Booking creation timestamp
  updatedAt: Date                // Last modification timestamp
}
```

### portfolio
```javascript
{
  id: string,                     // Auto-generated document ID
  title: string,                  // Portfolio item title
  category: string,               // Category (Event, Portrait, etc.)
  tags: string[],                 // Array of tags for filtering
  imageUrl: string,               // Cloudinary URL for main image
  videoUrl?: string,              // Optional Cloudinary URL for video
  caption?: string,               // Optional description/caption
  featured: boolean,              // Whether to feature prominently
  createdAt: Date,               // Creation timestamp
  updatedAt?: Date               // Last modification timestamp
}
```

### contacts
```javascript
{
  id: string,                     // Auto-generated document ID
  name: string,                   // Contact's name
  email: string,                  // Contact's email
  phone?: string,                 // Optional phone number
  subject: string,                // Message subject
  message: string,                // Message content
  createdAt: Date,               // Submission timestamp
  status?: 'new' | 'responded'   // Optional status tracking
}
```

## Security Rules

### Basic Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Bookings: Users can create and read their own, admins can manage all
    match /bookings/{bookingId} {
      allow create: if request.auth != null;
      allow read, update: if request.auth != null && 
        (resource.data.userId == request.auth.uid || 
         get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin');
    }
    
    // Portfolio: Public read, admin write
    match /portfolio/{portfolioId} {
      allow read: if true;
      allow write: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
    
    // Contacts: Anyone can create, admins can read
    match /contacts/{contactId} {
      allow create: if true;
      allow read: if request.auth != null && 
        get(/databases/$(database)/documents/users/$(request.auth.uid)).data.role == 'admin';
    }
  }
}
```

## Example Documents

### Example User Document
```javascript
{
  uid: "user123abc",
  displayName: "John Smith",
  email: "john@example.com",
  phone: "+1-555-123-4567",
  address: "123 Main St, Anytown, ST 12345",
  location: {
    lat: 40.7128,
    lng: -74.0060
  },
  profileImageUrl: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/profiles/user123abc.jpg",
  role: "user",
  createdAt: "2024-01-15T10:30:00Z"
}
```

### Example Booking Document
```javascript
{
  bookingId: "booking456def",
  userId: "user123abc",
  serviceCategory: "Wedding",
  startDateTime: "2024-06-15T14:00:00Z",
  endDateTime: "2024-06-15T20:00:00Z",
  location: {
    address: "Grand Ballroom, 456 Wedding Ave, City, ST 12345",
    lat: 40.7589,
    lng: -73.9851
  },
  attachments: [
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bookings/inspiration1.jpg",
    "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/bookings/inspiration2.jpg"
  ],
  additionalNotes: "Outdoor ceremony followed by indoor reception. Need photographer from 2pm-8pm.",
  status: "accepted",
  adminNotes: "Confirmed! Looking forward to capturing your special day.",
  createdAt: "2024-01-20T15:45:00Z",
  updatedAt: "2024-01-21T09:30:00Z"
}
```

### Example Portfolio Document
```javascript
{
  id: "portfolio789ghi",
  title: "Sunset Wedding Ceremony",
  category: "Wedding",
  tags: ["outdoor", "sunset", "ceremony", "romantic"],
  imageUrl: "https://res.cloudinary.com/your-cloud/image/upload/v1234567890/portfolio/wedding-sunset.jpg",
  videoUrl: "https://res.cloudinary.com/your-cloud/video/upload/v1234567890/portfolio/wedding-sunset.mp4",
  caption: "A beautiful outdoor ceremony captured during golden hour at Riverside Gardens.",
  featured: true,
  createdAt: "2024-01-10T12:00:00Z"
}
```

## Indexes Required

Create these indexes in Firestore console:

### Bookings Collection
- `userId` ASC, `createdAt` DESC
- `status` ASC, `createdAt` DESC
- `serviceCategory` ASC, `createdAt` DESC

### Portfolio Collection
- `category` ASC, `createdAt` DESC
- `featured` DESC, `createdAt` DESC
- `tags` ARRAY, `createdAt` DESC

### Contacts Collection
- `createdAt` DESC

## Admin Setup

To set a user as admin, manually update their document in Firestore:

1. Go to Firestore Console
2. Navigate to `users` collection
3. Find the user document
4. Update the `role` field from `"user"` to `"admin"`

Alternatively, create an admin function (one-time use):
```javascript
// Run this once to promote a user to admin
const promoteToAdmin = async (userEmail) => {
  const userSnapshot = await adminDb.collection('users')
    .where('email', '==', userEmail)
    .limit(1)
    .get();
    
  if (!userSnapshot.empty) {
    const userDoc = userSnapshot.docs[0];
    await userDoc.ref.update({ role: 'admin' });
    console.log(`User ${userEmail} promoted to admin`);
  }
};
```