import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore, Firestore } from 'firebase-admin/firestore';
import { getAuth, Auth } from 'firebase-admin/auth';

let adminDb: Firestore | null = null;
let adminAuth: Auth | null = null;

if (!getApps().length) {
  try {
    const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
    if (!serviceAccountJson) {
      throw new Error('FIREBASE_SERVICE_ACCOUNT_JSON environment variable is not set');
    }

    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountJson);
    } catch (error) {
      throw new Error(`Failed to parse FIREBASE_SERVICE_ACCOUNT_JSON: ${(error as Error).message}`);
    }

    if (!serviceAccount.project_id || !serviceAccount.private_key || !serviceAccount.client_email) {
      throw new Error('Invalid service account: Missing required fields');
    }

    const app = initializeApp({
      credential: cert(serviceAccount),
    });

    adminDb = getFirestore(app);
    adminAuth = getAuth(app);
    console.log('Firebase Admin SDK initialized successfully for project:', serviceAccount.project_id);
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
    console.error('Environment variable:', process.env.FIREBASE_SERVICE_ACCOUNT_JSON ? 'Set' : 'Not set');
    adminDb = null;
    adminAuth = null;
  }
} else {
  try {
    adminDb = getFirestore();
    adminAuth = getAuth();
    console.log('Using existing Firebase app');
  } catch (error) {
    console.error('Error getting Firebase services:', error);
    adminDb = null;
    adminAuth = null;
  }
}

export { adminDb, adminAuth };