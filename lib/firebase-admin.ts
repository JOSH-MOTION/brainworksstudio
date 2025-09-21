import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

// Check if required environment variables are present
const requiredEnvVars = {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
};

// Validate environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingVars.length > 0) {
  console.warn(`Missing Firebase Admin environment variables: ${missingVars.join(', ')}`);
  console.warn('Firebase Admin SDK will not be initialized. Some server-side features may not work.');
}

// Only initialize if all required environment variables are present
if (!getApps().length && missingVars.length === 0) {
  try {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    if (!privateKey || !privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
      throw new Error('FIREBASE_PRIVATE_KEY must be a valid PEM formatted private key');
    }

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey,
    }),
  });
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    console.error('Please check your Firebase environment variables in .env.local');
  }
}

// Export with fallback handling
export const adminDb = missingVars.length === 0 ? getFirestore() : null;
export const adminAuth = missingVars.length === 0 ? getAuth() : null;