import { connectDB } from "@/lib/db"
import { Order, Product, User } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const buyerId = searchParams.get("buyerId")

    const orders = await Order.find({ buyerId }).populate("sellerId", "name email").sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { buyerId, items, totalAmount, deliveryMode, deliveryAddress } = await req.json()

    // Calculate waste saved and green points
    let totalWasteSaved = 0
    const greenPointsEarned = Math.floor(totalAmount / 10)

    for (const item of items) {
      const product = await Product.findById(item.productId)
      if (product) {
        totalWasteSaved += item.quantity * 0.5 // 500g per item
      }
    }

    const order = await Order.create({
      buyerId,
      sellerId: items[0]?.sellerId,
      items,
      totalAmount,
      deliveryMode,
      deliveryAddress,
      greenPointsEarned,
      wasteSaved: totalWasteSaved,
    })

    // Update user green points and waste saved
    await User.findByIdAndUpdate(buyerId, {
      $inc: {
        greenPoints: greenPointsEarned,
        wasteSavedKg: totalWasteSaved / 1000,
        carbonSavedKg: (totalWasteSaved / 1000) * 0.5,
      },
    })

    return NextResponse.json(order)
  } catch (error) {
    console.error("Create order error:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
