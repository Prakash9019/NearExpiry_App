import mongoose from "mongoose"

const productSchema = new mongoose.Schema(
  {
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      enum: ["soap", "toothpaste", "shampoo", "detergent", "cleaner", "baby-care", "cosmetics", "grooming"],
      required: true,
    },
    description: String,
    originalPrice: {
      type: Number,
      required: true,
    },
    discountPercentage: {
      type: Number,
      required: true,
    },
    currentPrice: {
      type: Number,
      required: true,
    },
    expiryDate: {
      type: Date,
      required: true,
    },
    daysUntilExpiry: Number,
    discountTier: {
      type: String,
      enum: ["hot-deal", "good-deal", "fair-deal"],
      default: "fair-deal",
    },
    quantity: {
      type: Number,
      required: true,
      default: 0,
    },
    images: [String],
    rating: {
      type: Number,
      default: 4.5,
      min: 0,
      max: 5,
    },
    reviews: [
      {
        user: mongoose.Schema.Types.ObjectId,
        rating: Number,
        comment: String,
        createdAt: { type: Date, default: Date.now },
      },
    ],
    status: {
      type: String,
      enum: ["active", "sold-out", "inactive"],
      default: "active",
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Auto-calculate discount tier based on days until expiry
productSchema.pre("save", function (next) {
  const now = new Date()
  const daysLeft = Math.floor((this.expiryDate - now) / (1000 * 60 * 60 * 24))
  this.daysUntilExpiry = daysLeft

  if (daysLeft <= 7) this.discountTier = "hot-deal"
  else if (daysLeft <= 15) this.discountTier = "good-deal"
  else this.discountTier = "fair-deal"

  next()
})

export default mongoose.model("Product", productSchema)
