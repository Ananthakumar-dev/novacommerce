import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { updateProductAction } from "@/app/dashboard/products/actions"
import { getMerchantProduct, getMerchantProductOptions } from "@/lib/merchant-products"
import { ProductForm } from "../../product-form"
import { SiteHeader } from "@/components/site/site-header"
import { SiteFooter } from "@/components/site/site-footer"
import { MerchantNav } from "@/components/merchant/merchant-nav"

export const metadata: Metadata = {
  title: "Edit Product | Merchant Dashboard - NovaCommerce",
  description: "Update product details in your merchant catalog.",
}

type EditProductPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditMerchantProductPage({ params }: EditProductPageProps) {
  const { id } = await params
  const [product, options] = await Promise.all([
    getMerchantProduct(id),
    getMerchantProductOptions(),
  ])

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <SiteHeader />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-8 space-y-6">
        <MerchantNav />

        <div className="flex justify-center">
          <ProductForm
            action={updateProductAction.bind(null, id)}
            options={options}
            product={product}
          />
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}
