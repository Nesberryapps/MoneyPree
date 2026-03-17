
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(dateInput: any) {
  // To prevent hydration errors, we must ensure the date is formatted consistently
  // on both the server and the client.
  let dateObj: Date;

  if (dateInput instanceof Date) {
    dateObj = dateInput;
  } else if (typeof dateInput === 'string') {
    dateObj = new Date(dateInput);
  } else if (dateInput && typeof dateInput.toDate === 'function') {
    // Handle Firestore Timestamps
    dateObj = dateInput.toDate();
  } else {
    // Return a default or empty string if the date is not a valid type
    return '';
  }
  
  if (isNaN(dateObj.getTime())) {
    return ''; // Invalid date
  }

  // 'en-CA' format is 'YYYY-MM-DD', which is unambiguous and safe for hydration.
  return dateObj.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}
