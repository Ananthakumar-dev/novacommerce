import { redirect } from "next/navigation";
import { authHeaders, getApiGatewayUrl, requireAdminToken } from "@/lib/auth";
import { textValue } from "./utils";

export type AdminBrand = {
    id: number
    name: string
    slug: string
    description: string
    active: boolean
    createdAt: string
    updatedAt: string
}

export type BrandFormState = {
    error?: string
}

export async function listAdminBrands() {
    const token = await requireAdminToken();
      if (!token) redirect("/admin");

    const response = await fetch(`${getApiGatewayUrl()}/api/admin/brands`, {
        headers: authHeaders(token),
        cache: "no-store"
    })

    if (!response.ok) {
        return [];
      }
    
      return (await response.json()) as AdminBrand[];
}

export async function getAdminBrand(id: string) {
  const token = await requireAdminToken();
  if (!token) redirect("/admin");
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/brands/${id}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    },
  );

  if (!response.ok) {
    return null;
  }

  return (await response.json()) as AdminBrand;
}

function categoryPayload(formData: FormData) {
  return {
    name: textValue(formData, "name"),
    slug: textValue(formData, "slug"),
    description: textValue(formData, "description"),
    active: formData.get("active") === "on",
  };
}