import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { getApiGatewayUrl } from "@/lib/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

export function mediaUrl(url?: string | null) {
  if (!url) {
    return null
  }

  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url
  }

  return `${getApiGatewayUrl()}${url}`
}