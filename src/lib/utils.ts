import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines and merges class names for Tailwind CSS.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Function to calculate relative time
export const getRelativeTime = (timestamp: Date): string => {
  const now = new Date();
  const diff = Math.abs(now.getTime() - timestamp.getTime());
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years} year${years > 1 ? "s" : ""} ago`;
  } else if (months > 0) {
    return `${months} month${months > 1 ? "s" : ""} ago`;
  } else if (days > 0) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? "s" : ""} ago`;
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
  } else {
    return "Just now";
  }
};

export const convertToDate = (time: {
  seconds: number;
  nanoseconds: number;
}): Date => {
  return new Date(time.seconds * 1000); // Convert seconds to milliseconds
};

export const truncateText = (text: string, n: number = 30) => {
  if (text.length > n) {
    return text.slice(0, n) + "...";
  }
  return text;
};
