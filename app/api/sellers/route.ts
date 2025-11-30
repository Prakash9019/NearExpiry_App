import { connectDB } from "@/lib/db"
import { User, SellerVerification } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { email, password, name, phone, role } = await req.json()

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "Email already exists" }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      phone,
      role: role || "seller",
    })

    // Create seller verification record
    await SellerVerification.create({
      sellerId: user._id,
      verificationStatus: "pending",
    })

    return NextResponse.json({ message: "Seller created successfully", userId: user._id })
  } catch (error) {
    console.error("Create seller error:", error)
    return NextResponse.json({ error: "Failed to create seller" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const sellers = await User.find({ role: "seller" }).select("-password")
    return NextResponse.json(sellers)
  } catch (error) {
    console.error("Get sellers error:", error)
    return NextResponse.json({ error: "Failed to fetch sellers" }, { status: 500 })
  }
}
