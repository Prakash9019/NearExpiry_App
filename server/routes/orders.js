import express from "express"
import Order from "../models/Order.js"
import User from "../models/User.js"
import Product from "../models/Product.js"
import { authMiddleware } from "../middleware/auth.js"

const router = express.Router()

// Create order
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { products, deliveryType, shippingAddress } = req.body

    let totalAmount = 0
    const orderProducts = []

    for (const item of products) {
      const product = await Product.findById(item.productId)
      if (!product) {
        return res.status(404).json({ error: `Product ${item.productId} not found` })
      }

      const itemTotal = product.currentPrice * item.quantity
      totalAmount += itemTotal

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price: product.currentPrice,
      })

      product.quantity -= item.quantity
      if (product.quantity === 0) {
        product.status = "sold-out"
      }
      await product.save()
    }

    const order = new Order({
      buyer: req.user.id,
      products: orderProducts,
      totalAmount,
      finalAmount: totalAmount,
      deliveryType,
      shippingAddress,
      paymentStatus: "completed",
    })

    await order.save()

    const user = await User.findById(req.user.id)
    user.wasteSavedKg += order.wasteSavedKg
    user.greenPoints += order.greenPointsEarned
    await user.save()

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get user orders
router.get("/", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user.id }).populate("products.product").sort({ createdAt: -1 })

    res.json(orders)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Get order by ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate("products.product").populate("buyer", "name email phone")

    if (!order) {
      return res.status(404).json({ error: "Order not found" })
    }

    res.json(order)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

export default router
