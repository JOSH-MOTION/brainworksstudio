import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getAuth } from 'firebase-admin/auth';

let adminDb: any = null;
let adminAuth: any = null;

// Initialize Firebase Admin SDK
if (!getApps().length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set');
    }

    const serviceAccount = JSON.parse(serviceAccountJson);
    
    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    adminDb = getFirestore(app);
    adminAuth = getAuth(app);
    
    console.log('Firebase Admin SDK initialized successfully');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    console.error('Please check your FIREBASE_SERVICE_ACCOUNT_JSON in .env.local');
    
    // Set to null to ensure no partial initialization
    adminDb = null;
    adminAuth = null;
  }
} else {
  // If app already exists, just get the services
  try {
    adminDb = getFirestore();
    adminAuth = getAuth();
  } catch (error) {
    console.error('Error getting Firebase services:', error);
    adminDb = null;
    adminAuth = null;
  }
}

export { adminDb, adminAuth };