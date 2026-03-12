'use client';

import { firebaseConfigBase } from '@/firebase/config';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Construct the full config object, pulling the apiKey from environment variables.
const firebaseConfig = {
  ...firebaseConfigBase,
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
};

// Call this function to get the Firebase services in a client component.
export const getFirebase = (): { app: FirebaseApp, auth: Auth, firestore: Firestore } => {
  // We must check if the apiKey is present, otherwise Firebase will throw a less useful error.
  if (!firebaseConfig.apiKey) {
    throw new Error('The `NEXT_PUBLIC_FIREBASE_API_KEY` environment variable is not set. Please add it to your .env.local file.');
  }
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
};
