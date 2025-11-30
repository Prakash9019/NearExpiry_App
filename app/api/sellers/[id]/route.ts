import { connectDB } from "@/lib/db"
import { User, Product, Order } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const seller = await User.findById(params.id)
    const products = await Product.find({ sellerId: params.id })
    const orders = await Order.find({ sellerId: params.id })

    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0)
    const totalSales = orders.length

    return NextResponse.json({
      seller: { id: seller._id, name: seller.name, email: seller.email },
      stats: {
        totalProducts: products.length,
        totalRevenue,
        totalSales,
        avgRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length || 0,
      },
    })
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch seller" }, { status: 500 })
  }
}
