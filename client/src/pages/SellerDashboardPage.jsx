"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Plus, BarChart3, Package, DollarSign } from "lucide-react"

export default function SellerDashboardPage() {
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [showAddProduct, setShowAddProduct] = useState(false)
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    category: "soap",
    description: "",
    originalPrice: "",
    discountPercentage: "",
    quantity: "",
    expiryDate: "",
    images: [],
  })

  useEffect(() => {
    if (!token) {
      navigate("/login")
      return
    }
    if (user?.role !== "seller") {
      navigate("/marketplace")
      return
    }
    fetchSellerData()
  }, [token, user])

  const fetchSellerData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch("http://localhost:5000/api/seller/my-products", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/seller/my-sales", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (productsRes.ok) {
        const productsData = await productsRes.json()
        setProducts(productsData)
      }

      if (ordersRes.ok) {
        const ordersData = await ordersRes.json()
        setOrders(ordersData)
      }
    } catch (error) {
      console.error("Error fetching seller data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          originalPrice: Number.parseFloat(formData.originalPrice),
          discountPercentage: Number.parseFloat(formData.discountPercentage),
          quantity: Number.parseInt(formData.quantity),
          expiryDate: formData.expiryDate,
        }),
      })

      if (response.ok) {
        setFormData({
          name: "",
          category: "soap",
          description: "",
          originalPrice: "",
          discountPercentage: "",
          quantity: "",
          expiryDate: "",
          images: [],
        })
        setShowAddProduct(false)
        fetchSellerData()
      }
    } catch (error) {
      console.error("Error adding product:", error)
      alert("Error adding product")
    }
  }

  const totalRevenue = orders.reduce((sum, order) => sum + order.finalAmount, 0)
  const totalSold = products.reduce((sum, p) => sum + (p.quantity === 0 ? 1 : 0), 0)

  return (
    <div className="py-8">
      <div className="max-w-container px-2">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Seller Dashboard</h1>
          <button
            onClick={() => setShowAddProduct(!showAddProduct)}
            className="btn btn-secondary flex items-center gap-2"
          >
            <Plus size={20} />
            Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-4 gap-4 mb-8">
          <div className="card">
            <div className="flex items-center gap-3">
              <Package className="text-secondary" size={32} />
              <div>
                <p className="text-sm text-neutral-600">Total Products</p>
                <p className="text-2xl font-bold">{products.length}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <BarChart3 className="text-accent" size={32} />
              <div>
                <p className="text-sm text-neutral-600">Items Sold</p>
                <p className="text-2xl font-bold">{totalSold}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <DollarSign className="text-success" size={32} />
              <div>
                <p className="text-sm text-neutral-600">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue.toFixed(0)}</p>
              </div>
            </div>
          </div>
          <div className="card">
            <div className="flex items-center gap-3">
              <span className="text-3xl">📦</span>
              <div>
                <p className="text-sm text-neutral-600">Orders</p>
                <p className="text-2xl font-bold">{orders.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Product Form */}
        {showAddProduct && (
          <div className="card mb-8 bg-neutral-50">
            <h2 className="text-2xl font-bold mb-4">Add New Product</h2>
            <form onSubmit={handleAddProduct} className="grid grid-2 gap-4">
              <div className="input-group">
                <label>Product Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Organic Soap"
                  required
                />
              </div>

              <div className="input-group">
                <label>Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="soap">Soap</option>
                  <option value="toothpaste">Toothpaste</option>
                  <option value="shampoo">Shampoo</option>
                  <option value="detergent">Detergent</option>
                  <option value="cleaner">Cleaner</option>
                  <option value="baby-care">Baby Care</option>
                  <option value="cosmetics">Cosmetics</option>
                </select>
              </div>

              <div className="input-group col-span-2">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Product description..."
                  rows="3"
                />
              </div>

              <div className="input-group">
                <label>Original Price (₹)</label>
                <input
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                  placeholder="199"
                  step="0.01"
                  required
                />
              </div>

              <div className="input-group">
                <label>Discount (%)</label>
                <input
                  type="number"
                  value={formData.discountPercentage}
                  onChange={(e) => setFormData({ ...formData, discountPercentage: e.target.value })}
                  placeholder="30"
                  min="1"
                  max="90"
                  required
                />
              </div>

              <div className="input-group">
                <label>Quantity</label>
                <input
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  placeholder="100"
                  required
                />
              </div>

              <div className="input-group">
                <label>Expiry Date</label>
                <input
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                  required
                />
              </div>

              <button type="submit" className="btn btn-secondary col-span-2">
                Add Product
              </button>
            </form>
          </div>
        )}

        {/* Products List */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">My Products</h2>
          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : products.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-neutral-600">No products yet. Add your first product!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {products.map((product) => (
                <div key={product._id} className="card">
                  <div className="grid grid-4 gap-4 items-center">
                    <div>
                      <p className="font-bold text-lg">{product.name}</p>
                      <p className="text-sm text-neutral-600">{product.category}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Price</p>
                      <p className="font-bold">₹{product.currentPrice.toFixed(0)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Stock</p>
                      <p className={`font-bold ${product.quantity > 0 ? "text-green-600" : "text-red-600"}`}>
                        {product.quantity} units
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Expires in</p>
                      <p className="font-bold">{product.daysUntilExpiry} days</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Orders */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Recent Orders</h2>
          {orders.length === 0 ? (
            <div className="card text-center py-8">
              <p className="text-neutral-600">No orders yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.slice(0, 5).map((order) => (
                <div key={order._id} className="card">
                  <div className="grid grid-4 gap-4 items-center">
                    <div>
                      <p className="font-bold">{order.buyer?.name}</p>
                      <p className="text-sm text-neutral-600">{order.buyer?.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Items</p>
                      <p className="font-bold">{order.products.length}</p>
                    </div>
                    <div>
                      <p className="text-sm text-neutral-600">Amount</p>
                      <p className="font-bold">₹{order.finalAmount.toFixed(0)}</p>
                    </div>
                    <div>
                      <span
                        className={`badge badge-${order.status === "pending" ? "warning" : order.status === "delivered" ? "success" : "info"}`}
                      >
                        {order.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
