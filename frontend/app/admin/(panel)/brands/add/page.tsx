import type { Metadata } from "next"

import { createBrandAction } from "@/app/admin/(panel)/brands/actions"

import { BrandForm } from "../brand-form"

export const metadata: Metadata = {
  title: "Add Brand | NovaCommerce Admin",
  description: "Add a NovaCommerce product brand.",
}

export default function AddBrandPage() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <BrandForm action={createBrandAction} />
      </div>
    </main>
  )
}
