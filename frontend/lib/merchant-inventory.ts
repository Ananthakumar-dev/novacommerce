import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCustomerToken } from "@/lib/customer-auth";
import { getApiGatewayUrl } from "@/lib/config";

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type StockMovementType = "ADD" | "REMOVE" | "SET";

export type MerchantInventoryItem = {
  productId: number;
  productName: string;
  sku: string;
  category: string;
  brand: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  stockStatus: StockStatus;
};

export type MerchantStockMovement = {
  id: number;
  productId: number;
  productName: string;
  sku: string;
  type: StockMovementType;
  quantity: number;
  stockBefore: number;
  stockAfter: number;
  reason: string | null;
  reference: string | null;
  createdAt: string;
};

export type StockAdjustmentState = {
  error?: string;
  success?: string;
};

function authHeaders(token: string) {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

export async function requireMerchantToken() {
  const token = await getCustomerToken();
  if (!token) {
    redirect("/login?redirect=/dashboard/inventory");
  }
  return token;
}

export async function listMerchantInventory() {
  const token = await requireMerchantToken();

  const response = await fetch(
    `${getApiGatewayUrl()}/api/merchant/inventory`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as MerchantInventoryItem[];
}

export async function listMerchantStockMovements(productId?: number) {
  const token = await requireMerchantToken();

  const params = productId ? `?productId=${productId}` : "";
  const response = await fetch(
    `${getApiGatewayUrl()}/api/merchant/inventory/movements${params}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as MerchantStockMovement[];
}

export async function adjustMerchantStock(productId: string, formData: FormData) {
  const token = await requireMerchantToken();

  const response = await fetch(
    `${getApiGatewayUrl()}/api/merchant/inventory/${productId}/adjust`,
    {
      method: "POST",
      headers: authHeaders(token),
      body: JSON.stringify({
        type: textValue(formData, "type") as StockMovementType,
        quantity: integerValue(formData, "quantity"),
        reason: textValue(formData, "reason"),
        reference: textValue(formData, "reference"),
      }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readInventoryError(response),
    };
  }

  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard");

  return {
    ok: true as const,
  };
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function integerValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

async function readInventoryError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? "Unable to adjust inventory.";
  } catch {
    return "Unable to adjust inventory.";
  }
}
