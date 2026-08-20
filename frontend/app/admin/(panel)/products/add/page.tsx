import type { Metadata } from "next"

import { createProductAction } from "@/app/admin/(panel)/products/actions"
import { getProductOptions } from "@/lib/admin-products"
import { listAdminMerchants } from "@/lib/admin-users"

import { ProductForm } from "../product-form"

export const metadata: Metadata = {
  title: "Add Product | NovaCommerce Admin.",
  description: "Add a NovaCommerce product.",
}

export default async function AddProductPage() {
  const [options, merchants] = await Promise.all([
    getProductOptions(),
    listAdminMerchants(),
  ])

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <ProductForm
          action={createProductAction}
          options={options}
          merchants={merchants}
        />
      </div>
    </main>
  )
}
