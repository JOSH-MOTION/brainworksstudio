# Deployment Checklist for Brain Works Studio Africa

## Pre-Deployment Setup

### 1. Environment Variables Setup

Create production environment variables in your hosting platform:

**Firebase Configuration (Public)**
```
NEXT_PUBLIC_FIREBASE_API_KEY=your_production_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=brainworksstudio.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=brainworksstudio
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=brainworksstudio.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef123456
```

**Firebase Admin (Server-side Only)**
```
FIREBASE_PROJECT_ID=brainworksstudio
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@brainworksstudio.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYour_Private_Key_Here\n-----END PRIVATE KEY-----\n"
```

**Cloudinary Configuration**
```
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=brainworksstudio
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=bws_uploads
CLOUDINARY_API_KEY=123456789012345
CLOUDINARY_API_SECRET=your_api_secret
```

**Gmail SMTP Configuration**
```
GMAIL_USER=hello@brainworksstudio2.com
GMAIL_PASS=your_app_specific_password
```

**App Configuration**
```
NEXT_PUBLIC_APP_URL=https://brainworksstudio.com
```

### 2. Firebase Setup

#### Firestore Database
1. Create Firestore database in production mode
2. Set up security rules (see FIRESTORE_SCHEMA.md)
3. Create required indexes:
   - `bookings`: userId ASC, createdAt DESC
   - `bookings`: status ASC, createdAt DESC
   - `portfolio`: category ASC, createdAt DESC
   - `portfolio`: featured DESC, createdAt DESC

#### Authentication
1. Enable Email/Password authentication
2. Set up authorized domains for production
3. Configure email templates for password reset

#### Service Account
1. Generate service account key
2. Add to environment variables (never commit to code)

### 3. Cloudinary Setup

1. Create Cloudinary account
2. Set up upload preset:
   - Name: `bws_uploads`
   - Signing Mode: `Unsigned`
   - Folder: `brain-works-studio`
   - Allowed formats: `jpg,png,gif,mp4,mov`
   - Max file size: `10MB` for images, `100MB` for videos
3. Configure auto-optimization and responsive delivery

### 4. Gmail Setup

1. Enable 2-Factor Authentication on Gmail account
2. Generate App-Specific Password
3. Test email delivery in development

## Deployment Steps

### Vercel Deployment

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm i -g vercel
   
   # Login to Vercel
   vercel login
   
   # Deploy from project directory
   vercel
   ```

2. **Configure Environment Variables**
   - Go to Vercel Dashboard → Project Settings → Environment Variables
   - Add all environment variables from above
   - Set appropriate environments (Production, Preview, Development)

3. **Configure Build Settings**
   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install",
     "devCommand": "npm run dev"
   }
   ```

4. **Domain Configuration**
   - Add custom domain in Vercel dashboard
   - Configure DNS settings
   - Enable HTTPS (automatic with Vercel)

### Alternative: Self-Hosted Deployment

1. **Server Setup**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/brain-works-studio.git
   cd brain-works-studio
   
   # Install dependencies
   npm install
   
   # Build application
   npm run build
   
   # Start production server
   npm run start
   ```

2. **Process Manager (PM2)**
   ```bash
   # Install PM2
   npm install -g pm2
   
   # Start application
   pm2 start npm --name "brain-works-studio" -- start
   
   # Save PM2 configuration
   pm2 save
   pm2 startup
   ```

3. **Nginx Configuration**
   ```nginx
   server {
       listen 80;
       server_name brainworksstudio.com www.brainworksstudio.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Post-Deployment Configuration

### 1. Create First Admin User

After deployment, create an admin user:

1. Sign up through the regular signup flow
2. Manually update the user's role in Firestore:
   ```javascript
   // In Firestore console, find the user document and update:
   {
     role: "admin"  // Change from "user" to "admin"
   }
   ```

### 2. Add Initial Portfolio Items

1. Login as admin
2. Navigate to `/admin/portfolio`
3. Upload initial portfolio images and videos
4. Set appropriate categories and tags
5. Mark featured items

### 3. Test All Functionality

- [ ] User registration and login
- [ ] Profile updates with image upload
- [ ] Booking creation and email notifications
- [ ] Contact form submission
- [ ] Portfolio viewing and filtering
- [ ] Admin panel access and functions
- [ ] Email delivery (booking confirmations, status updates)
- [ ] File uploads to Cloudinary
- [ ] Responsive design on mobile devices

### 4. SEO and Performance

1. **Add robots.txt**
   ```
   User-agent: *
   Allow: /
   Disallow: /admin/
   Disallow: /api/
   
   Sitemap: https://brainworksstudio.com/sitemap.xml
   ```

2. **Generate sitemap.xml**
   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://brainworksstudio.com</loc>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>https://brainworksstudio.com/portfolio</loc>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>https://brainworksstudio.com/about</loc>
       <priority>0.7</priority>
     </url>
     <url>
       <loc>https://brainworksstudio.com/contact</loc>
       <priority>0.6</priority>
     </url>
   </urlset>
   ```

3. **Performance Optimizations**
   - Enable Cloudinary auto-optimization
   - Configure Next.js image optimization
   - Add service worker for offline support (optional)
   - Enable compression and caching headers

## Monitoring and Maintenance

### 1. Analytics Setup

1. **Google Analytics**
   - Add GA4 tracking code
   - Set up conversion goals (booking submissions, contact forms)
   - Configure enhanced ecommerce (if adding payments later)

2. **Error Monitoring**
   - Set up Sentry or similar service
   - Monitor API errors and user issues
   - Set up alerts for critical errors

### 2. Regular Backups

1. **Firestore Backup**
   - Enable automated Firestore backups
   - Test restore procedures
   - Set up monitoring for backup success

2. **Cloudinary Backup**
   - Consider backup strategy for media files
   - Monitor storage usage and costs

### 3. Security Monitoring

1. **Firebase Security Rules**
   - Regularly audit security rules
   - Monitor for unauthorized access attempts
   - Keep Firebase SDK updated

2. **Email Security**
   - Monitor for email delivery issues
   - Rotate Gmail app passwords regularly
   - Watch for spam reports

## Troubleshooting Common Issues

### 1. Build Failures
```bash
# Clear Next.js cache
rm -rf .next

# Clear node modules
rm -rf node_modules package-lock.json
npm install

# Build with verbose output
npm run build --verbose
```

### 2. Environment Variable Issues
- Verify all required variables are set
- Check for typos in variable names
- Ensure sensitive variables are server-side only

### 3. Firebase Connection Issues
- Verify service account permissions
- Check Firestore security rules
- Confirm project ID matches across all configs

### 4. Email Delivery Problems
- Verify Gmail app password is correct
- Check spam folders for test emails
- Monitor Gmail account for security alerts

## Success Metrics

Track these metrics after deployment:

- [ ] User registration rate
- [ ] Booking conversion rate (visitors → bookings)
- [ ] Email delivery rate (>95%)
- [ ] Page load speed (<3 seconds)
- [ ] Mobile usability score (>90)
- [ ] Contact form completion rate
- [ ] Portfolio engagement (time on page)
- [ ] Admin panel usage and efficiency

## Maintenance Schedule

**Weekly:**
- Review error logs and fix critical issues
- Check email delivery status
- Monitor storage usage (Cloudinary/Firestore)

**Monthly:**
- Update dependencies and security patches
- Review analytics and user feedback
- Backup and test restore procedures

**Quarterly:**
- Security audit of permissions and access
- Performance optimization review
- User experience testing and improvements