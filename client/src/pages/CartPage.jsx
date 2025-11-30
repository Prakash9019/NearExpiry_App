"use client"

import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { Trash2, ArrowRight } from "lucide-react"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"

export default function CartPage() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useContext(CartContext)
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [deliveryType, setDeliveryType] = useState("delivery")
  const [address, setAddress] = useState({ street: "", city: "", state: "", pincode: "" })
  const [loading, setLoading] = useState(false)

  const subtotal = cart.reduce((sum, item) => sum + item.currentPrice * item.quantity, 0)
  const discount = cart.reduce((sum, item) => {
    const originalTotal = item.originalPrice * item.quantity
    const discountedTotal = item.currentPrice * item.quantity
    return sum + (originalTotal - discountedTotal)
  }, 0)
  const tax = Math.round(subtotal * 0.05)
  const total = subtotal + tax

  const handleCheckout = async () => {
    if (!token) {
      navigate("/login")
      return
    }

    if (cart.length === 0) {
      alert("Cart is empty!")
      return
    }

    if (deliveryType === "delivery" && (!address.street || !address.city || !address.pincode)) {
      alert("Please fill in delivery address")
      return
    }

    try {
      setLoading(true)
      const response = await fetch("http://localhost:5000/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          products: cart.map((item) => ({
            productId: item._id,
            quantity: item.quantity,
          })),
          deliveryType,
          shippingAddress: address,
        }),
      })

      if (response.ok) {
        const order = await response.json()
        clearCart()
        navigate(`/orders?success=${order._id}`)
      } else {
        alert("Error placing order")
      }
    } catch (error) {
      console.error("Checkout error:", error)
      alert("Error placing order")
    } finally {
      setLoading(false)
    }
  }

  if (cart.length === 0) {
    return (
      <div className="py-20">
        <div className="max-w-container px-2 text-center">
          <div className="text-6xl mb-4">🛒</div>
          <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
          <p className="text-neutral-600 mb-8">Start shopping to add items to your cart</p>
          <Link to="/marketplace" className="btn btn-secondary">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8">
      <div className="max-w-container px-2">
        <h1 className="text-4xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-2 gap-8">
          {/* Cart Items */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Items ({cart.length})</h2>
            <div className="space-y-4 mb-6">
              {cart.map((item) => (
                <div key={item._id} className="card">
                  <div className="flex gap-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-neutral-200 to-neutral-300 rounded flex items-center justify-center text-4xl flex-shrink-0">
                      {["🧼", "🪥", "🧴"][(Math.random() * 3) | 0]}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-lg">{item.name}</h3>
                      <p className="text-sm text-neutral-600">{item.category}</p>
                      <div className="flex gap-2 mt-2">
                        <span className="text-lg font-bold text-secondary">₹{item.currentPrice}</span>
                        <span className="line-through text-neutral-400">₹{item.originalPrice}</span>
                      </div>
                    </div>
                    <div className="flex flex-col items-end justify-between">
                      <div className="flex gap-2">
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity - 1)}
                          className="btn btn-outline btn-small"
                        >
                          -
                        </button>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => updateQuantity(item._id, Number.parseInt(e.target.value) || 1)}
                          className="w-12 text-center"
                          min="1"
                        />
                        <button
                          onClick={() => updateQuantity(item._id, item.quantity + 1)}
                          className="btn btn-outline btn-small"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="btn btn-outline btn-small text-danger"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Checkout */}
          <div>
            <div className="card bg-neutral-50 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6 pb-6 border-b">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(0)}</span>
                </div>
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
                  <span>-₹{discount.toFixed(0)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (5%)</span>
                  <span>₹{tax}</span>
                </div>
              </div>

              <div className="flex justify-between items-center mb-6 text-xl font-bold">
                <span>Total</span>
                <span className="text-secondary">₹{total.toFixed(0)}</span>
              </div>

              {/* Delivery Options */}
              <div className="input-group mb-6">
                <label>Delivery Type</label>
                <select value={deliveryType} onChange={(e) => setDeliveryType(e.target.value)}>
                  <option value="delivery">Home Delivery</option>
                  <option value="pickup">Pickup Point</option>
                </select>
              </div>

              {/* Address */}
              {deliveryType === "delivery" && (
                <div className="space-y-3 mb-6">
                  <div className="input-group">
                    <label>Street Address</label>
                    <input
                      type="text"
                      value={address.street}
                      onChange={(e) => setAddress({ ...address, street: e.target.value })}
                      placeholder="123 Main St"
                    />
                  </div>
                  <div className="input-group">
                    <label>City</label>
                    <input
                      type="text"
                      value={address.city}
                      onChange={(e) => setAddress({ ...address, city: e.target.value })}
                      placeholder="New York"
                    />
                  </div>
                  <div className="grid grid-2 gap-3">
                    <div className="input-group">
                      <label>State</label>
                      <input
                        type="text"
                        value={address.state}
                        onChange={(e) => setAddress({ ...address, state: e.target.value })}
                        placeholder="NY"
                      />
                    </div>
                    <div className="input-group">
                      <label>Pincode</label>
                      <input
                        type="text"
                        value={address.pincode}
                        onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                        placeholder="10001"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Savings Display */}
              <div className="card bg-green-50 border border-green-200 mb-6">
                <p className="font-bold text-green-900">You're saving ₹{discount.toFixed(0)}!</p>
                <p className="text-sm text-green-800">Plus earning 50 green points</p>
              </div>

              <button
                onClick={handleCheckout}
                disabled={loading || !token}
                className="btn btn-primary w-full flex justify-center gap-2"
              >
                {loading ? "Processing..." : "Place Order"}
                <ArrowRight size={18} />
              </button>

              {!token && (
                <p className="text-sm text-neutral-600 text-center mt-4">
                  <Link to="/login" className="text-secondary font-bold">
                    Login
                  </Link>{" "}
                  to checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
