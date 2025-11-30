import { connectDB } from "@/lib/db"
import { Order, Shipment } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { status } = await req.json()

    const order = await Order.findByIdAndUpdate(params.id, { status, updatedAt: new Date() }, { new: true })

    if (status === "shipped") {
      await Shipment.findOneAndUpdate({ orderId: params.id }, { status: "in-transit" })
    }

    if (status === "delivered") {
      await Shipment.findOneAndUpdate({ orderId: params.id }, { status: "delivered", actualDelivery: new Date() })
    }

    return NextResponse.json({ message: "Order status updated", order })
  } catch (error) {
    console.error("Update order status error:", error)
    return NextResponse.json({ error: "Failed to update order status" }, { status: 500 })
  }
}
