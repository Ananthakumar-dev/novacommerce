"use server"

import {
  createAdminShippingMethod,
  deleteAdminShippingMethod,
  listAdminShippingMethods,
  updateAdminShippingMethod,
  type AdminShippingMethod,
} from "@/lib/admin-shipping"

export async function listShippingMethodsAction() {
  return await listAdminShippingMethods()
}

export async function createShippingMethodAction(payload: Omit<AdminShippingMethod, "id">) {
  return await createAdminShippingMethod(payload)
}

export async function updateShippingMethodAction(id: number, payload: Partial<AdminShippingMethod>) {
  return await updateAdminShippingMethod(id, payload)
}

export async function deleteShippingMethodAction(id: number) {
  return await deleteAdminShippingMethod(id)
}
