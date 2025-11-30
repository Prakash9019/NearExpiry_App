"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Shield, Users, Package, BarChart3, CheckCircle, XCircle } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function AdminPanel() {
  const [user, setUser] = useState<any>(null)
  const [activeTab, setActiveTab] = useState("verification")
  const [pendingVerifications, setPendingVerifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    const checkAdmin = async () => {
      const userStr = localStorage.getItem("user")
      const user = userStr ? JSON.parse(userStr) : null

      if (!user || user.role !== "admin") {
        window.location.href = "/login"
        return
      }
      setUser(user)
      fetchPendingVerifications()
    }
    checkAdmin()
  }, [])

  const fetchPendingVerifications = async () => {
  setLoading(true)
  try {
    const response = await fetch("/api/admin/verify-seller?status=pending", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })

    if (!response.ok) {
      // attempt to read api error message
      const errBody = await response.json().catch(() => ({ error: "Unknown error" }))
      console.error("[v0] fetch verifications bad response:", response.status, errBody)
      throw new Error(errBody?.error || "Failed to fetch verifications")
    }

    const data = await response.json()
    console.log("[v0] Fetched sellers:", data)
    setPendingVerifications(Array.isArray(data) ? data : [])
    setError("")
  } catch (err: any) {
    console.error("[v0] Verification fetch error:", err)
    setError(err.message || "Failed to load verifications")
    setPendingVerifications([])
  } finally {
    setLoading(false)
  }
}

const handleVerifySeller = async (sellerId: string, approved: boolean) => {
  try {
    // optimistic update: mark it removed from pending list
    setPendingVerifications(prev => prev.filter(s => s._id !== sellerId))
    const response = await fetch("/api/admin/verify-seller", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sellerId,
        approved,
        rejectionReason: approved ? null : "Documentation incomplete",
      }),
    })

    if (!response.ok) {
      const err = await response.json().catch(() => ({ error: "Verification failed" }))
      throw new Error(err?.error || "Verification failed")
    }

    // optionally update local item with returned verification if you want to show history
    const result = await response.json()
    console.log("[v0] verify result:", result)
    setError("")
    // no need to re-fetch everything here; it's already removed optimistically
  } catch (error: any) {
    console.error("[v0] Verification error:", error)
    setError(error.message || "Failed to verify seller")
    // re-fetch to recover state
    fetchPendingVerifications()
  }
}


  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted-foreground">Loading admin panel...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navbar />

      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Shield size={32} className="text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Panel</h1>
              <p className="text-muted-foreground">Platform Management & Verification</p>
            </div>
          </div>
          <Link href="/" className="text-primary font-semibold hover:underline">
            ← Back Home
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          {[
            { id: "verification", label: "Seller Verification", icon: Users },
            { id: "products", label: "Product Moderation", icon: Package },
            { id: "analytics", label: "Analytics", icon: BarChart3 },
          ].map((tab) => {
            const Icon = tab.icon
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-semibold border-b-2 transition flex items-center gap-2 ${
                  activeTab === tab.id
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon size={18} /> {tab.label}
              </button>
            )
          })}
        </div>

        {error && <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg mb-6">{error}</div>}

        {/* Verification Tab */}
        {activeTab === "verification" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-foreground">
                Pending Seller Verifications ({pendingVerifications.length})
              </h2>
            </div>

            {loading ? (
              <div className="p-12 text-center">
                <p className="text-muted-foreground">Loading verifications...</p>
              </div>
            ) : pendingVerifications.length === 0 ? (
              <div className="p-12 text-center">
                <CheckCircle size={48} className="text-green-600 mx-auto mb-4" />
                <p className="text-muted-foreground">All sellers are verified! No pending requests.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Company</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Email</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">GST</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingVerifications.map((seller) => (
                      <tr key={seller._id} className="border-b border-slate-200 hover:bg-slate-50">
                        <td className="px-6 py-4 font-semibold text-foreground">{seller.companyName || "N/A"}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{seller.email}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{seller.gstNumber || "N/A"}</td>
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                            ⏳ {seller.verificationStatus || "Pending"}
                          </span>
                        </td>
                        <td className="px-6 py-4 flex gap-2">
                          <button
                            onClick={() => handleVerifySeller(seller._id, true)}
                            className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-green-700 transition"
                          >
                            <CheckCircle size={16} /> Approve
                          </button>
                          <button
                            onClick={() => handleVerifySeller(seller._id, false)}
                            className="flex items-center gap-1 bg-red-600 text-white px-3 py-1 rounded-lg text-sm font-semibold hover:bg-red-700 transition"
                          >
                            <XCircle size={16} /> Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <Package size={48} className="text-primary mx-auto mb-4" />
            <h3 className="text-lg font-bold text-foreground mb-2">Product Moderation Queue</h3>
            <p className="text-muted-foreground">Product moderation system coming soon</p>
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-foreground mb-4">Platform Metrics</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total Sellers</p>
                  <p className="text-3xl font-bold text-primary">--</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total Products</p>
                  <p className="text-3xl font-bold text-accent">--</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-foreground mb-4">Waste Saved</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Total kg Waste Prevented</p>
                  <p className="text-3xl font-bold text-green-600">--</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
