"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Package, Leaf, ArrowRight, ChevronRight } from "lucide-react"

interface Order {
  _id: string
  items: any[]
  totalAmount: number
  status: string
  createdAt: string
  greenPointsEarned: number
  wasteSaved: number
  deliveryMode: string
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (!userData.id) {
      router.push("/login")
      return
    }

    setUser(userData)
    const fetchOrders = async () => {
      try {
        const res = await fetch(`/api/orders?buyerId=${userData.id}`)
        if (res.ok) {
          const data = await res.json()
          setOrders(data)
        }
      } catch (error) {
        console.error("Failed to fetch orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-50 border-yellow-200 text-yellow-700"
      case "confirmed":
        return "bg-blue-50 border-blue-200 text-blue-700"
      case "shipped":
        return "bg-purple-50 border-purple-200 text-purple-700"
      case "delivered":
        return "bg-green-50 border-green-200 text-green-700"
      default:
        return "bg-slate-50 border-slate-200 text-slate-700"
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading orders...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">My Orders</h1>
          <p className="text-muted-foreground">{orders.length} orders placed</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
            <h2 className="text-2xl font-bold text-foreground mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start shopping to place your first order</p>
            <Link
              href="/marketplace"
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
            >
              Shop Now <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Order ID</p>
                    <p className="font-mono font-semibold text-foreground">{order._id.slice(-8).toUpperCase()}</p>
                  </div>
                  <div
                    className={`px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(order.status)}`}
                  >
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Order Date</p>
                    <p className="font-semibold text-foreground">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>

                <div className="mb-4 pb-4 border-b border-slate-200">
                  {order.items.slice(0, 2).map((item, i) => (
                    <p key={i} className="text-sm text-muted-foreground">
                      {item.name} x{item.quantity}
                    </p>
                  ))}
                  {order.items.length > 2 && (
                    <p className="text-sm text-primary font-semibold">+{order.items.length - 2} more items</p>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Total Amount</p>
                    <p className="font-bold text-primary">₹{order.totalAmount.toFixed(0)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground flex items-center gap-1">
                      <Leaf size={14} /> Waste Saved
                    </p>
                    <p className="font-bold text-green-600">{order.wasteSaved.toFixed(2)} kg</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Green Points</p>
                    <p className="font-bold text-secondary">{order.greenPointsEarned}</p>
                  </div>
                </div>

                <button className="w-full border border-primary text-primary py-2 rounded-lg font-semibold hover:bg-primary/5 transition flex items-center justify-center gap-2">
                  View Details <ChevronRight size={18} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
