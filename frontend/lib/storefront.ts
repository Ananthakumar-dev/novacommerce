import { getApiGatewayUrl } from "@/lib/auth"

export type StorefrontCategory = {
  id: number
  name: string
  slug: string
  description: string | null
  icon: string | null
  image: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type StorefrontProduct = {
  id: number
  name: string
  slug: string
  description: string | null
  shortDescription: string | null
  sku: string
  price: number
  salePrice: number | null
  stockQuantity: number
  lowStockThreshold: number
  status: "DRAFT" | "ACTIVE" | "INACTIVE"
  category: string
  brand: string
  imageUrl: string | null
  featured: boolean
  popular: boolean
  metaTitle: string | null
  metaDescription: string | null
  createdAt: string
  updatedAt: string
}

export type StorefrontBrand = {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type StorefrontProductPage = {
  items: StorefrontProduct[]
  page: number
  size: number
  totalItems: number
  totalPages: number
}

export type StorefrontProductCatalogParams = {
  q?: string
  category?: string
  brand?: string
  minPrice?: string
  maxPrice?: string
  inStock?: string
  sort?: string
  page?: string
  size?: string
}

export async function listStorefrontCategories() {
  return storefrontFetch<StorefrontCategory[]>("/api/storefront/categories", [])
}

export async function listStorefrontBrands() {
  return storefrontFetch<StorefrontBrand[]>("/api/storefront/brands", [])
}

export async function listStorefrontProducts(size = 12) {
  return storefrontFetch<StorefrontProduct[]>(
    `/api/storefront/products?size=${size}`,
    []
  )
}

export async function listPopularProducts(size = 12) {
  return storefrontFetch<StorefrontProduct[]>(
    `/api/storefront/products/popular?size=${size}`,
    []
  )
}

export async function listFeaturedProducts(size = 6) {
  return storefrontFetch<StorefrontProduct[]>(
    `/api/storefront/products/featured?size=${size}`,
    []
  )
}

export async function listStorefrontProductCatalog(
  params: StorefrontProductCatalogParams = {}
) {
  const searchParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      searchParams.set(key, value)
    }
  })

  const query = searchParams.toString()
  return storefrontFetch<StorefrontProductPage>(
    `/api/storefront/products/catalog${query ? `?${query}` : ""}`,
    { items: [], page: 0, size: 12, totalItems: 0, totalPages: 0 }
  )
}

async function storefrontFetch<T>(path: string, fallback: T) {
  try {
    const response = await fetch(`${getApiGatewayUrl()}${path}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return fallback
    }

    return (await response.json()) as T
  } catch {
    return fallback
  }
}
