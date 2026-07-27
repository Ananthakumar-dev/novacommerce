import { NextResponse } from "next/server"
import { registerCustomerUser, setCustomerTokenCookie } from "@/lib/customer-auth"

export async function POST(request: Request) {
  try {
        const { fullName, email, password, role } = await request.json()

    if (!fullName || !email || !password) {
      return NextResponse.json(
        { message: "All fields (Full Name, Email, Password) are required." },
        { status: 400 }
      )
    }

    const result = await registerCustomerUser(fullName, email, password, role || "CUSTOMER")

    if (!result.ok) {
      return NextResponse.json(
        { message: result.message },
        { status: 400 }
      )
    }

    await setCustomerTokenCookie(result.data.token)

    return NextResponse.json({
      user: {
        email: result.data.email,
        fullName: result.data.fullName,
        role: result.data.role,
      },
    })
  } catch (error) {
    console.error("Register API route error:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred during registration." },
      { status: 500 }
    )
  }
}
