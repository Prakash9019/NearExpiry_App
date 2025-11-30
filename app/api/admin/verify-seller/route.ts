import { connectDB } from "@/lib/db"
import { SellerVerification } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { sellerId, approved, rejectionReason } = await req.json()

    const verification = await SellerVerification.findOneAndUpdate(
      { sellerId },
      {
        verificationStatus: approved ? "approved" : "rejected",
        rejectionReason: approved ? null : rejectionReason,
        verificationDate: new Date(),
        updatedAt: new Date(),
      },
      { new: true },
    )

    return NextResponse.json({ message: "Seller verification updated", verification })
  } catch (error) {
    console.error("Verify seller error:", error)
    return NextResponse.json({ error: "Failed to verify seller" }, { status: 500 })
  }
}
