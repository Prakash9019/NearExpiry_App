import { connectDB } from "@/lib/db"
import { Product } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { sellerId, products } = await req.json()

    if (!Array.isArray(products) || products.length === 0) {
      return NextResponse.json({ error: "Products array is required" }, { status: 400 })
    }

    const today = new Date()
    const createdProducts = await Promise.all(
      products.map(async (product) => {
        const expiryDateObj = new Date(product.expiryDate)
        const daysUntilExpiry = Math.floor((expiryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

        let discountPercentage = 0
        if (daysUntilExpiry <= 7) discountPercentage = 60
        else if (daysUntilExpiry <= 14) discountPercentage = 40
        else if (daysUntilExpiry <= 30) discountPercentage = 20
        else discountPercentage = 10

        const finalPrice = product.originalPrice * (1 - discountPercentage / 100)

        return Product.create({
          sellerId,
          name: product.name,
          description: product.description,
          category: product.category,
          originalPrice: product.originalPrice,
          discountPercentage,
          finalPrice,
          expiryDate: product.expiryDate,
          quantity: product.quantity,
          image: product.image,
          sku: product.sku,
          verified: false,
        })
      }),
    )

    return NextResponse.json({ message: "Products uploaded successfully", count: createdProducts.length })
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json({ error: "Failed to upload products" }, { status: 500 })
  }
}
