# API Routes Documentation

## Authentication Routes

All protected routes require Firebase ID token in Authorization header:
```
Authorization: Bearer <firebase_id_token>
```

## Booking Routes

### POST /api/bookings
Create a new booking request.

**Request Body:**
```javascript
{
  userId: string,
  userName: string,
  userEmail: string,
  serviceCategory: 'Event' | 'Portrait' | 'Product' | 'Commercial' | 'Wedding',
  date: string,           // YYYY-MM-DD format
  startTime: string,      // HH:MM format
  endTime: string,        // HH:MM format
  address: string,
  additionalNotes?: string,
  attachments?: File[]    // Array of files for upload
}
```

**Response:**
```javascript
{
  success: boolean,
  bookingId: string
}
```

**Process:**
1. Uploads attachments to Cloudinary
2. Saves booking to Firestore with 'pending' status
3. Sends confirmation email to user
4. Sends notification email to admin

### GET /api/bookings
Get all bookings (admin only).

**Response:**
```javascript
[
  {
    id: string,
    bookingId: string,
    userId: string,
    serviceCategory: string,
    startDateTime: Date,
    endDateTime: Date,
    location: { address: string, lat?: number, lng?: number },
    attachments: string[],
    additionalNotes?: string,
    status: 'pending' | 'accepted' | 'rejected',
    adminNotes?: string,
    createdAt: Date,
    updatedAt: Date
  }
]
```

### GET /api/bookings/user
Get bookings for the authenticated user.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```javascript
[
  {
    // Same structure as above, filtered by userId
  }
]
```

### PUT /api/bookings/[id]
Update booking status (admin only).

**Request Body:**
```javascript
{
  status: 'accepted' | 'rejected',
  adminNotes?: string
}
```

**Response:**
```javascript
{
  success: boolean
}
```

**Process:**
1. Updates booking status in Firestore
2. Sends status update email to user

## Portfolio Routes

### GET /api/portfolio
Get all portfolio items (public).

**Response:**
```javascript
[
  {
    id: string,
    title: string,
    category: string,
    tags: string[],
    imageUrl: string,
    videoUrl?: string,
    caption?: string,
    featured: boolean,
    createdAt: Date
  }
]
```

### POST /api/portfolio
Create new portfolio item (admin only).

**Request Body:**
```javascript
{
  title: string,
  category: string,
  tags: string[],
  imageFile: File,
  videoFile?: File,
  caption?: string,
  featured: boolean
}
```

**Response:**
```javascript
{
  success: boolean,
  portfolioId: string
}
```

### PUT /api/portfolio/[id]
Update portfolio item (admin only).

### DELETE /api/portfolio/[id]
Delete portfolio item (admin only).

## Contact Routes

### POST /api/contact
Submit contact form (public).

**Request Body:**
```javascript
{
  name: string,
  email: string,
  phone?: string,
  subject: string,
  message: string
}
```

**Response:**
```javascript
{
  success: boolean
}
```

**Process:**
1. Saves contact to Firestore
2. Sends confirmation email to user
3. Sends notification email to admin

### GET /api/contact
Get all contact submissions (admin only).

## User Profile Routes

### GET /api/users/profile
Get current user's profile.

**Headers:**
```
Authorization: Bearer <firebase_id_token>
```

**Response:**
```javascript
{
  uid: string,
  displayName: string,
  email: string,
  phone?: string,
  address?: string,
  location?: { lat: number, lng: number },
  profileImageUrl?: string,
  role: 'user' | 'admin',
  createdAt: Date
}
```

### PUT /api/users/profile
Update user profile.

**Request Body:**
```javascript
{
  displayName?: string,
  phone?: string,
  address?: string,
  location?: { lat: number, lng: number },
  profileImage?: File
}
```

**Response:**
```javascript
{
  success: boolean,
  profileImageUrl?: string
}
```

## Admin Routes

### GET /api/admin/users
Get all users (admin only).

### GET /api/admin/bookings
Get all bookings with filters (admin only).

**Query Parameters:**
- `status`: Filter by booking status
- `category`: Filter by service category
- `startDate`: Filter bookings from date
- `endDate`: Filter bookings to date

### PUT /api/admin/bookings/[id]/status
Update booking status (admin only).

### GET /api/admin/contacts
Get all contact submissions (admin only).

## Upload Routes

### POST /api/upload/image
Upload image to Cloudinary.

**Request Body:**
```javascript
FormData {
  file: File,
  folder?: string
}
```

**Response:**
```javascript
{
  success: boolean,
  imageUrl: string,
  publicId: string
}
```

### POST /api/upload/video
Upload video to Cloudinary.

## Utility Routes

### GET /api/health
Health check endpoint.

**Response:**
```javascript
{
  status: 'ok',
  timestamp: Date
}
```

## Error Responses

All routes return consistent error responses:

```javascript
{
  error: string,
  details?: any
}
```

Common HTTP status codes:
- `400`: Bad Request - Invalid input data
- `401`: Unauthorized - Missing or invalid authentication
- `403`: Forbidden - Insufficient permissions
- `404`: Not Found - Resource doesn't exist
- `500`: Internal Server Error - Server-side error

## Rate Limiting

Consider implementing rate limiting for public endpoints:
- Contact form: 5 submissions per hour per IP
- Portfolio views: 100 requests per minute per IP
- Booking creation: 3 bookings per hour per user

## Example API Usage

### Create Booking
```javascript
const createBooking = async (bookingData) => {
  const token = await user.getIdToken();
  
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(bookingData)
  });
  
  return response.json();
};
```

### Get User Bookings
```javascript
const getUserBookings = async () => {
  const token = await user.getIdToken();
  
  const response = await fetch('/api/bookings/user', {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  });
  
  return response.json();
};
```

### Submit Contact Form
```javascript
const submitContact = async (contactData) => {
  const response = await fetch('/api/contact', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactData)
  });
  
  return response.json();
};
```

## Bulk SMS Routes (admin only — require `Authorization: Bearer <firebase_id_token>`, role `admin`)

Separate from the `contacts` collection (contact-form leads) — these manage
`smsContacts`, the admin's own phone-number list for bulk SMS campaigns.

### GET /api/admin/sms-contacts
List all SMS contacts, newest first.

### POST /api/admin/sms-contacts
Add **or edit** one contact. Body: `{ name?: string, phone: string, birthday?: string | null }`
(`birthday` as `"YYYY-MM-DD"`). Upserts by normalized phone number (used as
the Firestore doc ID) — calling this again with an existing number updates
that contact in place (the UI uses this same endpoint for its Edit dialog)
rather than duplicating it. Preserves `source`, `createdAt`, and
`lastBirthdaySentYear` across an edit.

### POST /api/admin/sms-contacts/import
Bulk upsert. Body: `{ rows: { name?: string, phone: string, birthday?: string }[] }`.
Response: `{ ok, imported, skipped }`. A row's `birthday` is only written
when present, so a plain name/phone CSV re-import never clears a birthday
added later by hand.

### DELETE /api/admin/sms-contacts/[id]
Remove one contact (id = normalized phone number).

### POST /api/admin/sms/send
Body: `{ contactIds: string[], message: string }`. `message` may contain a
`{name}` token — recipients are grouped by their rendered text so a plain
broadcast (no token) still goes out as one batched call, while a
personalized one sends per distinct name. Sends via Quick SMS
(`QUICKSMS_PUBLIC_API_KEY` + `QUICKSMS_SENDER_ID` env vars); if those aren't set,
returns `{ ok: false, configured: false, recipients: string[] }` instead of
erroring, so the admin UI can offer a "copy numbers" fallback. Successful
sends are logged to `smsLogs`.

### GET /api/admin/sms/birthday-settings
Returns `{ enabled: boolean, template: string }` (defaults to a built-in
template, disabled, if `settings/birthdaySms` doesn't exist yet).

### PUT /api/admin/sms/birthday-settings
Body: `{ enabled: boolean, template: string }`. `template` may contain `{name}`.

## Cron Routes

### GET /api/cron/birthday-sms
Runs daily (see `vercel.json`'s `crons` entry — schedule `0 7 * * *`,
7am Ghana time). Finds every `smsContacts` doc whose `birthdayMonthDay`
matches today, skips anyone with `lastBirthdaySentYear` already equal to
the current year (so a retry or a second manual trigger same day can't
double-send), sends the saved template, and stamps `lastBirthdaySentYear`
on each contact sent to. No-ops with `{ ok: true, skipped: ... }` if
birthday autosend is disabled. If `CRON_SECRET` is set, requires
`Authorization: Bearer <CRON_SECRET>` (Vercel Cron sends this
automatically when the env var is configured).