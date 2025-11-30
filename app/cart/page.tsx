"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Trash2, ShoppingCart, Leaf, ArrowRight, AlertCircle, Clock, MapPin } from "lucide-react"
import Navbar from "@/components/Navbar"

interface CartItem {
  _id: string
  name: string
  finalPrice: number
  originalPrice: number
  quantity: number
  discountPercentage: number
  image: string
  expiryDate: string
  batchNumber?: string
  deliveryMode?: "delivery" | "pickup"
}

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [loading, setLoading] = useState(true)
  const [expiryWarning, setExpiryWarning] = useState<{ show: boolean; item: CartItem | null }>({
    show: false,
    item: null,
  })
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery")
  const [pickupSlot, setPickupSlot] = useState<string>("4pm-8pm")

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartItems(cart)
    setLoading(false)
  }, [])

  const removeItem = (productId: string) => {
    const updated = cartItems.filter((item) => item._id !== productId)
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    const daysLeft = daysUntilExpiry(cartItems.find((item) => item._id === productId)?.expiryDate || "")
    const item = cartItems.find((item) => item._id === productId)

    // Show warning if expiry is within 2 days and quantity is high
    if (daysLeft <= 2 && quantity > 2 && item) {
      setExpiryWarning({ show: true, item })
      return
    }

    const updated = cartItems.map((item) =>
      item._id === productId ? { ...item, quantity: Math.max(1, quantity) } : item,
    )
    setCartItems(updated)
    localStorage.setItem("cart", JSON.stringify(updated))
  }

  const daysUntilExpiry = (date: string) => {
    const today = new Date()
    const expiry = new Date(date)
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.finalPrice * item.quantity, 0)
  const deliveryFee = deliveryMode === "delivery" ? 40 : 0
  const total = subtotal + deliveryFee
  const wasteSaved = cartItems.length * 0.25
  const greenPointsEarned = Math.floor(total / 10)
  const avgDiscount =
    cartItems.length > 0
      ? (cartItems.reduce((sum, item) => sum + item.discountPercentage, 0) / cartItems.length).toFixed(0)
      : 0

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading cart...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Shopping Cart</h1>
          <p className="text-muted-foreground text-sm md:text-base">
            {cartItems.length} item{cartItems.length !== 1 ? "s" : ""}
          </p>
        </div>
      </div>

      {cartItems.length === 0 ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
          <ShoppingCart size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Your cart is empty</h2>
          <p className="text-muted-foreground mb-8">Start shopping to add items to your cart</p>
          <Link
            href="/marketplace"
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
          >
            Continue Shopping <ArrowRight size={20} />
          </Link>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => {
                const daysLeft = daysUntilExpiry(item.expiryDate)
                const isUrgent = daysLeft <= 10

                return (
                  <div
                    key={item._id}
                    className={`p-4 md:p-6 rounded-lg border ${isUrgent ? "bg-red-50 border-red-200" : "bg-card border-border"} hover:shadow-lg transition`}
                  >
                    <div className="flex flex-col sm:flex-row gap-4">
                      <img
                        src={item.image || "/placeholder.svg?height=100&width=100&query=product"}
                        alt={item.name}
                        className="w-full sm:w-24 h-40 sm:h-24 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3">
                          <div className="flex-1">
                            <h3 className="font-bold text-foreground text-lg">{item.name}</h3>
                            <p className="text-sm text-muted-foreground">
                              {item.batchNumber && <span>Batch: {item.batchNumber} • </span>}
                              Expires in {daysLeft} days
                            </p>
                          </div>
                          {isUrgent && (
                            <div className="mt-2 sm:mt-0 inline-flex items-center gap-1 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">
                              <AlertCircle size={14} /> Urgent
                            </div>
                          )}
                        </div>

                        <p className="text-sm text-muted-foreground mb-3">
                          <span className="line-through">₹{item.originalPrice.toFixed(0)}</span> •{" "}
                          {item.discountPercentage}% off
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                          <div className="flex items-center gap-2 border border-border rounded-lg p-1 w-fit">
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              className="px-2 py-1 hover:bg-muted rounded"
                            >
                              −
                            </button>
                            <span className="w-6 text-center font-semibold">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                              className="px-2 py-1 hover:bg-muted rounded"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-primary text-lg">
                            ₹{(item.finalPrice * item.quantity).toFixed(0)}
                          </span>
                          <button
                            onClick={() => removeItem(item._id)}
                            className="ml-0 sm:ml-auto text-red-600 hover:text-red-700 p-2 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}

              {/* Expiry Warning Modal */}
              {expiryWarning.show && expiryWarning.item && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                  <div className="bg-card rounded-lg max-w-md w-full p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertCircle size={28} className="text-red-600" />
                      <h3 className="text-lg font-bold text-foreground">Expiry Conflict Warning</h3>
                    </div>
                    <p className="text-muted-foreground mb-6">
                      You have added {expiryWarning.item.quantity} units of <strong>{expiryWarning.item.name}</strong>{" "}
                      expiring in <strong>{daysUntilExpiry(expiryWarning.item.expiryDate)} days</strong>. Can you
                      consume it in time?
                    </p>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          const updated = cartItems.map((item) =>
                            item._id === expiryWarning.item._id
                              ? { ...item, quantity: Math.max(1, item.quantity - 1) }
                              : item,
                          )
                          setCartItems(updated)
                          localStorage.setItem("cart", JSON.stringify(updated))
                          setExpiryWarning({ show: false, item: null })
                        }}
                        className="flex-1 bg-muted text-foreground py-2 rounded-lg font-semibold hover:bg-muted/80 transition"
                      >
                        Reduce Qty
                      </button>
                      <button
                        onClick={() => setExpiryWarning({ show: false, item: null })}
                        className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                      >
                        Yes, Proceed
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Summary Sidebar */}
            <div>
              <div className="bg-card p-6 rounded-lg border border-border sticky top-24 space-y-6">
                <h3 className="font-bold text-foreground text-lg">Order Summary</h3>

                {/* Delivery/Pickup Selection */}
                <div className="grid grid-cols-2 gap-3 p-3 bg-muted rounded-lg">
                  <button
                    onClick={() => setDeliveryMode("delivery")}
                    className={`p-3 rounded font-semibold text-sm transition ${
                      deliveryMode === "delivery"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-background/80"
                    }`}
                  >
                    Delivery +₹40
                  </button>
                  <button
                    onClick={() => setDeliveryMode("pickup")}
                    className={`p-3 rounded font-semibold text-sm transition ${
                      deliveryMode === "pickup"
                        ? "bg-primary text-primary-foreground"
                        : "bg-background text-foreground hover:bg-background/80"
                    }`}
                  >
                    Free Pickup
                  </button>
                </div>

                {/* Pickup Slot Selection */}
                {deliveryMode === "pickup" && (
                  <div>
                    <label className="text-sm font-semibold text-foreground mb-2 flex items-center gap-2">
                      <Clock size={16} /> Select Pickup Slot
                    </label>
                    <select
                      value={pickupSlot}
                      onChange={(e) => setPickupSlot(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                    >
                      <option value="10am-2pm">10 AM - 2 PM</option>
                      <option value="2pm-4pm">2 PM - 4 PM</option>
                      <option value="4pm-8pm">4 PM - 8 PM</option>
                      <option value="8pm-10pm">8 PM - 10 PM</option>
                    </select>
                    <p className="text-xs text-muted-foreground mt-2 flex items-center gap-1">
                      <MapPin size={12} /> Sharma General Store, Indiranagar
                    </p>
                  </div>
                )}

                {/* Price Breakdown */}
                <div className="space-y-3 pb-6 border-b border-border">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{deliveryMode === "delivery" ? "Delivery" : "Pickup"}</span>
                    <span className="font-semibold">{deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Avg Discount</span>
                    <span className="font-semibold">{avgDiscount}% off</span>
                  </div>
                </div>

                {/* Total */}
                <div>
                  <div className="flex justify-between items-baseline mb-1">
                    <p className="font-bold text-foreground">Total</p>
                    <p className="text-3xl font-bold text-primary">₹{total.toFixed(0)}</p>
                  </div>
                  <p className="text-xs text-muted-foreground">Including all charges</p>
                </div>

                {/* Green Impact */}
                <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-lg">
                  <p className="text-xs font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <Leaf size={16} /> Environmental Impact
                  </p>
                  <ul className="text-xs text-green-700 space-y-2">
                    <li className="flex items-center gap-2">
                      <span>✓</span> {wasteSaved.toFixed(2)} kg waste saved
                    </li>
                    <li className="flex items-center gap-2">
                      <span>+</span> {greenPointsEarned} green points earned
                    </li>
                    <li className="flex items-center gap-2">
                      <span>✓</span> {(wasteSaved * 2).toFixed(1)} kg CO₂ prevented
                    </li>
                  </ul>
                </div>

                {/* Checkout Buttons */}
                <Link
                  href="/checkout"
                  className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition flex items-center justify-center gap-2"
                >
                  Proceed to Checkout <ArrowRight size={18} />
                </Link>

                <Link
                  href="/marketplace"
                  className="w-full border-2 border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition text-center"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
