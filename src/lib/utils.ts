import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Combines and merges class names for Tailwind CSS.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
