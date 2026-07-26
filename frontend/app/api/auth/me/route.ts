import { NextResponse } from "next/server"
import { getCustomerToken, getCustomerProfile } from "@/lib/customer-auth"

export async function GET() {
  try {
    const token = await getCustomerToken()

    if (!token) {
      return NextResponse.json({ user: null })
    }

    const user = await getCustomerProfile(token)

    if (!user) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("GET /api/auth/me error:", error)
    return NextResponse.json({ user: null })
  }
}
