"use client"

import { useState, useEffect, useContext } from "react"
import { useSearchParams, useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Package, Leaf, TrendingDown } from "lucide-react"

export default function OrdersPage() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchParams] = useSearchParams()
  const { token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }
    fetchOrders()
  }, [token])

  const fetchOrders = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/orders", {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (response.ok) {
        const data = await response.json()
        setOrders(data)
      }
    } catch (error) {
      console.error("Error fetching orders:", error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-50 text-yellow-800",
      confirmed: "bg-blue-50 text-blue-800",
      shipped: "bg-purple-50 text-purple-800",
      delivered: "bg-green-50 text-green-800",
      cancelled: "bg-red-50 text-red-800",
    }
    return colors[status] || "bg-neutral-50"
  }

  if (!token) return null

  return (
    <div className="py-8">
      <div className="max-w-container px-2">
        <h1 className="text-4xl font-bold mb-8">My Orders</h1>

        {searchParams.get("success") && (
          <div className="bg-green-50 border border-green-200 text-green-800 p-4 rounded mb-6 flex items-center gap-3">
            <span className="text-2xl">✓</span>
            <div>
              <p className="font-bold">Order placed successfully!</p>
              <p className="text-sm">Thank you for your purchase. You're saving the planet!</p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">Loading orders...</div>
        ) : orders.length === 0 ? (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto text-neutral-300 mb-4" />
            <p className="text-neutral-600 text-lg">No orders yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="card">
                <div className="grid grid-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-neutral-600">Order ID</p>
                    <p className="font-bold font-mono text-sm">{order._id.slice(0, 8)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Date</p>
                    <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Amount</p>
                    <p className="font-bold text-lg">₹{order.finalAmount.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-neutral-600">Status</p>
                    <span className={`badge ${getStatusColor(order.status)} text-xs font-bold`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-4">
                  <h3 className="font-bold mb-2">Items ({order.products.length})</h3>
                  <div className="space-y-2">
                    {order.products.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>
                          {item.product?.name} x{item.quantity}
                        </span>
                        <span className="font-bold">₹{(item.price * item.quantity).toFixed(0)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-3 gap-4 pt-4 border-t">
                  <div className="flex items-center gap-2">
                    <Leaf size={18} className="text-green-600" />
                    <div>
                      <p className="text-xs text-neutral-600">Waste Saved</p>
                      <p className="font-bold">{order.wasteSavedKg} kg</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingDown size={18} className="text-secondary" />
                    <div>
                      <p className="text-xs text-neutral-600">You Saved</p>
                      <p className="font-bold">₹{(order.totalAmount - order.finalAmount).toFixed(0)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="text-xs text-neutral-600">Green Points</p>
                      <p className="font-bold">{order.greenPointsEarned}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
