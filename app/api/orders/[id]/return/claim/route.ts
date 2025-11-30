import { connectDB } from "@/lib/db"
import { Dispute, Order } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const { reason } = await req.json()

    const order = await Order.findById(params.id)
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    const dispute = await Dispute.create({
      orderId: params.id,
      buyerId: order.buyerId,
      sellerId: order.sellerId,
      reason,
      status: "open",
      refundAmount: order.totalAmount,
    })

    return NextResponse.json({ message: "Dispute created", dispute })
  } catch (error) {
    console.error("Create dispute error:", error)
    return NextResponse.json({ error: "Failed to create dispute" }, { status: 500 })
  }
}
