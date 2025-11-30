import { connectDB } from "@/lib/db"
import { Product } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const category = searchParams.get("category")
    const sortBy = searchParams.get("sortBy") || "newest"

    const query: any = {}
    if (category) query.category = category

    const products = await Product.find(query).populate("sellerId", "name")

    if (sortBy === "price-asc") products.sort((a, b) => a.finalPrice - b.finalPrice)
    if (sortBy === "price-desc") products.sort((a, b) => b.finalPrice - a.finalPrice)
    if (sortBy === "discount") products.sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))

    return NextResponse.json(products)
  } catch (error) {
    console.error("Get products error:", error)
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { sellerId, name, description, category, originalPrice, expiryDate, quantity, image } = await req.json()

    // Calculate discount based on expiry date
    const today = new Date()
    const expiryDateObj = new Date(expiryDate)
    const daysUntilExpiry = Math.floor((expiryDateObj.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    let discountPercentage = 0
    if (daysUntilExpiry <= 7) discountPercentage = 60
    else if (daysUntilExpiry <= 14) discountPercentage = 40
    else if (daysUntilExpiry <= 30) discountPercentage = 20
    else discountPercentage = 10

    const finalPrice = originalPrice * (1 - discountPercentage / 100)

    const product = await Product.create({
      sellerId,
      name,
      description,
      category,
      originalPrice,
      discountPercentage,
      finalPrice,
      expiryDate,
      quantity,
      image,
      verified: true,
    })

    return NextResponse.json(product)
  } catch (error) {
    console.error("Create product error:", error)
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 })
  }
}
