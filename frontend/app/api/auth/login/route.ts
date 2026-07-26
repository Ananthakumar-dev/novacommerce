import { NextResponse } from "next/server"
import { loginCustomerUser, setCustomerTokenCookie } from "@/lib/customer-auth"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required." },
        { status: 400 }
      )
    }

    const result = await loginCustomerUser(email, password)

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
    console.error("Login API route error:", error)
    return NextResponse.json(
      { message: "An unexpected error occurred during login." },
      { status: 500 }
    )
  }
}
