import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getCustomerToken } from "@/lib/customer-auth";
import { getApiGatewayUrl } from "@/lib/config";

export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

export type MerchantProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  shortDescription: string | null;
  sku: string;
  price: number;
  salePrice: number | null;
  stockQuantity: number;
  lowStockThreshold: number;
  status: ProductStatus;
  category: string;
  brand: string;
  merchantId: number | null;
  imageUrl: string | null;
  featured: boolean;
  popular: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type MerchantProductOptions = {
  categories: string[];
  brands: string[];
  statuses: ProductStatus[];
};

export type MerchantProductPage = {
  items: MerchantProduct[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type ProductFormState = {
  error?: string;
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
    redirect("/login?redirect=/dashboard/products");
  }
  return token;
}

export async function listMerchantProducts({
  page = 0,
  size = 10,
}: {
  page?: number;
  size?: number;
} = {}) {
  const token = await requireMerchantToken();
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });

  const response = await fetch(
    `${getApiGatewayUrl()}/api/merchant/products?${params}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      items: [],
      page,
      size,
      totalItems: 0,
      totalPages: 0,
    } satisfies MerchantProductPage;
  }

  return (await response.json()) as MerchantProductPage;
}

export async function getMerchantProduct(id: string) {
  const token = await requireMerchantToken();
  const response = await fetch(
    `${getApiGatewayUrl()}/api/merchant/products/${id}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as MerchantProduct;
}

export async function getMerchantProductOptions() {
  const token = await requireMerchantToken();
  const response = await fetch(
    `${getApiGatewayUrl()}/api/merchant/product-options`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      categories: [],
      brands: [],
      statuses: ["DRAFT", "ACTIVE", "INACTIVE"],
    } satisfies MerchantProductOptions;
  }

  return (await response.json()) as MerchantProductOptions;
}

export async function uploadMerchantImage(file: FormDataEntryValue | null) {
  if (!(file instanceof File) || file.size === 0) {
    return null;
  }

  const token = await getCustomerToken();
  if (!token) {
    return null;
  }

  const body = new FormData();
  body.append("file", file);

  const response = await fetch(`${getApiGatewayUrl()}/api/merchant/uploads`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(await readProductError(response));
  }

  const data = (await response.json()) as { url: string };
  return data.url;
}

export async function createMerchantProduct(formData: FormData) {
  const token = await requireMerchantToken();
  const payload = await resolveMerchantProductPayload(formData);

  if (!payload.ok) {
    return payload;
  }

  const response = await fetch(`${getApiGatewayUrl()}/api/merchant/products`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload.data),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readProductError(response),
    };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  redirect("/dashboard/products");
}

export async function updateMerchantProduct(id: string, formData: FormData) {
  const token = await requireMerchantToken();
  const payload = await resolveMerchantProductPayload(formData);

  if (!payload.ok) {
    return payload;
  }

  const response = await fetch(
    `${getApiGatewayUrl()}/api/merchant/products/${id}`,
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(payload.data),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readProductError(response),
    };
  }

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
  redirect("/dashboard/products");
}

export async function deleteMerchantProduct(id: string) {
  const token = await requireMerchantToken();
  await fetch(`${getApiGatewayUrl()}/api/merchant/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  });

  revalidatePath("/dashboard/products");
  revalidatePath("/dashboard/inventory");
  revalidatePath("/dashboard");
}

async function resolveMerchantProductPayload(formData: FormData) {
  try {
    const data = await merchantProductPayload(formData);
    return {
      ok: true as const,
      data,
    };
  } catch (error) {
    return {
      ok: false as const,
      message:
        error instanceof Error
          ? error.message
          : "An unexpected error occurred while preparing the product.",
    };
  }
}

async function merchantProductPayload(formData: FormData) {
  const uploadedImageUrl = await uploadMerchantImage(formData.get("imageFile"));

  return {
    name: textValue(formData, "name"),
    slug: textValue(formData, "slug"),
    description: textValue(formData, "description"),
    shortDescription: textValue(formData, "shortDescription"),
    sku: textValue(formData, "sku"),
    price: numberValue(formData, "price"),
    salePrice: optionalNumberValue(formData, "salePrice"),
    stockQuantity: integerValue(formData, "stockQuantity"),
    lowStockThreshold: integerValue(formData, "lowStockThreshold"),
    status: textValue(formData, "status") as ProductStatus,
    category: textValue(formData, "category"),
    brand: textValue(formData, "brand"),
    imageUrl: uploadedImageUrl ?? textValue(formData, "imageUrl"),
    featured: false,
    popular: false,
    metaTitle: textValue(formData, "metaTitle"),
    metaDescription: textValue(formData, "metaDescription"),
  };
}

function textValue(formData: FormData, key: string) {
  const value = formData.get(key);
  if (typeof value !== "string") {
    return "";
  }
  return value.trim();
}

function numberValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

function optionalNumberValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  if (!value) {
    return null;
  }
  const parsed = Number.parseFloat(value);
  if (Number.isNaN(parsed)) {
    return null;
  }
  return parsed;
}

function integerValue(formData: FormData, key: string) {
  const value = textValue(formData, key);
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return parsed;
}

async function readProductError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? "An unexpected server error occurred.";
  } catch {
    return "An unexpected server error occurred.";
  }
}
