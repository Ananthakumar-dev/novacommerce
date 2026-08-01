import { NextRequest, NextResponse } from "next/server"
import { getApiGatewayUrl } from "@/lib/config"

export async function GET(req: NextRequest) {
  try {
    const subtotal = req.nextUrl.searchParams.get("subtotal")
    const query = subtotal ? `?subtotal=${subtotal}` : ""

    const response = await fetch(`${getApiGatewayUrl()}/api/shipping-methods${query}`, {
      cache: "no-store",
    })

    if (!response.ok) {
      return NextResponse.json({ error: "Failed to fetch shipping methods" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("GET /api/shipping-methods error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
