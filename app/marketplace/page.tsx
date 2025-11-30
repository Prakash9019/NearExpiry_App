"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ShoppingCart, Leaf, Filter, X, MapPin, Calendar, TrendingDown } from "lucide-react"
import Navbar from "@/components/Navbar"

interface Product {
  _id: string
  name: string
  description: string
  category: string
  originalPrice: number
  finalPrice: number
  discountPercentage: number
  expiryDate: string
  image: string
  sellerId: { name: string }
  rating: number
  quantity: number
}

export default function Marketplace() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("")
  const [sortBy, setSortBy] = useState<string>("newest")
  const [expiryFilter, setExpiryFilter] = useState<string>("")
  const [distanceFilter, setDistanceFilter] = useState<number>(10)
  const [loading, setLoading] = useState(true)
  const [showFilters, setShowFilters] = useState(false)
  const [cart, setCart] = useState<any[]>([])

  const categories = ["soaps", "toothpaste", "shampoos", "detergents", "cleaners", "dishwash", "baby-care"]

  useEffect(() => {
    const cartStr = localStorage.getItem("cart")
    if (cartStr) {
      setCart(JSON.parse(cartStr))
    }
  }, [])

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const query = new URLSearchParams()
        if (selectedCategory) query.append("category", selectedCategory)
        query.append("sortBy", sortBy)
        if (expiryFilter) query.append("expiry", expiryFilter)
        query.append("distance", distanceFilter.toString())

        const res = await fetch(`/api/products?${query}`)
        const data = await res.json()
        setProducts(data)
        setFilteredProducts(data)
      } catch (error) {
        console.error("Failed to fetch products:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProducts()
  }, [selectedCategory, sortBy, expiryFilter, distanceFilter])

  const getDealBadge = (discount: number) => {
    if (discount >= 50) return { text: "Hot Deal", className: "deal-badge-hot", icon: "🔥" }
    if (discount >= 30) return { text: "Good Deal", className: "deal-badge-good", icon: "⭐" }
    return { text: "Fair Deal", className: "deal-badge-fair", icon: "✓" }
  }

  const daysUntilExpiry = (date: string) => {
    const today = new Date()
    const expiry = new Date(date)
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const getExpiryColor = (days: number) => {
    if (days <= 10) return "bg-red-100 text-red-700"
    if (days <= 30) return "bg-orange-100 text-orange-700"
    return "bg-green-100 text-green-700"
  }

  const getExpiryLabel = (days: number) => {
    if (days <= 10) return "🔴 Urgent"
    if (days <= 30) return "🟠 Soon"
    return "🟢 Safe"
  }

  const addToCart = (product: Product) => {
    const existingItem = cart.find((item) => item._id === product._id)
    const updatedCart = existingItem
      ? cart.map((item) => (item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item))
      : [...cart, { ...product, quantity: 1 }]
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))
    alert("Added to cart!")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Marketplace</h1>
              <p className="text-muted-foreground text-sm md:text-base flex items-center gap-2">
                <Leaf size={16} className="text-green-600" /> Browse discounted household essentials & save the planet
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="md:hidden flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                <Filter size={18} /> Filters
              </button>
              <Link href="/cart" className="relative">
                <div className="bg-primary text-primary-foreground p-2 md:p-3 rounded-lg hover:bg-primary/90 transition">
                  <ShoppingCart size={20} />
                  {cart.length > 0 && (
                    <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                      {cart.length}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row gap-6 md:gap-8">
          <div className={`w-full md:w-72 flex-shrink-0 ${showFilters ? "block" : "hidden md:block"}`}>
            <div className="bg-card p-6 rounded-lg border border-border sticky top-24">
              <div className="flex justify-between items-center mb-4 md:hidden">
                <h3 className="font-bold text-foreground flex items-center gap-2">
                  <Filter size={18} /> Filters
                </h3>
                <button onClick={() => setShowFilters(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Leaf size={16} /> Category
                </p>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedCategory("")}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      !selectedCategory
                        ? "bg-primary text-primary-foreground font-semibold"
                        : "text-foreground hover:bg-muted"
                    }`}
                  >
                    All Categories
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition capitalize ${
                        selectedCategory === cat
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-foreground hover:bg-muted"
                      }`}
                    >
                      {cat.replace("-", " ")}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Calendar size={16} /> Expiry Date
                </p>
                <div className="space-y-2">
                  {[
                    { label: "Safe for 1 month", value: "30days" },
                    { label: "Safe for 3 months", value: "90days" },
                    { label: "Safe for 6+ months", value: "180days" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setExpiryFilter(expiryFilter === opt.value ? "" : opt.value)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        expiryFilter === opt.value
                          ? "bg-primary text-primary-foreground font-semibold"
                          : "text-foreground hover:bg-muted border border-border"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <MapPin size={16} /> Within Distance
                </p>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min="1"
                    max="50"
                    value={distanceFilter}
                    onChange={(e) => setDistanceFilter(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="font-bold text-primary text-lg">{distanceFilter}km</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingDown size={16} /> Sort By
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="newest">Newest</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="discount">Best Discount</option>
                  <option value="expiry-urgent">Expiring Soon</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No products found. Try adjusting your filters.</p>
              </div>
            ) : (
              <>
                <p className="text-muted-foreground mb-6 text-sm">
                  Showing {filteredProducts.length} product{filteredProducts.length !== 1 ? "s" : ""}
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {filteredProducts.map((product) => {
                    const deal = getDealBadge(product.discountPercentage)
                    const daysLeft = daysUntilExpiry(product.expiryDate)

                    return (
                      <div
                        key={product._id}
                        className="bg-card rounded-lg border border-border hover:shadow-lg hover:border-primary/50 transition group overflow-hidden flex flex-col"
                      >
                        <div className="relative h-40 md:h-48 bg-muted overflow-hidden group-hover:scale-105 transition">
                          <img
                            src={product.image || "/placeholder.svg?height=200&width=200&query=household product"}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                          {/* Save Badge - Top Left */}
                          <div className={`absolute top-3 left-3 ${deal.className}`}>
                            {deal.icon} Save {product.discountPercentage}%
                          </div>

                          {/* Days Left Badge - Top Right */}
                          <div
                            className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-bold ${getExpiryColor(daysLeft)}`}
                          >
                            {getExpiryLabel(daysLeft)} ({daysLeft} days)
                          </div>

                          {/* Out of Stock Overlay */}
                          {product.quantity === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <p className="text-white font-bold text-lg">Out of Stock</p>
                            </div>
                          )}
                        </div>

                        <div className="p-4 flex-1 flex flex-col">
                          <Link href={`/product/${product._id}`} className="flex-1">
                            <h3 className="font-bold text-foreground group-hover:text-primary transition line-clamp-2 mb-1">
                              {product.name}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-3">by {product.sellerId.name}</p>
                          </Link>

                          {/* Pricing */}
                          <div className="mb-3">
                            <div className="flex items-baseline gap-2 mb-2">
                              <span className="text-2xl font-bold text-primary">₹{product.finalPrice.toFixed(0)}</span>
                              <span className="text-xs text-muted-foreground line-through">
                                ₹{product.originalPrice.toFixed(0)}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Leaf size={12} className="text-green-600" />
                              Saves ~250g waste
                            </div>
                          </div>

                          {/* CTA Button */}
                          <button
                            onClick={() => addToCart(product)}
                            disabled={product.quantity === 0}
                            className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <ShoppingCart size={16} /> Add to Cart
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
