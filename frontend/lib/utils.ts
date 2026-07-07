import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}