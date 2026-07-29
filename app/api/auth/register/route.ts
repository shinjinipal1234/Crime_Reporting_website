import { type NextRequest, NextResponse } from "next/server"
import { cookies } from "next/headers"
import { register } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { email, password, fullName, phone } = await request.json()

    const user = await register(email, password, fullName, phone)

    if (user) {
      const cookieStore = await cookies()
      cookieStore.set("user", JSON.stringify(user), {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return NextResponse.json({ success: true, user })
    } else {
      return NextResponse.json({ error: "Registration failed" }, { status: 400 })
    }
  } catch (error) {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
