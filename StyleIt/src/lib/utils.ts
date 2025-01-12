import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const addIfUnique = (prev, item) => {
  if (!prev) return [item];
  
  return prev.some((prevItem) => prevItem._id === item._id)
    ? prev
    : [...prev, item];
};