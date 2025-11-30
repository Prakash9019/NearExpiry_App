// app/api/admin/verify-seller/route.ts
import { connectDB } from "@/lib/db"
import { SellerVerification } from "@/lib/models"
import { NextRequest, NextResponse } from "next/server"
import mongoose from "mongoose"

async function toObjectId(id: string) {
  try {
    return new mongoose.Types.ObjectId(id)
  } catch {
    return id // fallback - if field is stored as string
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB()
    // optional: support query params like ?status=pending
    const url = new URL(req.url)
    console.log("URL:", url);
    console.log("Search Params:", url.searchParams);
    const status = url.searchParams.get("status") || "pending"
    console.log("Fetching verifications with status:", status);
    const filter: any = {}
    if (status) filter.verificationStatus = status

    // return the seller verifications — limit/skip/paginate as needed
    const verifications = await SellerVerification.find(filter).sort({ createdAt: -1 }).lean()
    return NextResponse.json(verifications)
  } catch (err) {
    console.error("GET /api/admin/verify-seller error:", err)
    return NextResponse.json({ error: "Failed to fetch verifications" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()
    const { sellerId, approved, rejectionReason } = body

    if (!sellerId) {
      return NextResponse.json({ error: "Missing sellerId" }, { status: 400 })
    }

    // If your SellerVerification stores sellerId as ObjectId, convert it
    const sellerIdForQuery = (typeof sellerId === "string") ? await toObjectId(sellerId) : sellerId

    const verification = await SellerVerification.findOneAndUpdate(
      { sellerId: sellerIdForQuery },
      {
        verificationStatus: approved ? "approved" : "rejected",
        rejectionReason: approved ? null : rejectionReason || "Documentation incomplete",
        verificationDate: new Date(),
        updatedAt: new Date(),
      },
      { new: true, upsert: false },
    ).lean()

    if (!verification) {
      return NextResponse.json({ error: "Verification record not found" }, { status: 404 })
    }

    return NextResponse.json({ message: "Seller verification updated", verification })
  } catch (error) {
    console.error("POST /api/admin/verify-seller error:", error)
    return NextResponse.json({ error: "Failed to verify seller" }, { status: 500 })
  }
}
