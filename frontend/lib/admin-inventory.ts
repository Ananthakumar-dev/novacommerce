import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authHeaders, getApiGatewayUrl, requireAdminToken } from "@/lib/auth";

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";
export type StockMovementType = "ADD" | "REMOVE" | "SET";

export type InventoryItem = {
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

export type StockMovement = {
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

export async function listAdminInventory() {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/inventory`, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as InventoryItem[];
}

export async function listStockMovements(productId?: number) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");

  const params = productId ? `?productId=${productId}` : "";
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/inventory/movements${params}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as StockMovement[];
}

export async function adjustAdminStock(productId: string, formData: FormData) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");

  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/inventory/${productId}/adjust`,
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

  revalidatePath("/admin/inventory");

  return {
    ok: true as const,
    message: "Stock updated.",
  };
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function integerValue(formData: FormData, key: string) {
  return Number.parseInt(textValue(formData, key), 10);
}

async function readInventoryError(response: Response) {
  try {
    const data = (await response.json()) as {
      message?: string;
      validationErrors?: Record<string, string>;
    };

    return (
      data.message ??
      Object.values(data.validationErrors ?? {})[0] ??
      "Unable to update stock."
    );
  } catch {
    return "Unable to update stock.";
  }
}
