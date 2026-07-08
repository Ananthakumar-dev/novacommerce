"use server";

import {
  adjustAdminStock,
  type StockAdjustmentState,
  type StockMovementType,
} from "@/lib/admin-inventory";

export async function adjustStockAction(
  productId: string,
  _previousState: StockAdjustmentState,
  formData: FormData,
): Promise<StockAdjustmentState> {
  const validationError = validateStockAdjustmentForm(formData);

  if (validationError) {
    return { error: validationError };
  }

  const result = await adjustAdminStock(productId, formData);

  return result.ok ? { success: result.message } : { error: result.message };
}

function validateStockAdjustmentForm(formData: FormData) {
  const type = String(formData.get("type") ?? "").trim() as StockMovementType;
  const quantity = String(formData.get("quantity") ?? "").trim();
  const reason = String(formData.get("reason") ?? "").trim();

  if (!["ADD", "REMOVE", "SET"].includes(type)) {
    return "Choose a valid adjustment type.";
  }

  if (!quantity || Number.isNaN(Number(quantity)) || Number(quantity) < 0) {
    return "Quantity must be zero or greater.";
  }

  if (reason.length > 500) {
    return "Reason must be 500 characters or less.";
  }

  return null;
}
