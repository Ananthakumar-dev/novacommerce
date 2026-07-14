import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { authHeaders, getApiGatewayUrl, requireAdminToken } from "@/lib/auth";
import { uploadAdminImage } from "@/lib/admin-media";
import { textValue } from "./utils";

export type AdminCategory = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  image: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
};

export type CategoryFormState = {
  error?: string;
};

export async function listAdminCategories() {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/categories`, {
    headers: authHeaders(token),
    cache: "no-store",
  });

  if (!response.ok) {
    return [];
  }

  return (await response.json()) as AdminCategory[];
}

export async function getAdminCategory(id: string) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/categories/${id}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AdminCategory;
}

export async function createAdminCategory(formData: FormData) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const payload = await resolveCategoryPayload(formData);

  if (!payload.ok) {
    return payload;
  }

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/categories`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload.data),
    cache: "no-store",
  });

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readCategoryError(response),
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/add");
  redirect("/admin/categories");
}

export async function updateAdminCategory(id: string, formData: FormData) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const payload = await resolveCategoryPayload(formData);

  if (!payload.ok) {
    return payload;
  }

  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/categories/${id}`,
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
      message: await readCategoryError(response),
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/add");
  redirect("/admin/categories");
}

export async function deleteAdminCategory(id: string) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/categories/${id}`,
    {
      method: "DELETE",
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readCategoryError(response),
    };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/admin/products/add");

  return { ok: true as const };
}

async function categoryPayload(formData: FormData) {
  const uploadedImageUrl = await uploadAdminImage(formData.get("imageFile"));

  return {
    name: textValue(formData, "name"),
    slug: textValue(formData, "slug"),
    description: textValue(formData, "description"),
    icon: textValue(formData, "icon"),
    image: uploadedImageUrl ?? textValue(formData, "image"),
    active: formData.get("active") === "on",
  };
}

async function resolveCategoryPayload(formData: FormData) {
  try {
    return {
      ok: true as const,
      data: await categoryPayload(formData),
    };
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Unable to upload image.",
    };
  }
}

async function readCategoryError(response: Response) {
  try {
    const data = (await response.json()) as {
      message?: string;
      validationErrors?: Record<string, string>;
    };

    return (
      data.message ??
      Object.values(data.validationErrors ?? {})[0] ??
      "Unable to save category."
    );
  } catch {
    return "Unable to save category.";
  }
}
