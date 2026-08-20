"use server";

import {
  adjustMerchantStock,
  type StockAdjustmentState,
} from "@/lib/merchant-inventory";

export async function adjustStockAction(
  productId: string,
  _previousState: StockAdjustmentState,
  formData: FormData,
): Promise<StockAdjustmentState> {
  const result = await adjustMerchantStock(productId, formData);

  if (!result.ok) {
    return {
      error: result.message,
    };
  }

  return {
    success: "Stock adjusted successfully.",
  };
}
