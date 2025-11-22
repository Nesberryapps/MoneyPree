'use client';

import { useContext } from 'react';
import { FirebaseContext } from '@/firebase/provider';

/**
 * Custom hook to access the authenticated user's state.
 *
 * This hook provides a convenient way to get the current user object and
 * the loading state of the authentication process. It must be used within
 * a `FirebaseProvider` component.
 *
 * @returns An object containing:
 *  - `user`: The current Firebase `User` object, or `null` if not authenticated.
 *  - `isUserLoading`: A boolean that is `true` while the authentication state is being determined, and `false` otherwise.
 *
 * @example
 * const { user, isUserLoading } = useUser();
 * if (isUserLoading) {
 *   return <p>Loading...</p>;
 * }
 * if (user) {
 *   return <p>Welcome, {user.displayName}!</p>;
 * }
 * return <p>Please sign in.</p>;
 */
export function useUser() {
  const context = useContext(FirebaseContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a FirebaseProvider');
  }
  return {
    user: context.user,
    isUserLoading: context.isUserLoading,
  };
}
