import type { Metadata } from "next"

import { createProductAction } from "@/app/dashboard/products/actions"
import { getMerchantProductOptions } from "@/lib/merchant-products"
import { ProductForm } from "../product-form"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { MerchantNav } from "@/components/merchant/merchant-nav"

export const metadata: Metadata = {
  title: "Add Product | Merchant Dashboard - NovaCommerce",
  description: "Create a new product listing in your merchant catalog.",
}

export default async function AddMerchantProductPage() {
  const options = await getMerchantProductOptions()

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <MerchantNav />

        <div className="flex justify-center">
          <ProductForm
            action={createProductAction}
            options={options}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
