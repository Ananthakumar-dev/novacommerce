"use server"

import { redirect } from "next/navigation"

import { loginAdminUser, setAdminTokenCookie } from "@/lib/auth"

export type AdminLoginState = {
  error?: string
}

export async function loginAdminAction(
  _previousState: AdminLoginState,
  formData: FormData
): Promise<AdminLoginState> {
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return {
      error: "Email and password are required.",
    }
  }

  let result: Awaited<ReturnType<typeof loginAdminUser>>

  try {
    result = await loginAdminUser(email, password)
  } catch {
    return {
      error: "Auth service is unavailable. Please try again shortly.",
    }
  }

  if (!result.ok) {
    return {
      error: result.message,
    }
  }

  await setAdminTokenCookie(result.data.token)
  redirect("/admin/dashboard")
}
