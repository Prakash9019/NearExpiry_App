import { connectDB } from "@/lib/db"
import { Shipment } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { orderId, sellerId, trackingNumber } = await req.json()

    const shipment = await Shipment.create({
      orderId,
      sellerId,
      trackingNumber,
      status: "pending",
    })

    return NextResponse.json({ message: "Shipment created", shipment })
  } catch (error) {
    console.error("Create shipment error:", error)
    return NextResponse.json({ error: "Failed to create shipment" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const partnerId = searchParams.get("partnerId")

    const shipments = await Shipment.find({ partnerId }).populate("orderId").populate("sellerId", "name")

    return NextResponse.json(shipments)
  } catch (error) {
    console.error("Get shipments error:", error)
    return NextResponse.json({ error: "Failed to fetch shipments" }, { status: 500 })
  }
}
