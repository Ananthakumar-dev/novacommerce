"use server"

import {
  createAdminBrand,
  deleteAdminBrand,
  updateAdminBrand,
  type BrandFormState,
} from "@/lib/admin-brands"

export async function createBrandAction(
  _previousState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const validationError = validateBrandForm(formData)

  if (validationError) {
    return { error: validationError }
  }

  const result = await createAdminBrand(formData)

  return result.ok ? {} : { error: result.message }
}

export async function updateBrandAction(
  id: string,
  _previousState: BrandFormState,
  formData: FormData
): Promise<BrandFormState> {
  const validationError = validateBrandForm(formData)

  if (validationError) {
    return { error: validationError }
  }

  const result = await updateAdminBrand(id, formData)

  return result.ok ? {} : { error: result.message }
}

export async function deleteBrandAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")

  if (!id) {
    return
  }

  await deleteAdminBrand(id)
}

function validateBrandForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const description = String(formData.get("description") ?? "").trim()

  if (!name) {
    return "Brand name is required."
  }

  if (description.length > 500) {
    return "Description must be 500 characters or less."
  }

  return null
}
