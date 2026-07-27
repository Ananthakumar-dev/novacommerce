import { cookies } from "next/headers"
import { getApiGatewayUrl } from "@/lib/config"

export const CUSTOMER_TOKEN_COOKIE = "nova_customer_token"
export const CUSTOMER_TOKEN_MAX_AGE = 60 * 60 * 24 * 7 // 7 days

export type CustomerUser = {
  id: number
  email: string
  fullName: string
  role: string
}

export type AuthResponseData = {
  token: string
  role: string
  email: string
  fullName: string
}

export async function setCustomerTokenCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set(CUSTOMER_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: CUSTOMER_TOKEN_MAX_AGE,
  })
}

export async function clearCustomerTokenCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(CUSTOMER_TOKEN_COOKIE)
}

export async function getCustomerToken() {
  const cookieStore = await cookies()
  return cookieStore.get(CUSTOMER_TOKEN_COOKIE)?.value
}

export async function loginCustomerUser(email: string, password: string) {
  const response = await fetch(`${getApiGatewayUrl()}/api/auth/login`, {
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

  const data = (await response.json()) as AuthResponseData

  return {
    ok: true as const,
    data,
  }
}

export async function registerCustomerUser(fullName: string, email: string, password: string, role: string = "CUSTOMER") {
  const response = await fetch(`${getApiGatewayUrl()}/api/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      fullName,
      email,
      password,
      role,
    }),
    cache: "no-store",
  })

  if (!response.ok) {
    return {
      ok: false as const,
      message: await readAuthError(response),
    }
  }

  const data = (await response.json()) as AuthResponseData

  return {
    ok: true as const,
    data,
  }
}

export async function getCustomerProfile(token: string) {
  const response = await fetch(`${getApiGatewayUrl()}/api/auth/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  })

  if (!response.ok) {
    return null
  }

  const profile = (await response.json()) as CustomerUser
  return profile
}

async function readAuthError(response: Response) {
  try {
    const data = (await response.json()) as { message?: string }
    return data.message ?? "Authentication request failed."
  } catch {
    return "Authentication request failed. Please check your details."
  }
}
