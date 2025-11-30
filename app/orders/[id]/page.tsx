"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Package, Truck, CheckCircle, AlertCircle } from "lucide-react"

export default function OrderDetail() {
  const params = useParams()
  const orderId = params.id as string
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [disputing, setDisputing] = useState(false)
  const [returnReason, setReturnReason] = useState("")

  useEffect(() => {
    fetchOrder()
  }, [orderId])

  const fetchOrder = async () => {
    try {
      const response = await fetch(`/api/orders/${orderId}`)
      if (response.ok) {
        const data = await response.json()
        setOrder(data)
      }
    } catch (error) {
      console.error("Failed to fetch order:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleReturnClaim = async (e: React.FormEvent) => {
    e.preventDefault()
    setDisputing(true)

    try {
      const response = await fetch(`/api/orders/${orderId}/return/claim`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: returnReason }),
      })

      if (response.ok) {
        alert("Return claim submitted successfully!")
        setReturnReason("")
        fetchOrder()
      }
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setDisputing(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading order details...</p>
      </div>
    )
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Order not found</p>
          <Link href="/orders" className="text-primary font-semibold">
            ← Back to Orders
          </Link>
        </div>
      </div>
    )
  }

  const statusSteps = [
    { status: "pending", label: "Order Placed", icon: Package },
    { status: "confirmed", label: "Confirmed", icon: CheckCircle },
    { status: "shipped", label: "Shipped", icon: Truck },
    { status: "delivered", label: "Delivered", icon: CheckCircle },
  ]

  const currentStepIndex = statusSteps.findIndex((s) => s.status === order.status)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/orders" className="text-primary font-semibold mb-4 inline-block">
            ← Back to Orders
          </Link>
          <h1 className="text-3xl font-bold text-foreground">Order #{order._id.slice(-6)}</h1>
          <p className="text-muted-foreground">Order placed on {new Date(order.createdAt).toLocaleDateString()}</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Status Timeline */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-6">Order Status</h2>
          <div className="flex justify-between relative">
            {statusSteps.map((step, idx) => {
              const Icon = step.icon
              const isCompleted = idx <= currentStepIndex
              return (
                <div key={step.status} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mb-3 transition ${
                      isCompleted ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    <Icon size={24} />
                  </div>
                  <p className="text-sm font-semibold text-center">{step.label}</p>
                  {idx < statusSteps.length - 1 && (
                    <div
                      className={`absolute top-6 left-1/2 w-1/3 h-1 mt-0 ${
                        idx < currentStepIndex ? "bg-primary" : "bg-muted"
                      }`}
                      style={{ marginLeft: idx > 0 ? "-33.33%" : "0" }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-6">Order Items</h2>
          <div className="space-y-4">
            {order.items.map((item: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-200">
                <div>
                  <p className="font-semibold text-foreground">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">₹{(item.price * item.quantity).toFixed(0)}</p>
                  {item.discount > 0 && (
                    <p className="text-xs text-accent">-₹{(item.discount * item.quantity).toFixed(0)}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 mb-8">
          <h2 className="text-lg font-bold text-foreground mb-6">Order Summary</h2>
          <div className="space-y-3">
            <div className="flex justify-between">
              <p className="text-muted-foreground">Subtotal</p>
              <p className="font-semibold text-foreground">₹{(order.totalAmount * 1.05).toFixed(0)}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-muted-foreground">Discount</p>
              <p className="font-semibold text-accent">-₹{(order.totalAmount * 1.05 - order.totalAmount).toFixed(0)}</p>
            </div>
            <div className="border-t border-slate-200 pt-3 flex justify-between">
              <p className="font-bold text-foreground">Total Amount</p>
              <p className="font-bold text-primary text-lg">₹{order.totalAmount.toFixed(0)}</p>
            </div>
          </div>
        </div>

        {/* Return Claim */}
        {order.status === "delivered" && (
          <div className="bg-white p-8 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-accent" /> Request Return/Refund
            </h2>
            <form onSubmit={handleReturnClaim}>
              <textarea
                value={returnReason}
                onChange={(e) => setReturnReason(e.target.value)}
                placeholder="Describe the issue or reason for return..."
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground mb-4"
                rows={4}
                required
              />
              <button
                type="submit"
                disabled={disputing}
                className="bg-accent text-accent-foreground px-6 py-2 rounded-lg font-semibold hover:bg-accent/90 transition disabled:opacity-50"
              >
                {disputing ? "Submitting..." : "Submit Claim"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
