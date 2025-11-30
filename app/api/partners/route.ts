import { connectDB } from "@/lib/db"
import { Partner } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { name, type, location, latitude, longitude, capacity, managerId } = await req.json()

    const partner = await Partner.create({
      name,
      type,
      location,
      latitude,
      longitude,
      capacity,
      managerId,
      currentInventory: 0,
    })

    return NextResponse.json({ message: "Partner created", partner })
  } catch (error) {
    console.error("Create partner error:", error)
    return NextResponse.json({ error: "Failed to create partner" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const partners = await Partner.find({ status: "active" })
    return NextResponse.json(partners)
  } catch (error) {
    console.error("Get partners error:", error)
    return NextResponse.json({ error: "Failed to fetch partners" }, { status: 500 })
  }
}
