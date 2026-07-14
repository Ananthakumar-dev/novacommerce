import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { authHeaders, getApiGatewayUrl, requireAdminToken } from "@/lib/auth"
import { uploadAdminImage } from "@/lib/admin-media"
import { textValue } from "./utils"

export type AdminBrand = {
  id: number
  name: string
  slug: string
  description: string | null
  image: string | null
  active: boolean
  createdAt: string
  updatedAt: string
}

export type BrandFormState = {
  error?: string
}

export async function listAdminBrands() {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/brands`, {
    headers: authHeaders(token),
    cache: "no-store",
  })

  if (!response.ok) {
    return []
  }

  return (await response.json()) as AdminBrand[]
}

export async function getAdminBrand(id: string) {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")
  const response = await fetch(
    `${getApiGatewayUrl()}/api/admin/brands/${id}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    }
  )

  if (!response.ok) {
    return null
  }

  return (await response.json()) as AdminBrand
}

export async function createAdminBrand(formData: FormData) {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")
  const payload = await resolveBrandPayload(formData)

  if (!payload.ok) {
    return payload
  }

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/brands`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(payload.data),
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readBrandError(response),
    }
  }

  revalidatePath("/admin/brands")
  revalidatePath("/admin/products/add")
  redirect("/admin/brands")
}

export async function updateAdminBrand(id: string, formData: FormData) {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")
  const payload = await resolveBrandPayload(formData)

  if (!payload.ok) {
    return payload
  }

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/brands/${id}`, {
    method: "PUT",
    headers: authHeaders(token),
    body: JSON.stringify(payload.data),
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readBrandError(response),
    }
  }

  revalidatePath("/admin/brands")
  revalidatePath("/admin/products/add")
  redirect("/admin/brands")
}

export async function deleteAdminBrand(id: string) {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")
  const response = await fetch(`${getApiGatewayUrl()}/api/admin/brands/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readBrandError(response),
    }
  }

  revalidatePath("/admin/brands")
  revalidatePath("/admin/products/add")

  return { ok: true as const }
}

async function brandPayload(formData: FormData) {
  const uploadedImageUrl = await uploadAdminImage(formData.get("imageFile"))

  return {
    name: textValue(formData, "name"),
    slug: textValue(formData, "slug"),
    description: textValue(formData, "description"),
    image: uploadedImageUrl ?? textValue(formData, "image"),
    active: formData.get("active") === "on",
  }
}

async function resolveBrandPayload(formData: FormData) {
  try {
    return {
      ok: true as const,
      data: await brandPayload(formData),
    }
  } catch (error) {
    return {
      ok: false as const,
      message: error instanceof Error ? error.message : "Unable to upload image.",
    }
  }
}

async function readBrandError(response: Response) {
  try {
    const data = (await response.json()) as {
      message?: string
      validationErrors?: Record<string, string>
    }

    return (
      data.message ??
      Object.values(data.validationErrors ?? {})[0] ??
      "Unable to save brand."
    )
  } catch {
    return "Unable to save brand."
  }
}
