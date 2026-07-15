import type { Metadata } from "next"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Package, Plus } from "lucide-react"

import { listAdminProducts, type ProductStatus } from "@/lib/admin-products"
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

import { ProductActions } from "./product-actions"
import { PopularToggle } from "./popular-toggle"

export const metadata: Metadata = {
  title: "Products | NovaCommerce Admin",
  description: "Manage NovaCommerce products.",
}

type ProductsPageProps = {
  searchParams: Promise<{
    page?: string
  }>
}

const PAGE_SIZE = 10

export default async function ProductsPage({ searchParams }: ProductsPageProps) {
  const { page } = await searchParams
  const currentPage = Math.max(Number(page ?? "1") || 1, 1)
  const productsPage = await listAdminProducts({
    page: currentPage - 1,
    size: PAGE_SIZE,
  })
  const products = productsPage.items
  const totalPages = productsPage.totalPages

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Products</CardTitle>
            <CardDescription>
              Manage catalog items, pricing, stock, and visibility.
            </CardDescription>
            <CardAction>
              <Button asChild>
                <Link href="/admin/products/add">
                  <Plus data-icon="inline-start" aria-hidden="true" />
                  Add product
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {products.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Product</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Brand</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Stock</TableHead>
                    <TableHead>Popular</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">
                        <div className="min-w-44">
                          <div>{product.name}</div>
                          <div className="mt-1 text-xs text-muted-foreground">
                            {product.slug}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{product.sku}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell>{product.brand}</TableCell>
                      <TableCell>{formatCurrency(product.salePrice ?? product.price)}</TableCell>
                      <TableCell>{product.stockQuantity}</TableCell>
                      <TableCell>
                        <PopularToggle
                          id={product.id}
                          popular={product.popular}
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={statusVariant(product.status)}>
                          {statusLabel(product.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <ProductActions id={product.id} name={product.name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Package className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <h2 className="font-medium">No products found</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the first product to start building the catalog.
                  </p>
                </div>
              </div>
            )}
            {totalPages > 1 ? (
              <div className="mt-5 flex flex-col gap-3 border-t pt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                  Page {productsPage.page + 1} of {totalPages} -{" "}
                  {productsPage.totalItems} products
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={currentPage <= 1}
                  >
                    <Link
                      href={`/admin/products?page=${Math.max(currentPage - 1, 1)}`}
                      aria-disabled={currentPage <= 1}
                    >
                      <ChevronLeft data-icon="inline-start" aria-hidden="true" />
                      Previous
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    disabled={currentPage >= totalPages}
                  >
                    <Link
                      href={`/admin/products?page=${Math.min(currentPage + 1, totalPages)}`}
                      aria-disabled={currentPage >= totalPages}
                    >
                      Next
                      <ChevronRight data-icon="inline-end" aria-hidden="true" />
                    </Link>
                  </Button>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(value)
}

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}

function statusVariant(status: ProductStatus) {
  if (status === "ACTIVE") {
    return "secondary"
  }

  if (status === "INACTIVE") {
    return "outline"
  }

  return "default"
}
