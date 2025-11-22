'use client';

import { firebaseConfig } from '@/firebase/config';
import { getApp, getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Call this function to get the Firebase services in a client component.
export const getFirebase = () => {
  const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const firestore = getFirestore(app);
  return { app, auth, firestore };
};

export * from './provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';

    