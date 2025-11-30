import { connectDB } from "@/lib/db"
import { User } from "@/lib/models"
import { createToken, setAuthCookie } from "@/lib/auth"
import bcrypt from "bcryptjs"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password, name, role } = await req.json()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: role || "buyer",
    })

    const token = await createToken(user._id.toString())
    await setAuthCookie(token)

    return NextResponse.json({ user: { id: user._id, email: user.email, role: user.role }, token })
  } catch (error) {
    console.error("Register error:", error)
    return NextResponse.json({ error: "Registration failed" }, { status: 500 })
  }
}
