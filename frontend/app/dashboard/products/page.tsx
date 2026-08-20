import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Package, Plus, Search } from "lucide-react"

import { listMerchantProducts, type ProductStatus } from "@/lib/merchant-products"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { MerchantNav } from "@/components/merchant/merchant-nav"
import { ProductActions } from "./product-actions"
import { mediaUrl } from "@/lib/utils"

export const metadata: Metadata = {
  title: "My Products | Merchant Dashboard - NovaCommerce",
  description: "Manage your storefront products, prices, and stock.",
}

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

const PAGE_SIZE = 10

export default async function MerchantProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(Number(page ?? "1") || 1, 1)
  const productsPage = await listMerchantProducts({
    page: currentPage - 1,
    size: PAGE_SIZE,
  })

  const products = productsPage.items
  const totalPages = productsPage.totalPages

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <MerchantNav />

        <Card className="border-border/60 shadow-sm">
          <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold">Product Catalog</CardTitle>
              <CardDescription>
                Manage your product listings, pricing, and availability.
              </CardDescription>
            </div>
            <CardAction>
              <Button asChild className="bg-sky-600 hover:bg-sky-700 text-white shadow-xs">
                <Link href="/dashboard/products/add">
                  <Plus className="size-4 mr-1.5" />
                  Add product
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {products.map((product) => {
                      const isLowStock =
                        product.stockQuantity <= product.lowStockThreshold &&
                        product.stockQuantity > 0
                      const isOutOfStock = product.stockQuantity === 0

                      return (
                        <TableRow key={product.id} className="hover:bg-muted/40 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3 min-w-56">
                              {product.imageUrl ? (
                                /* eslint-disable-next-line @next/next/no-img-element */
                                <img
                                  src={mediaUrl(product.imageUrl)}
                                  alt={product.name}
                                  className="size-10 rounded-lg object-cover border border-border/50 bg-background shrink-0"
                                />
                              ) : (
                                <div className="size-10 rounded-lg bg-muted flex items-center justify-center border border-border/40 shrink-0">
                                  <Package className="size-5 text-muted-foreground" />
                                </div>
                              )}
                              <div className="min-w-0">
                                <Link
                                  href={`/dashboard/products/${product.id}/edit`}
                                  className="font-semibold text-foreground hover:text-sky-600 transition-colors truncate block"
                                >
                                  {product.name}
                                </Link>
                                <span className="text-xs text-muted-foreground font-mono">
                                  /{product.slug}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="font-mono text-xs text-muted-foreground">
                            {product.sku}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs font-normal">
                              {product.category}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-sm text-foreground/80">
                            {product.brand}
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {product.salePrice ? (
                                <div className="flex items-baseline gap-1.5">
                                  <span className="font-bold text-emerald-600 dark:text-emerald-400">
                                    ${product.salePrice.toFixed(2)}
                                  </span>
                                  <span className="text-xs text-muted-foreground line-through">
                                    ${product.price.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-semibold text-foreground">
                                  ${product.price.toFixed(2)}
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1.5">
                              <span className="font-medium text-sm">{product.stockQuantity}</span>
                              {isOutOfStock ? (
                                <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                                  Out of Stock
                                </Badge>
                              ) : isLowStock ? (
                                <Badge className="text-[10px] px-1.5 py-0 bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-none font-semibold">
                                  Low Stock
                                </Badge>
                              ) : null}
                            </div>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={product.status} />
                          </TableCell>
                          <TableCell className="text-right">
                            <ProductActions id={product.id} name={product.name} />
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="size-16 rounded-full bg-sky-50 dark:bg-sky-950/40 flex items-center justify-center mb-4 text-sky-600 dark:text-sky-400">
                  <Package className="size-8" />
                </div>
                <h3 className="text-lg font-bold text-foreground">No products found</h3>
                <p className="text-sm text-muted-foreground max-w-sm mt-1">
                  You haven&apos;t added any products to your merchant catalog yet.
                </p>
                <Button asChild className="mt-6 bg-sky-600 hover:bg-sky-700 text-white shadow-xs">
                  <Link href="/dashboard/products/add">
                    <Plus className="size-4 mr-1.5" />
                    Add your first product
                  </Link>
                </Button>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-border/50 pt-4 mt-4">
                <p className="text-xs text-muted-foreground">
                  Page {currentPage} of {totalPages} ({productsPage.totalItems} products total)
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage <= 1}
                    asChild={currentPage > 1}
                  >
                    {currentPage > 1 ? (
                      <Link href={`/dashboard/products?page=${currentPage - 1}`}>
                        <ChevronLeft className="size-4 mr-1" />
                        Previous
                      </Link>
                    ) : (
                      <span>
                        <ChevronLeft className="size-4 mr-1" />
                        Previous
                      </span>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    disabled={currentPage >= totalPages}
                    asChild={currentPage < totalPages}
                  >
                    {currentPage < totalPages ? (
                      <Link href={`/dashboard/products?page=${currentPage + 1}`}>
                        Next
                        <ChevronRight className="size-4 ml-1" />
                      </Link>
                    ) : (
                      <span>
                        Next
                        <ChevronRight className="size-4 ml-1" />
                      </span>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <SiteFooter />
    </div>
  )
}

function StatusBadge({ status }: { status: ProductStatus }) {
  if (status === "ACTIVE") {
    return (
      <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-none font-semibold text-xs">
        Active
      </Badge>
    )
  }

  if (status === "DRAFT") {
    return (
      <Badge variant="outline" className="text-muted-foreground border-border/80 text-xs">
        Draft
      </Badge>
    )
  }

  return (
    <Badge variant="secondary" className="text-xs">
      {status}
    </Badge>
  )
}
