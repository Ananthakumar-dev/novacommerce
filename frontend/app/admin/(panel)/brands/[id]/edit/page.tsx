import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { updateBrandAction } from "@/app/admin/(panel)/brands/actions"
import { getAdminBrand } from "@/lib/admin-brands"

import { BrandForm } from "../../brand-form"

export const metadata: Metadata = {
  title: "Edit Brand | NovaCommerce Admin",
  description: "Edit a NovaCommerce product brand.",
}

type EditBrandPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditBrandPage({ params }: EditBrandPageProps) {
  const { id } = await params
  const brand = await getAdminBrand(id)

  if (!brand) {
    notFound()
  }

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <BrandForm action={updateBrandAction.bind(null, id)} brand={brand} />
      </div>
    </main>
  )
}
