import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: any) {
  // To prevent hydration errors, we must ensure the date is formatted consistently
  // on both the server and the client.
  let dateObj: Date;

  if (typeof date === 'string') {
    dateObj = new Date(date);
  } else if (date && typeof date.toDate === 'function') {
    // Handle Firestore Timestamps
    dateObj = date.toDate();
  } else if (date instanceof Date) {
    dateObj = date;
  } else {
    // Return a default or empty string if the date is not a valid type
    return '';
  }
  
  // 'en-CA' format is 'YYYY-MM-DD', which is unambiguous and safe for hydration.
  // We'll then replace the dashes with slashes for the desired format.
  return dateObj.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/-/g, '/');
}
