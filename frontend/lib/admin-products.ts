import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authHeaders, getApiGatewayUrl, requireAdminToken } from "@/lib/auth";

export type ProductStatus = "DRAFT" | "ACTIVE" | "INACTIVE";

export type AdminProduct = {
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
  imageUrl: string | null;
  featured: boolean;
  popular: boolean;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProductOptions = {
  categories: string[];
  brands: string[];
  statuses: ProductStatus[];
};

export type ProductPage = {
  items: AdminProduct[];
  page: number;
  size: number;
  totalItems: number;
  totalPages: number;
};

export type ProductFormState = {
  error?: string;
};

export async function listAdminProducts({
  page = 0,
  size = 10,
}: {
  page?: number;
  size?: number;
} = {}) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const params = new URLSearchParams({
    page: String(page),
    size: String(size),
  });
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/products?${params}`,
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
    } satisfies ProductPage;
  }

  return (await response.json()) as ProductPage;
}

export async function getAdminProduct(id: string) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/products/${id}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AdminProduct;
}

export async function getProductOptions() {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/product-options`,
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
    } satisfies ProductOptions;
  }

  return (await response.json()) as ProductOptions;
}

export async function createAdminProduct(formData: FormData) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(`${getApiGatewayUrl()}/api/admin/products`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(productPayload(formData)),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readProductError(response),
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function updateAdminProduct(id: string, formData: FormData) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/products/${id}`,
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(productPayload(formData)),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readProductError(response),
    };
  }

  revalidatePath("/admin/products");
  redirect("/admin/products");
}

export async function deleteAdminProduct(id: string) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  await fetch(`${getApiGatewayUrl()}/api/admin/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  });

  revalidatePath("/admin/products");
}

export async function updateAdminProductPopular(id: string, popular: boolean) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/products/${id}/popular`,
    {
      method: "PATCH",
      headers: authHeaders(token),
      body: JSON.stringify({ popular }),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readProductError(response),
    };
  }

  revalidatePath("/admin/products");

  return {
    ok: true as const,
  };
}

function productPayload(formData: FormData) {
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
    imageUrl: textValue(formData, "imageUrl"),
    featured: formData.get("featured") === "on",
    popular: formData.get("popular") === "on",
    metaTitle: textValue(formData, "metaTitle"),
    metaDescription: textValue(formData, "metaDescription"),
  };
}

function textValue(formData: FormData, key: string) {
  return String(formData.get(key) ?? "").trim();
}

function numberValue(formData: FormData, key: string) {
  return Number(textValue(formData, key));
}

function optionalNumberValue(formData: FormData, key: string) {
  const value = textValue(formData, key);

  return value ? Number(value) : null;
}

function integerValue(formData: FormData, key: string) {
  return Number.parseInt(textValue(formData, key), 10);
}

async function readProductError(response: Response) {
  try {
    const data = (await response.json()) as {
      message?: string;
      validationErrors?: Record<string, string>;
    };

    return (
      data.message ??
      Object.values(data.validationErrors ?? {})[0] ??
      "Unable to save product."
    );
  } catch {
    return "Unable to save product.";
  }
}
