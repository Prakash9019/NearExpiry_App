import express from "express"
import Product from "../models/Product.js"
import { authMiddleware, sellerOnly } from "../middleware/auth.js"

const router = express.Router()

// Get all products with filters
router.get("/", async (req, res) => {
  try {
    const { category, sortBy, page = 1, limit = 20 } = req.query
    const skip = (page - 1) * limit

    const query = { status: "active" }
    if (category) query.category = category

    let sortOption = {}
    switch (sortBy) {
      case "discount":
        sortOption = { discountPercentage: -1 }
        break
      case "expiry":
        sortOption = { expiryDate: 1 }
        break
      case "price-low":
        sortOption = { currentPrice: 1 }
        break
      case "price-high":
        sortOption = { currentPrice: -1 }
        break
      case "new":
        sortOption = { createdAt: -1 }
        break
      default:
        sortOption = { createdAt: -1 }
    }

    const products = await Product.find(query)
      .populate("seller", "name avatar")
      .sort(sortOption)
      .skip(skip)
      .limit(Number.parseInt(limit))

    const total = await Product.countDocuments(query)

    res.json({
      products,
      pagination: {
        total,
        page: Number.parseInt(page),
        pages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get single product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("seller", "name avatar")
      .populate("reviews.user", "name avatar")

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Create product (seller only)
router.post("/", authMiddleware, sellerOnly, async (req, res) => {
  try {
    const { name, category, description, originalPrice, quantity, expiryDate, images, discountPercentage } = req.body

    const product = new Product({
      seller: req.user.id,
      name,
      category,
      description,
      originalPrice,
      discountPercentage,
      currentPrice: originalPrice * (1 - discountPercentage / 100),
      expiryDate: new Date(expiryDate),
      quantity,
      images,
    })

    await product.save()
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Add review to product
router.post("/:id/review", authMiddleware, async (req, res) => {
  try {
    const { rating, comment } = req.body
    const product = await Product.findById(req.params.id)

    if (!product) {
      return res.status(404).json({ error: "Product not found" })
    }

    product.reviews.push({
      user: req.user.id,
      rating,
      comment,
    })

    await product.save()
    res.json(product)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
