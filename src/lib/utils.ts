import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date) {
  // Get the timezone from the browser
  const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  
  // Format the date in a way that is not ambiguous
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    timeZone: userTimezone,
  });
}
