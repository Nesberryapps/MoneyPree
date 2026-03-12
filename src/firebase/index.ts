
'use client';

import { firebaseConfig } from '@/firebase/config';
import { getApp, getApps, initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';

// Call this function to get the Firebase services in a client component.
export const getFirebase = (): { app: FirebaseApp, auth: Auth, firestore: Firestore } => {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
};
