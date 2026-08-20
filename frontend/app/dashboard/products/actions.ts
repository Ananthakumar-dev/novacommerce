"use server";

import {
  createMerchantProduct,
  deleteMerchantProduct,
  updateMerchantProduct,
  type ProductFormState,
} from "@/lib/merchant-products";

export async function createProductAction(
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const result = await createMerchantProduct(formData);

  if (result && !result.ok) {
    return {
      error: result.message,
    };
  }

  return {};
}

export async function updateProductAction(
  id: string,
  _previousState: ProductFormState,
  formData: FormData,
): Promise<ProductFormState> {
  const result = await updateMerchantProduct(id, formData);

  if (result && !result.ok) {
    return {
      error: result.message,
    };
  }

  return {};
}

export async function deleteProductAction(id: string) {
  await deleteMerchantProduct(id);
}
