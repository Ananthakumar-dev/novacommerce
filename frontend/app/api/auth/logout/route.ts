import { NextResponse } from "next/server"
import { clearCustomerTokenCookie } from "@/lib/customer-auth"

export async function POST() {
  await clearCustomerTokenCookie()
  return NextResponse.json({ success: true })
}
