import { NextResponse } from "next/server"
import { getApiGatewayUrl } from "@/lib/config"
import { getCustomerToken } from "@/lib/customer-auth"

export async function GET() {
  try {
    const token = await getCustomerToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const response = await fetch(`${getApiGatewayUrl()}/api/auth/addresses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errText = await response.text()
      try {
        const errJson = JSON.parse(errText)
        return NextResponse.json({ error: errJson.message || "Failed to fetch addresses" }, { status: response.status })
      } catch {
        return NextResponse.json({ error: "Failed to fetch addresses" }, { status: response.status })
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/addresses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const token = await getCustomerToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()

    const response = await fetch(`${getApiGatewayUrl()}/api/auth/addresses`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      cache: "no-store",
    })

    if (!response.ok) {
      const errText = await response.text()
      try {
        const errJson = JSON.parse(errText)
        return NextResponse.json({ error: errJson.message || "Failed to add address" }, { status: response.status })
      } catch {
        return NextResponse.json({ error: "Failed to add address" }, { status: response.status })
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("POST /api/addresses error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
