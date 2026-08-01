import { NextResponse } from "next/server"
import { getApiGatewayUrl } from "@/lib/config"
import { getCustomerToken } from "@/lib/customer-auth"

type RouteContext = {
  params: Promise<{ addressId: string }>
}

export async function PATCH(req: Request, { params }: RouteContext) {
  try {
    const token = await getCustomerToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { addressId } = await params

    const response = await fetch(`${getApiGatewayUrl()}/api/auth/addresses/${addressId}/default`, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errText = await response.text()
      try {
        const errJson = JSON.parse(errText)
        return NextResponse.json({ error: errJson.message || "Failed to set default address" }, { status: response.status })
      } catch {
        return NextResponse.json({ error: "Failed to set default address" }, { status: response.status })
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("PATCH /api/addresses/[addressId]/default error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
