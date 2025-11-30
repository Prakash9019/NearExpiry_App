import { connectDB } from "@/lib/db"
import { SellerVerification } from "@/lib/models"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const { sellerId, companyName, gstNumber, bankAccountNumber, bankIFSC, panNumber, documentUrls } = await req.json()

    const verification = await SellerVerification.findOneAndUpdate(
      { sellerId },
      {
        companyName,
        gstNumber,
        bankAccountNumber,
        bankIFSC,
        panNumber,
        invoiceDocuments: documentUrls,
        verificationStatus: "pending",
        updatedAt: new Date(),
      },
      { new: true },
    )

    return NextResponse.json({ message: "Verification submitted for review", verification })
  } catch (error) {
    console.error("Submit verification error:", error)
    return NextResponse.json({ error: "Failed to submit verification" }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(req.url)
    const sellerId = searchParams.get("sellerId")

    const verification = await SellerVerification.findOne({ sellerId })
    return NextResponse.json(verification)
  } catch (error) {
    console.error("Get verification error:", error)
    return NextResponse.json({ error: "Failed to fetch verification" }, { status: 500 })
  }
}
