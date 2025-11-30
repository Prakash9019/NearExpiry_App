"use client"

import type React from "react"

import { type FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { MapPin, Truck, Package, CheckCircle } from "lucide-react"

export default function CheckoutPage() {
  const [cartItems, setCartItems] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    deliveryMode: "delivery",
    deliveryAddress: "",
    phone: "",
    paymentMethod: "cod",
  })
  const [loading, setLoading] = useState(false)
  const [orderPlaced, setOrderPlaced] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    setCartItems(cart)
    setUser(userData)

    if (cart.length === 0) {
      router.push("/cart")
    }
  }, [router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!user?.id) {
      router.push("/login")
      return
    }

    setLoading(true)

    try {
      const orderData = {
        buyerId: user.id,
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.finalPrice,
          discount: item.discountPercentage,
        })),
        totalAmount: cartItems.reduce((sum: number, item: any) => sum + item.finalPrice * item.quantity, 0),
        deliveryMode: formData.deliveryMode,
        deliveryAddress: formData.deliveryAddress,
      }

      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      })

      if (res.ok) {
        localStorage.removeItem("cart")
        setOrderPlaced(true)
        setTimeout(() => router.push("/orders"), 3000)
      }
    } catch (error) {
      console.error("Order placement failed:", error)
      alert("Failed to place order")
    } finally {
      setLoading(false)
    }
  }

  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <CheckCircle size={64} className="mx-auto text-green-600 mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Order Placed Successfully!</h1>
          <p className="text-muted-foreground mb-8">Redirecting to your orders...</p>
        </div>
      </div>
    )
  }

  const subtotal = cartItems.reduce((sum: number, item: any) => sum + item.finalPrice * item.quantity, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground">Checkout</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Delivery Mode */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Truck size={20} /> Delivery Mode
                </h2>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="delivery"
                      checked={formData.deliveryMode === "delivery"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-foreground">Home Delivery (Free)</span>
                  </label>
                  <label className="flex items-center gap-3 p-3 border border-slate-300 rounded-lg cursor-pointer hover:bg-slate-50">
                    <input
                      type="radio"
                      name="deliveryMode"
                      value="pickup"
                      checked={formData.deliveryMode === "pickup"}
                      onChange={handleChange}
                      className="w-4 h-4"
                    />
                    <span className="font-semibold text-foreground">Pickup from Store (Free)</span>
                  </label>
                </div>
              </div>

              {/* Address */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <MapPin size={20} /> Delivery Address
                </h2>
                <textarea
                  name="deliveryAddress"
                  value={formData.deliveryAddress}
                  onChange={handleChange}
                  placeholder="Enter your full delivery address"
                  className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                  rows={4}
                  required
                />
              </div>

              {/* Contact */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-foreground mb-4">Contact Information</h2>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Your phone number"
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                  required
                />
              </div>

              {/* Payment Method */}
              <div className="bg-white p-6 rounded-xl border border-slate-200">
                <h2 className="text-xl font-bold text-foreground mb-4">Payment Method</h2>
                <label className="flex items-center gap-3 p-3 border border-primary rounded-lg bg-primary/5">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={formData.paymentMethod === "cod"}
                    onChange={handleChange}
                    className="w-4 h-4"
                  />
                  <span className="font-semibold text-foreground">Cash on Delivery</span>
                </label>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50 text-lg"
              >
                {loading ? "Placing Order..." : "Place Order"}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div>
            <div className="bg-white p-6 rounded-xl border border-slate-200 sticky top-4">
              <h3 className="font-bold text-foreground text-lg mb-6 flex items-center gap-2">
                <Package size={20} /> Order Summary
              </h3>

              <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                  <div key={item._id} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} x{item.quantity}
                    </span>
                    <span className="font-semibold">₹{(item.finalPrice * item.quantity).toFixed(0)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 pt-6 space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery</span>
                  <span className="font-semibold text-green-600">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold bg-primary/5 p-3 rounded-lg">
                  <span>Total</span>
                  <span className="text-primary">₹{subtotal.toFixed(0)}</span>
                </div>
              </div>

              <Link
                href="/cart"
                className="w-full mt-4 text-primary text-center text-sm hover:text-primary/80 transition"
              >
                Back to Cart
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
