import Link from "next/link"
import {
  Filter,
  PackageSearch,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { ProductCard } from "@/components/site/product-card"
import { SiteFooter } from "@/components/site/site-footer"
import { SiteHeader } from "@/components/site/site-header"
import {
  listStorefrontBrands,
  listStorefrontCategories,
  listStorefrontProductCatalog,
} from "@/lib/storefront"
import { ProductFilterForm } from "./product-filter-form"

type ProductsPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

const sortLabels: Record<string, string> = {
  newest: "Newest",
  popular: "Popular",
  "price-asc": "Price: low to high",
  "price-desc": "Price: high to low",
  "name-asc": "Name: A to Z",
}

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const rawSearchParams = await searchParams
  const filters = normalizeFilters(rawSearchParams)

  const [categories, brands, productPage] = await Promise.all([
    listStorefrontCategories(),
    listStorefrontBrands(),
    listStorefrontProductCatalog({
      ...filters,
      page: filters.page,
      size: "12",
    }),
  ])

  const activeFilters = [
    filters.q ? `Search: ${filters.q}` : null,
    filters.category ? `Category: ${filters.category}` : null,
    filters.brand ? `Brand: ${filters.brand}` : null,
    filters.minPrice ? `Min: ${filters.minPrice}` : null,
    filters.maxPrice ? `Max: ${filters.maxPrice}` : null,
    filters.inStock ? "In stock" : null,
  ].filter(Boolean)
  const currentPage = productPage.page
  const totalPages = productPage.totalPages
  const hasPrevious = currentPage > 0
  const hasNext = currentPage + 1 < totalPages

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <main>
        <section className="border-b bg-muted/30">
          <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link href="/">Home</Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Products</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </section>

        <section className="border-b">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8">
            <div className="max-w-2xl space-y-2">
              <Badge variant="secondary">Catalog</Badge>
              <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                Explore products
              </h1>
              <p className="text-sm leading-6 text-muted-foreground sm:text-base">
                Browse active products with focused filters for category, brand,
                availability, price, and search.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
              <Badge variant="outline">{productPage.totalItems} products</Badge>
              <Badge variant="outline">{sortLabels[filters.sort] ?? "Newest"}</Badge>
            </div>
          </div>
        </section>

        <section className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[280px_1fr] lg:px-8">
          <aside className="hidden lg:block">
            <Card className="sticky top-24 rounded-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <SlidersHorizontal className="size-4" />
                  Filters
                </CardTitle>
                <CardDescription>Narrow the catalog quickly.</CardDescription>
              </CardHeader>
              <CardContent>
                <ProductFilterForm
                  categories={categories}
                  brands={brands}
                  filters={filters}
                  idPrefix="desktop-products"
                />
              </CardContent>
            </Card>
          </aside>

          <div className="space-y-5">
            <div className="flex flex-col gap-3 rounded-lg border bg-card p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium">
                  Showing {productPage.items.length} of {productPage.totalItems}
                </p>
                <p className="text-xs text-muted-foreground">
                  Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
                </p>
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="lg:hidden">
                    <Filter />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="overflow-y-auto">
                  <SheetHeader>
                    <SheetTitle>Filter products</SheetTitle>
                  </SheetHeader>
                  <div className="px-4 pb-4">
                    <ProductFilterForm
                      categories={categories}
                      brands={brands}
                      filters={filters}
                      idPrefix="mobile-products"
                    />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {activeFilters.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {activeFilters.map((filter) => (
                  <Badge key={filter} variant="secondary">
                    {filter}
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/products">
                    <RotateCcw />
                    Reset
                  </Link>
                </Button>
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {productPage.items.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>

            {productPage.items.length === 0 ? (
              <Card className="rounded-lg">
                <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
                  <span className="flex size-12 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                    <PackageSearch className="size-6" />
                  </span>
                  <div className="space-y-1">
                    <h2 className="text-lg font-semibold">No products found</h2>
                    <p className="max-w-md text-sm text-muted-foreground">
                      Try removing a filter or searching for another product,
                      category, brand, or SKU.
                    </p>
                  </div>
                  <Button variant="outline" asChild>
                    <Link href="/products">Clear filters</Link>
                  </Button>
                </CardContent>
              </Card>
            ) : null}

            <Separator />

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                {totalPages > 0
                  ? `Page ${currentPage + 1} of ${totalPages}`
                  : "No pages to show"}
              </p>
              <div className="flex gap-2">
                <Button variant="outline" disabled={!hasPrevious} asChild={hasPrevious}>
                  {hasPrevious ? (
                    <Link href={pageHref(filters, currentPage - 1)}>Previous</Link>
                  ) : (
                    <span>Previous</span>
                  )}
                </Button>
                <Button variant="outline" disabled={!hasNext} asChild={hasNext}>
                  {hasNext ? (
                    <Link href={pageHref(filters, currentPage + 1)}>Next</Link>
                  ) : (
                    <span>Next</span>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <SiteFooter categories={categories} />
    </div>
  )
}

function normalizeFilters(searchParams: Record<string, string | string[] | undefined>) {
  return {
    q: firstValue(searchParams.q),
    category: firstValue(searchParams.category),
    brand: firstValue(searchParams.brand),
    minPrice: numericValue(searchParams.minPrice),
    maxPrice: numericValue(searchParams.maxPrice),
    inStock: firstValue(searchParams.inStock) === "true" ? "true" : "",
    sort: sortLabels[firstValue(searchParams.sort)] ? firstValue(searchParams.sort) : "newest",
    page: String(Math.max(Number(firstValue(searchParams.page)) || 0, 0)),
  }
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] ?? "" : value ?? ""
}

function numericValue(value: string | string[] | undefined) {
  const rawValue = firstValue(value)
  return /^\d+(\.\d{1,2})?$/.test(rawValue) ? rawValue : ""
}

function pageHref(filters: ReturnType<typeof normalizeFilters>, page: number) {
  const params = new URLSearchParams()

  Object.entries({ ...filters, page: String(page) }).forEach(([key, value]) => {
    if (value && !(key === "sort" && value === "newest")) {
      params.set(key, value)
    }
  })

  const query = params.toString()
  return `/products${query ? `?${query}` : ""}`
}
