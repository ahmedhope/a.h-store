import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const arabicMap: Record<string, string> = {
  "أ": "a", "ا": "a", "إ": "a", "آ": "a",
  "ب": "b", "ت": "t", "ث": "th",
  "ج": "j", "ح": "h", "خ": "kh",
  "د": "d", "ذ": "dh", "ر": "r", "ز": "z",
  "س": "s", "ش": "sh", "ص": "s", "ض": "d",
  "ط": "t", "ظ": "z", "ع": "a", "غ": "gh",
  "ف": "f", "ق": "q", "ك": "k", "ل": "l",
  "م": "m", "ن": "n", "ه": "h", "ة": "h",
  "و": "w", "ي": "y", "ى": "a", "ئ": "a",
  "ء": "a", "ؤ": "o", "لا": "la",
}

export function slugify(text: string): string {
  const slug = text
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/[^a-zA-Z0-9\u0600-\u06FF\-_]/g, "")
    .toLowerCase()
    .replace(/[\u0600-\u06FF]/g, (ch) => arabicMap[ch] || ch)
    .replace(/-+/g, "-")
  return slug || `product-${Date.now()}`
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP" }).format(price)
}

export function parseImages(images: string): string[] {
  try { return JSON.parse(images) as string[] } catch { return [] }
}
