import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string) {
  // To prevent hydration errors, we must ensure the date is formatted consistently
  // on both the server and the client.
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // 'en-CA' format is 'YYYY-MM-DD', which is unambiguous and safe for hydration.
  // We can add time and timezone if needed, but for display, this is often sufficient.
  // We'll then replace the dashes with slashes for the desired format.
  return dateObj.toLocaleDateString('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).replace(/-/g, '/');
}
