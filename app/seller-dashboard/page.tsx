"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Plus, Package, Upload, BarChart3, TrendingUp } from "lucide-react"

interface Product {
  _id: string
  name: string
  finalPrice: number
  quantity: number
  expiryDate: string
  discountPercentage: number
  verified: boolean
}

export default function SellerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [showBulkUpload, setShowBulkUpload] = useState(false)
  const [activeTab, setActiveTab] = useState("inventory")
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "soaps",
    originalPrice: "",
    expiryDate: "",
    quantity: "",
    sku: "",
  })
  const [bulkCSVData, setBulkCSVData] = useState("")
  const [loading, setLoading] = useState(true)
  const [csvError, setCsvError] = useState("")
  const router = useRouter()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.role !== "seller") {
      router.push("/login")
      return
    }

    setUser(userData)
    fetchProducts(userData.id)
  }, [router])

  const fetchProducts = async (sellerId: string) => {
    try {
      const res = await fetch(`/api/products?sellerId=${sellerId}`)
      if (res.ok) {
        const data = await res.json()
        setProducts(data)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: user.id,
          ...formData,
          originalPrice: Number.parseFloat(formData.originalPrice),
          quantity: Number.parseInt(formData.quantity),
        }),
      })

      if (res.ok) {
        const newProduct = await res.json()
        setProducts([...products, newProduct])
        setFormData({
          name: "",
          description: "",
          category: "soaps",
          originalPrice: "",
          expiryDate: "",
          quantity: "",
          sku: "",
        })
        setShowAddProduct(false)
      }
    } catch (error) {
      console.error("Failed to add product:", error)
      alert("Failed to add product")
    } finally {
      setLoading(false)
    }
  }

  const handleBulkUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setCsvError("")
    setLoading(true)

    try {
      const lines = bulkCSVData.trim().split("\n")
      if (lines.length < 2) {
        setCsvError("CSV must have header row and at least one product")
        setLoading(false)
        return
      }

      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase())
      const productsToUpload = []

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",").map((v) => v.trim())
        const product: any = {}

        headers.forEach((header, idx) => {
          product[header] = values[idx]
        })

        productsToUpload.push({
          name: product.name,
          description: product.description || "",
          category: product.category || "soaps",
          originalPrice: Number.parseFloat(product.originalprice),
          quantity: Number.parseInt(product.quantity),
          expiryDate: product.expirydate,
          sku: product.sku || "",
          image: product.image || "",
        })
      }

      const res = await fetch("/api/products/bulk-upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId: user.id, products: productsToUpload }),
      })

      if (res.ok) {
        alert("Products uploaded successfully!")
        setBulkCSVData("")
        setShowBulkUpload(false)
        fetchProducts(user.id)
      }
    } catch (error) {
      console.error("Bulk upload error:", error)
      setCsvError("Failed to upload products. Please check CSV format.")
    } finally {
      setLoading(false)
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  const totalRevenue = products.reduce((sum, p) => sum + p.finalPrice * p.quantity, 0)
  const totalProducts = products.length
  const avgDiscount =
    products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.discountPercentage, 0) / products.length) : 0
  const verifiedProducts = products.filter((p) => p.verified).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Seller Dashboard</h1>
            <p className="text-sm text-muted-foreground">{user?.name}</p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowAddProduct(!showAddProduct)
                setShowBulkUpload(false)
              }}
              className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
            >
              <Plus size={20} /> Add Product
            </button>
            <button
              onClick={() => {
                setShowBulkUpload(!showBulkUpload)
                setShowAddProduct(false)
              }}
              className="flex items-center gap-2 border-2 border-primary text-primary px-4 py-2 rounded-lg font-semibold hover:bg-primary/10 transition"
            >
              <Upload size={20} /> Bulk Upload
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Total Products</p>
            <p className="text-3xl font-bold text-primary">{totalProducts}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Total Revenue</p>
            <p className="text-3xl font-bold text-primary">₹{totalRevenue.toFixed(0)}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Avg Discount</p>
            <p className="text-3xl font-bold text-accent">{avgDiscount}%</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Verified</p>
            <p className="text-3xl font-bold text-green-600">
              {verifiedProducts}/{totalProducts}
            </p>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddProduct && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-6">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Product Name"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                required
              />
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="SKU (Optional)"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
              />
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
              >
                <option value="soaps">Soaps</option>
                <option value="toothpaste">Toothpaste</option>
                <option value="shampoos">Shampoos</option>
                <option value="detergents">Detergents</option>
                <option value="cleaners">Cleaners</option>
                <option value="dishwash">Dishwash</option>
                <option value="baby-care">Baby Care</option>
              </select>
              <input
                type="number"
                name="originalPrice"
                value={formData.originalPrice}
                onChange={handleInputChange}
                placeholder="Original Price (MRP)"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                required
              />
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                placeholder="Quantity Available"
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                required
              />
              <input
                type="date"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
                required
              />
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Product Description"
                className="md:col-span-2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground"
              />
              <div className="md:col-span-2 flex gap-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? "Adding..." : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddProduct(false)}
                  className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-bold hover:bg-primary/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Bulk Upload Form */}
        {showBulkUpload && (
          <div className="bg-white p-6 rounded-xl border border-slate-200 mb-12">
            <h2 className="text-2xl font-bold text-foreground mb-4">Bulk Upload Products</h2>
            <p className="text-muted-foreground text-sm mb-4">
              Paste CSV data with columns: name, description, category, originalPrice, quantity, expiryDate, sku, image
            </p>
            <form onSubmit={handleBulkUpload}>
              <textarea
                value={bulkCSVData}
                onChange={(e) => setBulkCSVData(e.target.value)}
                placeholder="name,description,category,originalPrice,quantity,expiryDate,sku,image
Lux Soap,Premium soap,soaps,50,100,2025-03-15,LUX001,https://example.com/image.jpg"
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-white text-foreground font-mono text-sm"
                rows={8}
                required
              />
              {csvError && <p className="text-red-600 text-sm mt-2">{csvError}</p>}
              <div className="flex gap-3 mt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:bg-primary/90 transition disabled:opacity-50"
                >
                  {loading ? "Uploading..." : "Upload Products"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBulkUpload(false)}
                  className="flex-1 border-2 border-primary text-primary py-2 rounded-lg font-bold hover:bg-primary/5 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b border-slate-200">
          <button
            onClick={() => setActiveTab("inventory")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "inventory"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Package size={18} className="inline mr-2" /> Inventory
          </button>
          <button
            onClick={() => setActiveTab("analytics")}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === "analytics"
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <BarChart3 size={18} className="inline mr-2" /> Analytics
          </button>
        </div>

        {/* Inventory Tab */}
        {activeTab === "inventory" && (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-200">
              <h2 className="text-xl font-bold text-foreground">Your Products</h2>
            </div>

            {products.length === 0 ? (
              <div className="p-12 text-center">
                <Package size={48} className="mx-auto text-muted-foreground mb-4 opacity-50" />
                <p className="text-muted-foreground">No products added yet</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Product</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">MRP</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Price</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Discount</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Qty</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Expiry</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map((product) => {
                      const daysLeft = Math.floor(
                        (new Date(product.expiryDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24),
                      )
                      return (
                        <tr key={product._id} className="border-b border-slate-200 hover:bg-slate-50">
                          <td className="px-6 py-4 font-semibold text-foreground">{product.name}</td>
                          <td className="px-6 py-4 text-muted-foreground">
                            ₹{(product.finalPrice / (1 - product.discountPercentage / 100)).toFixed(0)}
                          </td>
                          <td className="px-6 py-4 text-primary font-bold">₹{product.finalPrice}</td>
                          <td className="px-6 py-4">
                            <span className="text-accent font-bold">{product.discountPercentage}%</span>
                          </td>
                          <td className="px-6 py-4 font-semibold">{product.quantity}</td>
                          <td className="px-6 py-4 text-sm text-muted-foreground">{daysLeft} days</td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                                product.verified ? "bg-green-50 text-green-700" : "bg-yellow-50 text-yellow-700"
                              }`}
                            >
                              {product.verified ? "✓ Verified" : "⏳ Pending"}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp size={20} className="text-primary" /> Revenue Breakdown
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Total Inventory Value</p>
                  <p className="text-2xl font-bold text-primary">₹{totalRevenue.toFixed(0)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Average Product Value</p>
                  <p className="text-2xl font-bold text-accent">
                    ₹{totalProducts > 0 ? (totalRevenue / totalProducts).toFixed(0) : 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="text-lg font-bold text-foreground mb-4">Performance Metrics</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Verification Rate</p>
                  <p className="font-bold text-primary">
                    {totalProducts > 0 ? Math.round((verifiedProducts / totalProducts) * 100) : 0}%
                  </p>
                </div>
                <div className="flex justify-between">
                  <p className="text-muted-foreground">Average Discount Offered</p>
                  <p className="font-bold text-accent">{avgDiscount}%</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
