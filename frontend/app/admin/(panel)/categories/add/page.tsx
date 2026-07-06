import type { Metadata } from "next"

import { createCategoryAction } from "@/app/admin/(panel)/categories/actions"

import { CategoryForm } from "../category-form"

export const metadata: Metadata = {
  title: "Add Category | NovaCommerce Admin",
  description: "Add a NovaCommerce product category.",
}

export default function AddCategoryPage() {
  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <CategoryForm action={createCategoryAction} />
      </div>
    </main>
  )
}
