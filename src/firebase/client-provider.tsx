'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { getFirebase } from '.';
import { FirebaseProvider } from './provider';

/**
 * A client-side component that ensures Firebase is initialized only once.
 * It fetches the Firebase services and then renders the main FirebaseProvider.
 * This is crucial for Next.js App Router to prevent re-initialization on every render.
 */
export function FirebaseClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [services, setServices] = useState<{
    app: any;
    auth: any;
    firestore: any;
  } | null>(null);

  useEffect(() => {
    // getFirebase initializes the app if it's not already initialized
    // and returns the services. This should only run on the client.
    setServices(getFirebase());
  }, []);

  if (!services) {
    // You can render a loading state here if needed,
    // but for a fast initialization, it might be unnoticeable.
    return null;
  }

  return <FirebaseProvider {...services}>{children}</FirebaseProvider>;
}
