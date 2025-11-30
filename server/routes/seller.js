import express from "express"
import Product from "../models/Product.js"
import Order from "../models/Order.js"
import { authMiddleware, sellerOnly } from "../middleware/auth.js"

const router = express.Router()

// Get seller's products
router.get("/my-products", authMiddleware, sellerOnly, async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id })
    res.json(products)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get seller's sales orders
router.get("/my-sales", authMiddleware, sellerOnly, async (req, res) => {
  try {
    const orders = await Order.find({
      "products.product": { $in: await Product.find({ seller: req.user.id }).select("_id") },
    })
      .populate("buyer", "name phone")
      .populate("products.product")

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
