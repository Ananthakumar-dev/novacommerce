"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, ArrowLeft, Save } from "lucide-react"

import type {
  AdminProduct,
  ProductFormState,
  ProductOptions,
} from "@/lib/admin-products"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

type ProductFormProps = {
  action: (
    previousState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>
  options: ProductOptions
  product?: AdminProduct
}

const initialState: ProductFormState = {}

export function ProductForm({ action, options, product }: ProductFormProps) {
  const [state, formAction] = useActionState(action, initialState)
  const isEditing = Boolean(product)

  return (
    <Card className="max-w-4xl">
      <CardHeader>
        <CardTitle>{isEditing ? "Edit product" : "Add product"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update catalog details, pricing, and visibility."
            : "Create a product for the NovaCommerce catalog."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state.error ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>{state.error}</span>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Product name" htmlFor="name">
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                placeholder="Wireless headphones"
                required
              />
            </Field>
            <Field label="Slug" htmlFor="slug">
              <Input
                id="slug"
                name="slug"
                defaultValue={product?.slug}
                placeholder="Auto-generated if blank"
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="SKU" htmlFor="sku">
              <Input
                id="sku"
                name="sku"
                defaultValue={product?.sku}
                placeholder="SKU-1001"
                required
              />
            </Field>
            <Field label="Category" htmlFor="category">
              <Select name="category" defaultValue={product?.category ?? options.categories[0]}>
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {options.categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Brand" htmlFor="brand">
              <Select name="brand" defaultValue={product?.brand ?? options.brands[0]}>
                <SelectTrigger id="brand" className="w-full">
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {options.brands.map((brand) => (
                    <SelectItem key={brand} value={brand}>
                      {brand}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-4">
            <Field label="Price" htmlFor="price">
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price}
                required
              />
            </Field>
            <Field label="Sale price" htmlFor="salePrice">
              <Input
                id="salePrice"
                name="salePrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.salePrice ?? ""}
              />
            </Field>
            <Field label="Stock" htmlFor="stockQuantity">
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.stockQuantity ?? 0}
                required
              />
            </Field>
            <Field label="Low stock" htmlFor="lowStockThreshold">
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.lowStockThreshold ?? 0}
                required
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-[1fr_220px]">
            <Field label="Image URL" htmlFor="imageUrl">
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                defaultValue={product?.imageUrl ?? ""}
                placeholder="https://example.com/product.jpg"
              />
            </Field>
            <Field label="Status" htmlFor="status">
              <Select name="status" defaultValue={product?.status ?? "DRAFT"}>
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {options.statuses.map((status) => (
                    <SelectItem key={status} value={status}>
                      {statusLabel(status)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Short description" htmlFor="shortDescription">
              <Textarea
                id="shortDescription"
                name="shortDescription"
                defaultValue={product?.shortDescription ?? ""}
                rows={4}
              />
            </Field>
            <Field label="Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description ?? ""}
                rows={4}
              />
            </Field>
          </div>

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Meta title" htmlFor="metaTitle">
              <Input
                id="metaTitle"
                name="metaTitle"
                defaultValue={product?.metaTitle ?? ""}
              />
            </Field>
            <Field label="Meta description" htmlFor="metaDescription">
              <Textarea
                id="metaDescription"
                name="metaDescription"
                defaultValue={product?.metaDescription ?? ""}
                rows={3}
              />
            </Field>
          </div>

          <label className="flex w-fit items-center gap-2 text-sm font-medium">
            <input
              name="featured"
              type="checkbox"
              defaultChecked={product?.featured ?? false}
              className="size-4 rounded border-input accent-primary"
            />
            Featured product
          </label>
        </CardContent>

        <CardFooter className="justify-between gap-3">
          <Button variant="outline" asChild>
            <Link href="/admin/products">
              <ArrowLeft data-icon="inline-start" aria-hidden="true" />
              Back
            </Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </form>
    </Card>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  )
}

function Textarea({
  className,
  ...props
}: React.ComponentProps<"textarea">) {
  return (
    <textarea
      className={cn(
        "w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 md:text-sm dark:bg-input/30",
        className
      )}
      {...props}
    />
  )
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending}>
      <Save data-icon="inline-start" aria-hidden="true" />
      {pending ? "Saving..." : isEditing ? "Save changes" : "Add product"}
    </Button>
  )
}

function statusLabel(status: string) {
  return status.charAt(0) + status.slice(1).toLowerCase()
}
