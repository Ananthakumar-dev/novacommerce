import { NextResponse } from "next/server"
import { getApiGatewayUrl } from "@/lib/config"
import { getCustomerToken } from "@/lib/customer-auth"

type RouteContext = {
  params: Promise<{ itemId: string }>
}

export async function PUT(req: Request, { params }: RouteContext) {
  try {
    const token = await getCustomerToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params
    const { searchParams } = new URL(req.url)
    const quantity = searchParams.get("quantity")

    if (!quantity) {
      return NextResponse.json({ error: "Quantity query param is required" }, { status: 400 })
    }

    const response = await fetch(
      `${getApiGatewayUrl()}/api/storefront/cart/${itemId}?quantity=${quantity}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      try {
        const errJson = JSON.parse(errText)
        return NextResponse.json({ error: errJson.message || "Failed to update item quantity" }, { status: response.status })
      } catch {
        return NextResponse.json({ error: "Failed to update item quantity" }, { status: response.status })
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("PUT /api/cart/[itemId] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: Request, { params }: RouteContext) {
  try {
    const token = await getCustomerToken()
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { itemId } = await params

    const response = await fetch(
      `${getApiGatewayUrl()}/api/storefront/cart/${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    )

    if (!response.ok) {
      const errText = await response.text()
      try {
        const errJson = JSON.parse(errText)
        return NextResponse.json({ error: errJson.message || "Failed to delete item" }, { status: response.status })
      } catch {
        return NextResponse.json({ error: "Failed to delete item" }, { status: response.status })
      }
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("DELETE /api/cart/[itemId] error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
