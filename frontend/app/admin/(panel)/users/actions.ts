"use server"

import {
  createAdminUser,
  deleteAdminUser,
  updateAdminUser,
  type UserFormState,
} from "@/lib/admin-users"

export async function createUserAction(
  _previousState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const validationError = validateUserForm(formData, true)

  if (validationError) {
    return { error: validationError }
  }

  const result = await createAdminUser(formData)

  return result.ok ? {} : { error: result.message }
}

export async function updateUserAction(
  id: string,
  _previousState: UserFormState,
  formData: FormData
): Promise<UserFormState> {
  const validationError = validateUserForm(formData, false)

  if (validationError) {
    return { error: validationError }
  }

  const result = await updateAdminUser(id, formData)

  return result.ok ? {} : { error: result.message }
}

export async function deleteUserAction(formData: FormData) {
  const id = String(formData.get("id") ?? "")

  if (id) {
    await deleteAdminUser(id)
  }
}

function validateUserForm(formData: FormData, requirePassword: boolean) {
  const fullName = String(formData.get("fullName") ?? "").trim()
  const email = String(formData.get("email") ?? "").trim()
  const password = String(formData.get("password") ?? "")
  const role = String(formData.get("role") ?? "")

  if (!fullName || !email || !role) {
    return "Full name, email, and role are required."
  }

  if (requirePassword && !password) {
    return "Password is required."
  }

  if (password && password.length < 6) {
    return "Password must be at least 6 characters."
  }

  return null
}
