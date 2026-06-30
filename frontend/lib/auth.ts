import { cookies } from "next/headers"
import { redirect } from "next/navigation"

export const ADMIN_TOKEN_COOKIE = "nova_admin_token"
export const ADMIN_TOKEN_MAX_AGE = 60 * 60 * 24

type AdminLoginResponse = {
  token: string
  role: string
  email: string
  fullName: string
}

export type AdminProfile = {
  id: number
  email: string
  fullName: string
  role: string
}

export function getAuthServiceUrl() {
  return process.env.AUTH_SERVICE_URL ?? "http://localhost:8081"
}

export async function setAdminTokenCookie(token: string) {
  const cookieStore = await cookies()

  cookieStore.set(ADMIN_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: ADMIN_TOKEN_MAX_AGE,
  })
}

export async function getAdminToken() {
  const cookieStore = await cookies()

  return cookieStore.get(ADMIN_TOKEN_COOKIE)?.value
}

export async function loginAdminUser(email: string, password: string) {
  const response = await fetch(`${getAuthServiceUrl()}/api/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readAuthError(response),
    }
  }

  const data = (await response.json()) as AdminLoginResponse

  if (data.role !== "ADMIN") {
    return {
      ok: false as const,
      message: "This account does not have admin access.",
    }
  }

  return {
    ok: true as const,
    data,
  }
}

export async function getAdminProfile(token: string) {
  const response = await fetch(`${getAuthServiceUrl()}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const profile = (await response.json()) as AdminProfile

  if (profile.role !== "ADMIN") {
    return null
  }

  return profile
}

export async function requireAdminProfile() {
  const token = await getAdminToken()

  if (!token) {
    redirect("/admin")
  }

  const profile = await getAdminProfile(token)

  if (!profile) {
    redirect("/admin")
  }

  return profile
}

async function readAuthError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string }

    return data.message ?? "Unable to sign in. Please check your credentials."
  } catch {
    return "Unable to sign in. Please check your credentials."
  }
}
