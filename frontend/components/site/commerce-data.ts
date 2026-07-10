import {
  Headphones,
  Home,
  Laptop,
  Shirt,
  Smartphone,
  Sparkles,
  Watch,
} from "lucide-react"

export const categories = [
  { name: "Mobiles", icon: Smartphone, tone: "bg-sky-50 text-sky-700" },
  { name: "Electronics", icon: Laptop, tone: "bg-violet-50 text-violet-700" },
  { name: "Fashion", icon: Shirt, tone: "bg-rose-50 text-rose-700" },
  { name: "Audio", icon: Headphones, tone: "bg-emerald-50 text-emerald-700" },
  { name: "Watches", icon: Watch, tone: "bg-amber-50 text-amber-700" },
  { name: "Home", icon: Home, tone: "bg-lime-50 text-lime-700" },
  { name: "Beauty", icon: Sparkles, tone: "bg-fuchsia-50 text-fuchsia-700" },
]

export const products = [
  {
    slug: "nova-x1-smartphone",
    name: "Nova X1 5G Smartphone",
    category: "Mobiles",
    brand: "Nova",
    price: 24999,
    originalPrice: 32999,
    rating: 4.5,
    reviews: 12843,
    badge: "Best seller",
    imageTone: "from-sky-100 via-white to-indigo-100",
    accent: "bg-sky-600",
    description:
      "A slim 5G phone with a vivid display, dependable battery life, and camera tuning made for everyday photos.",
  },
  {
    slug: "aero-buds-pro",
    name: "Aero Buds Pro ANC",
    category: "Audio",
    brand: "Aero",
    price: 3999,
    originalPrice: 6999,
    rating: 4.3,
    reviews: 6570,
    badge: "Deal",
    imageTone: "from-emerald-100 via-white to-cyan-100",
    accent: "bg-emerald-600",
    description:
      "Wireless earbuds with active noise cancellation, clear calls, and a compact charging case.",
  },
  {
    slug: "stride-runner-shoes",
    name: "Stride Runner Shoes",
    category: "Fashion",
    brand: "Stride",
    price: 2199,
    originalPrice: 3999,
    rating: 4.2,
    reviews: 3109,
    badge: "Trending",
    imageTone: "from-rose-100 via-white to-orange-100",
    accent: "bg-rose-600",
    description:
      "Lightweight running shoes with breathable mesh and cushioned support for daily training.",
  },
  {
    slug: "orbit-smart-watch",
    name: "Orbit Smart Watch",
    category: "Watches",
    brand: "Orbit",
    price: 2799,
    originalPrice: 5499,
    rating: 4.4,
    reviews: 4894,
    badge: "Limited",
    imageTone: "from-amber-100 via-white to-yellow-100",
    accent: "bg-amber-600",
    description:
      "A bright-display smartwatch with health tracking, Bluetooth calling, and multi-day battery life.",
  },
  {
    slug: "zenbook-air-14",
    name: "ZenBook Air 14 Laptop",
    category: "Electronics",
    brand: "ZenBook",
    price: 58990,
    originalPrice: 74990,
    rating: 4.6,
    reviews: 2187,
    badge: "Top rated",
    imageTone: "from-violet-100 via-white to-slate-100",
    accent: "bg-violet-600",
    description:
      "A portable 14-inch laptop for work, classes, and streaming with fast storage and a crisp display.",
  },
  {
    slug: "pureblend-mixer",
    name: "PureBlend Mixer Grinder",
    category: "Home",
    brand: "PureBlend",
    price: 3299,
    originalPrice: 5299,
    rating: 4.1,
    reviews: 1762,
    badge: "Value pick",
    imageTone: "from-lime-100 via-white to-emerald-100",
    accent: "bg-lime-600",
    description:
      "A compact mixer grinder with stainless steel jars and reliable power for daily kitchen prep.",
  },
]

export const featuredCollections = [
  {
    title: "Top electronics",
    caption: "Work, stream, and upgrade for less",
    productSlugs: ["zenbook-air-14", "nova-x1-smartphone", "aero-buds-pro"],
  },
  {
    title: "Daily essentials",
    caption: "Useful picks with fast delivery",
    productSlugs: ["pureblend-mixer", "orbit-smart-watch", "stride-runner-shoes"],
  },
]

export function getProductBySlug(slug: string) {
  return products.find((product) => product.slug === slug) ?? products[0]
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price)
}

export function discountPercent(price: number, originalPrice: number) {
  return Math.round(((originalPrice - price) / originalPrice) * 100)
}
