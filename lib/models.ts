import mongoose from "mongoose"

// User Schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: String,
  role: { type: String, enum: ["buyer", "seller", "admin"], default: "buyer" },
  avatar: String,
  phone: String,
  address: String,
  latitude: Number,
  longitude: Number,
  greenPoints: { type: Number, default: 0 },
  wasteSavedKg: { type: Number, default: 0 },
  carbonSavedKg: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Product Schema
const productSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  description: String,
  category: {
    type: String,
    required: true,
    enum: ["soaps", "toothpaste", "shampoos", "detergents", "cleaners", "dishwash", "baby-care"],
  },
  originalPrice: { type: Number, required: true },
  discountPercentage: Number,
  finalPrice: Number,
  batchNumber: String,
  manufacturingDate: Date,
  expiryDate: { type: Date, required: true },
  quantity: { type: Number, default: 1 },
  image: String,
  barcode: String,
  qrCode: String,
  sku: String,
  latitude: Number,
  longitude: Number,
  ocrVerified: { type: Boolean, default: false },
  ocrResult: String,
  inspectionDate: Date,
  inspectionNotes: String,
  verified: { type: Boolean, default: false },
  rating: { type: Number, default: 0 },
  reviews: [{ buyerId: String, comment: String, rating: Number, createdAt: Date }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Order Schema
const orderSchema = new mongoose.Schema({
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  items: [
    {
      productId: mongoose.Schema.Types.ObjectId,
      name: String,
      batchNumber: String,
      quantity: Number,
      price: Number,
      discount: Number,
      expiryDate: Date,
    },
  ],
  totalAmount: { type: Number, required: true },
  status: {
    type: String,
    enum: ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled"],
    default: "pending",
  },
  deliveryMode: { type: String, enum: ["delivery", "pickup"], default: "delivery" },
  deliveryAddress: String,
  qrCodeTicket: String,
  pickupSlot: String,
  greenPointsEarned: Number,
  wasteSaved: Number,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Seller Verification Schema
const sellerVerificationSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  companyName: String,
  companyRegistration: String,
  gstNumber: String,
  bankAccountName: String,
  bankAccountNumber: String,
  bankIFSC: String,
  panNumber: String,
  invoiceDocuments: [String],
  expiryDocuments: [String],
  verificationStatus: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  verificationDate: Date,
  rejectionReason: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Payment Schema
const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  method: { type: String, enum: ["upi", "card", "wallet", "netbanking"], required: true },
  transactionId: String,
  status: { type: String, enum: ["pending", "completed", "failed"], default: "pending" },
  createdAt: { type: Date, default: Date.now },
})

// Shipment Schema
const shipmentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  partnerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  trackingNumber: String,
  status: { type: String, enum: ["pending", "packed", "in-transit", "delivered"], default: "pending" },
  pickupPoint: String,
  pickupLat: Number,
  pickupLng: Number,
  deliveryLat: Number,
  deliveryLng: Number,
  shippingLabel: String,
  estimatedDelivery: Date,
  actualDelivery: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Dispute/Return Schema
const disputeSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
  buyerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  reason: String,
  status: { type: String, enum: ["open", "under-review", "resolved", "rejected"], default: "open" },
  refundAmount: Number,
  adminNotes: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

// Payout Schema
const payoutSchema = new mongoose.Schema({
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  period: String,
  status: { type: String, enum: ["pending", "processed", "failed"], default: "pending" },
  transactionId: String,
  createdAt: { type: Date, default: Date.now },
})

// Inspection Log Schema
const inspectionLogSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  inspectionType: String,
  ocrResult: String,
  expiryConfirmed: Boolean,
  inspectorNotes: String,
  inspectionImages: [String],
  createdAt: { type: Date, default: Date.now },
})

// Micro-warehouse / Partner Schema
const partnerSchema = new mongoose.Schema({
  name: String,
  type: { type: String, enum: ["warehouse", "pickup-point"], required: true },
  location: String,
  latitude: Number,
  longitude: Number,
  capacity: Number,
  currentInventory: Number,
  managerId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  createdAt: { type: Date, default: Date.now },
})

export const User = mongoose.models.User || mongoose.model("User", userSchema)
export const Product = mongoose.models.Product || mongoose.model("Product", productSchema)
export const Order = mongoose.models.Order || mongoose.model("Order", orderSchema)
export const SellerVerification =
  mongoose.models.SellerVerification || mongoose.model("SellerVerification", sellerVerificationSchema)
export const Payment = mongoose.models.Payment || mongoose.model("Payment", paymentSchema)
export const Shipment = mongoose.models.Shipment || mongoose.model("Shipment", shipmentSchema)
export const Dispute = mongoose.models.Dispute || mongoose.model("Dispute", disputeSchema)
export const Payout = mongoose.models.Payout || mongoose.model("Payout", payoutSchema)
export const InspectionLog = mongoose.models.InspectionLog || mongoose.model("InspectionLog", inspectionLogSchema)
export const Partner = mongoose.models.Partner || mongoose.model("Partner", partnerSchema)
