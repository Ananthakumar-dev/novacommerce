import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { authHeaders, requireAdminToken } from "@/lib/auth"
import { getApiGatewayUrl } from "@/lib/config"

export type AdminShippingMethod = {
  id: number
  name: string
  carrier: string
  baseRate: number
  minOrderValueForFreeShipping: number | null
  estimatedDeliveryDays: number
  active: boolean
  createdAt?: string
  updatedAt?: string
}

export async function listAdminShippingMethods() {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/shipping-methods`, {
    headers: authHeaders(token),
    cache: "no-store",
  })

  if (!response.ok) {
    return []
  }

  return (await response.json()) as AdminShippingMethod[]
}

export async function createAdminShippingMethod(payload: Omit<AdminShippingMethod, "id">) {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/shipping-methods`, {
    method: "POST",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to create shipping method")
  }

  revalidatePath("/admin/shipping")
  return (await response.json()) as AdminShippingMethod
}

export async function updateAdminShippingMethod(id: number, payload: Partial<AdminShippingMethod>) {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/shipping-methods/${id}`, {
    method: "PUT",
    headers: {
      ...authHeaders(token),
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to update shipping method")
  }

  revalidatePath("/admin/shipping")
  return (await response.json()) as AdminShippingMethod
}

export async function deleteAdminShippingMethod(id: number) {
  const token = await requireAdminToken()
  if (!token) redirect("/admin")

  const response = await fetch(`${getApiGatewayUrl()}/api/admin/shipping-methods/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  })

  if (!response.ok) {
    throw new Error("Failed to delete shipping method")
  }

  revalidatePath("/admin/shipping")
  return true
}
