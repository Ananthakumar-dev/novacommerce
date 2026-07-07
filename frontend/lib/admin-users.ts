import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { getApiGatewayUrl, requireAdminToken } from "@/lib/auth"

export type AdminUserRole = "ADMIN" | "CUSTOMER" | "MERCHANT"

export type AdminUser = {
  id: number
  email: string
  fullName: string
  role: AdminUserRole
}

export type UserFormState = {
  error?: string
}

export async function listAdminUsers() {
  const token = await requireAdminToken()
  if(!token) redirect('/admin');

  const response = await fetch(`${getApiGatewayUrl()}/api/auth/admin/users`, {
    headers: authHeaders(token),
    cache: "no-store",
  })

  if (!response.ok) {
    return []
  }

  return (await response.json()) as AdminUser[]
}

export async function getAdminUser(id: string) {
const token = await requireAdminToken()
  if(!token) redirect('/admin');

  const response = await fetch(
    `${getApiGatewayUrl()}/api/auth/admin/users/${id}`,
    {
      headers: authHeaders(token),
      cache: "no-store",
    }
  )

  if (!response.ok) {
    return null
  }

  return (await response.json()) as AdminUser
}

export async function createAdminUser(formData: FormData) {
  const token = await requireAdminToken()
  if(!token) redirect('/admin');
  
  const response = await fetch(`${getApiGatewayUrl()}/api/auth/admin/users`, {
    method: "POST",
    headers: authHeaders(token),
    body: JSON.stringify(userPayload(formData, true)),
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readUserError(response),
    }
  }

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function updateAdminUser(id: string, formData: FormData) {
  const token = await requireAdminToken()
  if(!token) redirect('/admin');
  
  const response = await fetch(
    `${getApiGatewayUrl()}/api/auth/admin/users/${id}`,
    {
      method: "PUT",
      headers: authHeaders(token),
      body: JSON.stringify(userPayload(formData, false)),
      cache: "no-store",
    }
  )

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readUserError(response),
    }
  }

  revalidatePath("/admin/users")
  redirect("/admin/users")
}

export async function deleteAdminUser(id: string) {
  const token = await requireAdminToken()
  if(!token) redirect('/admin');
  
  await fetch(`${getApiGatewayUrl()}/api/auth/admin/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(token),
    cache: "no-store",
  })

  revalidatePath("/admin/users")
}

function authHeaders(token: string) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  }
}

function userPayload(formData: FormData, requirePassword: boolean) {
  const password = String(formData.get("password") ?? "")
  const payload: {
    email: string
    fullName: string
    role: AdminUserRole
    password?: string
  } = {
    email: String(formData.get("email") ?? "").trim(),
    fullName: String(formData.get("fullName") ?? "").trim(),
    role: String(formData.get("role") ?? "CUSTOMER") as AdminUserRole,
  }

  if (requirePassword || password) {
    payload.password = password
  }

  return payload
}

async function readUserError(response: Response) {
  try {
    const data = (await response.json()) as {
      message?: string
      validationErrors?: Record<string, string>
    }

    return (
      data.message ??
      Object.values(data.validationErrors ?? {})[0] ??
      "Unable to save user."
    )
  } catch {
    return "Unable to save user."
  }
}
