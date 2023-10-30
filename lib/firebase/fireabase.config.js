import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from "firebase/storage";
import { getAnalytics, isSupported } from 'firebase/analytics';

/**
 * Firebase configuration object
 * @typedef {Object} FirebaseConfig
 * @property {string} apiKey - Firebase API key
 * @property {string} authDomain - Firebase authentication domain
 * @property {string} projectId - Firebase project ID
 * @property {string} storageBucket - Firebase storage bucket
 * @property {string} messagingSenderId - Firebase messaging sender ID
 * @property {string} appId - Firebase app ID
 * @property {string} measurementId - Firebase measurement ID
 */
const config = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
};

/**
 * Firebase app instance
 * @type {import('firebase/app').FirebaseApp}
 */
export const firebaseApp = initializeApp(config);

/**
 * Firestore database instance
 * @type {import('firebase/firestore').Firestore}
 */
export const firestoreDB = getFirestore(firebaseApp);

/**
 * Firebase authentication instance
 * @type {import('firebase/auth').Auth}
 */
export const firebaseAuth = getAuth(firebaseApp);

/**
 * Firebase storage instance
 * @type {import('firebase/storage').Storage}
 */
export const firebaseStorage = getStorage(firebaseApp);

/**
 * Firebase analytics instance
 * @type {Promise<import('firebase/analytics').Analytics|null>}
 */
export const firebaseAnalytics = isSupported().then((isSupported) => {
    if (isSupported) {
        return getAnalytics(firebaseApp);
    }
    return null;
});


