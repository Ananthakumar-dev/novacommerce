"use server"

import {
  createAdminProduct,
  deleteAdminProduct,
  updateAdminProduct,
  type ProductFormState,
} from "@/lib/admin-products"

export async function createProductAction(
  _previousState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const validationError = validateProductForm(formData)

  if (validationError) {
    return { error: validationError }
  }

  const result = await createAdminProduct(formData)

  return result.ok ? {} : { error: result.message }
}

export async function updateProductAction(
  id: string,
  _previousState: ProductFormState,
  formData: FormData
): Promise<ProductFormState> {
  const validationError = validateProductForm(formData)

  if (validationError) {
    return { error: validationError }
  }

  const result = await updateAdminProduct(id, formData)

  return result.ok ? {} : { error: result.message }
}

export async function deleteProductAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")

  if (id) {
    await deleteAdminProduct(id)
  }
}

function validateProductForm(formData: FormData) {
  const name = String(formData.get("name") ?? "").trim()
  const sku = String(formData.get("sku") ?? "").trim()
  const price = String(formData.get("price") ?? "").trim()
  const stockQuantity = String(formData.get("stockQuantity") ?? "").trim()
  const lowStockThreshold = String(formData.get("lowStockThreshold") ?? "").trim()
  const category = String(formData.get("category") ?? "").trim()
  const brand = String(formData.get("brand") ?? "").trim()
  const status = String(formData.get("status") ?? "").trim()

  if (!name || !sku || !price || !stockQuantity || !lowStockThreshold || !category || !brand || !status) {
    return "Name, SKU, price, stock, low stock threshold, status, category, and brand are required."
  }

  if (Number(price) < 0) {
    return "Price must be zero or greater."
  }

  if (Number(stockQuantity) < 0 || Number(lowStockThreshold) < 0) {
    return "Stock values must be zero or greater."
  }

  return null
}
