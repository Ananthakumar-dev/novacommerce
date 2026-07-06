import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { updateCategoryAction } from "@/app/admin/(panel)/categories/actions"
import { getAdminCategory } from "@/lib/admin-categories"

import { CategoryForm } from "../../category-form"

export const metadata: Metadata = {
  title: "Edit Category | NovaCommerce Admin",
  description: "Edit a NovaCommerce product category.",
}

type EditCategoryPageProps = {
  params: Promise<{
    id: string
  }>
}

export default async function EditCategoryPage({ params }: EditCategoryPageProps) {
  const { id } = await params
  const category = await getAdminCategory(id)

  if (!category) {
    notFound()
  }

  return (
    <main className="flex-1 bg-background text-foreground">
      <div className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">
        <CategoryForm
          action={updateCategoryAction.bind(null, id)}
          category={category}
        />
      </div>
    </main>
  )
}
