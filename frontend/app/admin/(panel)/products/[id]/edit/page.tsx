import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { updateProductAction } from "@/app/admin/(panel)/products/actions"
import { getAdminProduct, getProductOptions } from "@/lib/admin-products"

import { ProductForm } from "../../product-form"

export const metadata: Metadata = {
  title: "Edit Product | NovaCommerce Admin",
  description: "Edit a NovaCommerce product.",
}

type EditProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, options] = await Promise.all([
    getAdminProduct(id),
    getProductOptions(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <ProductForm
          action={updateProductAction.bind(null, id)}
          options={options}
          product={product}
        />
      </div>
    </main>
  )
}
