"use server"

import {
  createAdminCategory,
  deleteAdminCategory,
  updateAdminCategory,
  type CategoryFormState,
} from "@/lib/admin-categories"

export async function createCategoryAction(
  _previousState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const validationError = validateCategoryForm(formData)

  if (validationError) {
    return { error: validationError }
  }

  const result = await createAdminCategory(formData)

  return result.ok ? {} : { error: result.message }
}

export async function updateCategoryAction(
  id: string,
  _previousState: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const validationError = validateCategoryForm(formData)

  if (validationError) {
    return { error: validationError }
  }

  const result = await updateAdminCategory(id, formData)

  return result.ok ? {} : { error: result.message }
}

export async function deleteCategoryAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")

  if (!id) {
    return
  }

  await deleteAdminCategory(id)
}

function validateCategoryForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!name) {
    return "Category name is required."
  }

  if (description.length > 500) {
    return "Description must be 500 characters or less."
  }

  return null
}
