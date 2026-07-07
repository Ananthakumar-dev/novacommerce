import type { Metadata } from "next"
import Link from "next/link"
import { Tag, Plus } from "lucide-react"

import { listAdminCategories } from "@/lib/admin-categories"
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

import { CategoryActions } from "./category-actions"

export const metadata: Metadata = {
  title: "Brands | NovaCommerce Admin",
  description: "Manage NovaCommerce product brands.",
}

export default async function BrandsPage() {
  const brands = await listAdminCategories()

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <Card>
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>
              Manage product grouping and category availability.
            </CardDescription>
            <CardAction>
              <Button asChild>
                <Link href="/admin/categories/add">
                  <Plus data-icon="inline-start" aria-hidden="true" />
                  Add category
                </Link>
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            {categories.length ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Category</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">
                        <div className="min-w-44">
                          <div>{category.name}</div>
                          {category.description ? (
                            <div className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                              {category.description}
                            </div>
                          ) : null}
                        </div>
                      </TableCell>
                      <TableCell>{category.slug}</TableCell>
                      <TableCell>
                        <Badge variant={category.active ? "secondary" : "outline"}>
                          {category.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <CategoryActions id={category.id} name={category.name} />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-8 text-center">
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted">
                  <Tag className="size-4 text-muted-foreground" />
                </span>
                <div>
                  <h2 className="font-medium">No categories found</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Add the first category to organize products.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
