import { connectDB } from "@/lib/db"
import { Product } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

// 1. Update the type definition for params to be a Promise
type Props = {
  params: Promise<{
    id: string
  }>
}

export async function GET(req: NextRequest, props: Props) {
  try {
    // 2. Await the params object before accessing properties
    const params = await props.params;
    
    await connectDB()
    
    // 3. Now use params.id safely
    const product = await Product.findById(params.id).populate("sellerId", "name email")

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 })
    }

    return NextResponse.json(product)
  } catch (error) {
    console.error("API Error:", error) // Log the error for debugging
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 })
  }
}