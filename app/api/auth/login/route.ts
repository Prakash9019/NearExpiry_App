import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import { createToken, setAuthCookie } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password } = await req.json()

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 400 })
    }

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 })
    }

    const token = await createToken(user._id.toString())
    await setAuthCookie(token)

    return NextResponse.json({ user: { id: user._id, email: user.email, role: user.role, name: user.name }, token })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
