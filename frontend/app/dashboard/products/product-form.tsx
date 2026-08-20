"use client"

import Link from "next/link"
import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { AlertCircle, ArrowLeft, Save, Upload, Image as ImageIcon } from "lucide-react"

import type {
  MerchantProduct,
  MerchantProductOptions,
  ProductFormState,
} from "@/lib/merchant-products"
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
import { Textarea } from "@/components/ui/textarea"
import { cn, mediaUrl } from "@/lib/utils"

type ProductFormProps = {
  action: (
    previousState: ProductFormState,
    formData: FormData
  ) => Promise<ProductFormState>
  options: MerchantProductOptions
  product?: MerchantProduct
}

const initialState: ProductFormState = {}

export function ProductForm({
  action,
  options,
  product,
}: ProductFormProps) {
  const [state, formAction] = useActionState(action, initialState)
  const isEditing = Boolean(product)
  const hasCategories = options.categories.length > 0

  return (
    <Card className="max-w-4xl border-border/60 shadow-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold">{isEditing ? "Edit product" : "Add product"}</CardTitle>
        <CardDescription>
          {isEditing
            ? "Update your product details, pricing, stock levels, and storefront visibility."
            : "Create a new product listing for your storefront catalog."}
        </CardDescription>
      </CardHeader>
      <form action={formAction}>
        <CardContent className="space-y-6">
          {state.error ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>{state.error}</span>
            </div>
          ) : null}

          {!hasCategories ? (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-800 dark:text-amber-300"
            >
              <AlertCircle
                className="mt-0.5 size-4 shrink-0"
                aria-hidden="true"
              />
              <span>An active category is required before listing products.</span>
            </div>
          ) : null}

          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Product name" htmlFor="name" required>
              <Input
                id="name"
                name="name"
                defaultValue={product?.name}
                placeholder="e.g. Wireless Noise-Cancelling Headphones"
                required
              />
            </Field>

            <Field
              label="Slug (optional URL path)"
              htmlFor="slug"
              hint="Leave blank to generate automatically from the name."
            >
              <Input
                id="slug"
                name="slug"
                defaultValue={product?.slug}
                placeholder="e.g. wireless-headphones"
              />
            </Field>

            <Field label="Category" htmlFor="category" required>
              <Select
                name="category"
                defaultValue={product?.category ?? options.categories[0] ?? ""}
                required
              >
                <SelectTrigger id="category" className="w-full">
                  <SelectValue placeholder="Select a category" />
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

            <Field label="Brand" htmlFor="brand" required>
              <Select
                name="brand"
                defaultValue={product?.brand ?? options.brands[0] ?? ""}
                required
              >
                <SelectTrigger id="brand" className="w-full">
                  <SelectValue placeholder="Select a brand" />
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

            <Field label="SKU (Stock Keeping Unit)" htmlFor="sku" required>
              <Input
                id="sku"
                name="sku"
                defaultValue={product?.sku}
                placeholder="e.g. TECH-WH-001"
                required
              />
            </Field>

            <Field label="Status" htmlFor="status" required>
              <Select
                name="status"
                defaultValue={product?.status ?? "ACTIVE"}
                required
              >
                <SelectTrigger id="status" className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ACTIVE">ACTIVE (Published)</SelectItem>
                  <SelectItem value="DRAFT">DRAFT (Hidden)</SelectItem>
                  <SelectItem value="INACTIVE">INACTIVE (Disabled)</SelectItem>
                </SelectContent>
              </Select>
            </Field>

            <Field label="Regular Price ($)" htmlFor="price" required>
              <Input
                id="price"
                name="price"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.price}
                placeholder="89.99"
                required
              />
            </Field>

            <Field
              label="Sale Price ($)"
              htmlFor="salePrice"
              hint="Discounted promotional price if active."
            >
              <Input
                id="salePrice"
                name="salePrice"
                type="number"
                min="0"
                step="0.01"
                defaultValue={product?.salePrice ?? ""}
                placeholder="69.99"
              />
            </Field>

            <Field label="Stock quantity" htmlFor="stockQuantity" required>
              <Input
                id="stockQuantity"
                name="stockQuantity"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.stockQuantity ?? 10}
                required
              />
            </Field>

            <Field
              label="Low stock threshold"
              htmlFor="lowStockThreshold"
              hint="Receive low stock alerts when quantity reaches this level."
            >
              <Input
                id="lowStockThreshold"
                name="lowStockThreshold"
                type="number"
                min="0"
                step="1"
                defaultValue={product?.lowStockThreshold ?? 5}
              />
            </Field>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Media & Images</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field
                label="Product Image Upload"
                htmlFor="imageFile"
                hint="Upload an image directly (JPG, PNG, WebP)."
              >
                <Input
                  id="imageFile"
                  name="imageFile"
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="cursor-pointer file:cursor-pointer"
                />
              </Field>

              <Field
                label="Or Image URL"
                htmlFor="imageUrl"
                hint="Alternatively paste an external image URL."
              >
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  defaultValue={product?.imageUrl ?? ""}
                  placeholder="https://images.unsplash.com/..."
                />
              </Field>
            </div>

            {product?.imageUrl ? (
              <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-xl border border-border/40 w-fit">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={mediaUrl(product.imageUrl)}
                  alt={product.name}
                  className="size-14 rounded-lg object-cover border border-border/50 bg-background"
                />
                <div className="text-xs text-muted-foreground">
                  <p className="font-medium text-foreground">Current Image</p>
                  <p className="truncate max-w-xs">{product.imageUrl}</p>
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-4 pt-2 border-t border-border/50">
            <h3 className="text-sm font-semibold text-foreground">Descriptions</h3>
            <Field
              label="Short Description"
              htmlFor="shortDescription"
              hint="Brief summary shown on product cards and lists."
            >
              <Input
                id="shortDescription"
                name="shortDescription"
                defaultValue={product?.shortDescription ?? ""}
                placeholder="High-fidelity audio with active noise cancelling..."
              />
            </Field>

            <Field label="Full Description" htmlFor="description">
              <Textarea
                id="description"
                name="description"
                defaultValue={product?.description ?? ""}
                placeholder="Detailed specifications, features, materials, and care instructions..."
                rows={4}
              />
            </Field>
          </div>

          <div className="space-y-4 pt-2 border-t border-border/50">
            <h3 className="text-sm font-semibold text-foreground">SEO Metadata (Optional)</h3>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Meta Title" htmlFor="metaTitle">
                <Input
                  id="metaTitle"
                  name="metaTitle"
                  defaultValue={product?.metaTitle ?? ""}
                  placeholder="e.g. Wireless Headphones | NovaCommerce"
                />
              </Field>

              <Field label="Meta Description" htmlFor="metaDescription">
                <Input
                  id="metaDescription"
                  name="metaDescription"
                  defaultValue={product?.metaDescription ?? ""}
                  placeholder="e.g. Shop the latest wireless headphones with crystal-clear audio."
                />
              </Field>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between border-t border-border/60 p-6 bg-muted/20">
          <Button variant="outline" asChild>
            <Link href="/dashboard/products">
              <ArrowLeft className="size-4" />
              <span>Back to products</span>
            </Link>
          </Button>
          <SubmitButton isEditing={isEditing} />
        </CardFooter>
      </form>
    </Card>
  )
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending} className="bg-sky-600 hover:bg-sky-700 text-white min-w-32 shadow-xs">
      <Save className="size-4" />
      <span>{pending ? "Saving..." : isEditing ? "Update Product" : "Create Product"}</span>
    </Button>
  )
}

type FieldProps = {
  label: string
  htmlFor: string
  hint?: string
  required?: boolean
  children: React.ReactNode
}

function Field({ label, htmlFor, hint, required, children }: FieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={htmlFor} className="text-xs font-semibold text-foreground flex items-center gap-1">
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {hint ? <p className="text-[11px] text-muted-foreground">{hint}</p> : null}
    </div>
  )
}
