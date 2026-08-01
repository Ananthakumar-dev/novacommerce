import { NextResponse } from "next/server"
import { getApiGatewayUrl } from "@/lib/config"
import { getCustomerToken } from "@/lib/customer-auth"

type RouteContext = {
  params: Promise<{ addressId: string }>
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const token = await getCustomerToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { addressId } = await params
    const body = await req.json()

    const response = await fetch(`${getApiGatewayUrl()}/api/auth/addresses/${addressId}`, {
      method: "PUT",
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
        return NextResponse.json({ error: errJson.message || "Failed to update address" }, { status: response.status })
      } catch {
        return NextResponse.json({ error: "Failed to update address" }, { status: response.status })
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("PUT /api/addresses/[addressId] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const token = await getCustomerToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { addressId } = await params

    const response = await fetch(`${getApiGatewayUrl()}/api/auth/addresses/${addressId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })

    if (!response.ok) {
      const errText = await response.text()
      try {
        const errJson = JSON.parse(errText)
        return NextResponse.json({ error: errJson.message || "Failed to delete address" }, { status: response.status })
      } catch {
        return NextResponse.json({ error: "Failed to delete address" }, { status: response.status })
      }
    }

    return new Response(null, { status: 204 })
  } catch (error) {
    console.error("DELETE /api/addresses/[addressId] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
