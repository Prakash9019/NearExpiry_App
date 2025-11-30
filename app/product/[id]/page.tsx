"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Star, Leaf, ShoppingCart, ChevronLeft, CheckCircle, MapPin, Truck } from "lucide-react"
import Navbar from "@/components/Navbar"

interface Product {
  _id: string
  name: string
  description: string
  category: string
  originalPrice: number
  finalPrice: number
  discountPercentage: number
  batchNumber?: string
  manufacturingDate?: string
  expiryDate: string
  image: string
  sellerId: { name: string }
  rating: number
  quantity: number
  reviews: any[]
  ocrVerified?: boolean
  inspectionNotes?: string
}

export default function ProductDetail() {
  const params = useParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [quantity, setQuantity] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deliveryMode, setDeliveryMode] = useState<"delivery" | "pickup">("delivery")
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null)

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        if (res.ok) {
          const data = await res.json()
          setProduct(data)
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [params.id])

  const handleAddToCart = () => {
    if (!product) return

    // Check expiry conflict warning
    const daysLeft = daysUntilExpiry(product.expiryDate)
    if (daysLeft <= 2 && quantity > 1) {
      const confirm = window.confirm(
        `⚠️ You have added ${quantity} units of ${product.name} expiring in ${daysLeft} days. Can you consume it in time? Click OK to proceed.`,
      )
      if (!confirm) return
    }

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItem = cart.find((item: any) => item._id === product._id)
    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push({ ...product, quantity, deliveryMode })
    }
    localStorage.setItem("cart", JSON.stringify(cart))
    alert("Added to cart!")
  }

  const daysUntilExpiry = (date: string) => {
    const today = new Date()
    const expiry = new Date(date)
    return Math.floor((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
  }

  const calculateFreshnessPercentage = (date: string) => {
    if (!product?.manufacturingDate) return 50

    const mfgDate = new Date(product.manufacturingDate)
    const expDate = new Date(date)
    const today = new Date()

    const totalDays = (expDate.getTime() - mfgDate.getTime()) / (1000 * 60 * 60 * 24)
    const remainingDays = (expDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)

    return Math.max(0, Math.min(100, (remainingDays / totalDays) * 100))
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Product not found</p>
          <Link href="/marketplace" className="text-primary font-semibold">
            Back to marketplace
          </Link>
        </div>
      </div>
    )
  }

  const daysLeft = daysUntilExpiry(product.expiryDate)
  const freshness = calculateFreshnessPercentage(product.expiryDate)
  const finalPrice = deliveryMode === "delivery" ? product.finalPrice + 40 : product.finalPrice

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Header */}
      <div className="bg-card border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link
            href="/marketplace"
            className="flex items-center gap-2 text-primary hover:text-primary/80 transition font-semibold"
          >
            <ChevronLeft size={20} /> Back to Marketplace
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Image */}
          <div className="flex items-center justify-center">
            <div className="w-full aspect-square bg-muted rounded-lg overflow-hidden">
              <img
                src={product.image || "/placeholder.svg?height=500&width=500&query=household product"}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-start">
            <p className="text-sm text-muted-foreground mb-3 capitalize">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-4 mb-6">
              {product.rating > 0 && (
                <>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i < Math.round(product.rating) ? "fill-accent text-accent" : "text-muted-foreground"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">({product.reviews.length} reviews)</span>
                </>
              )}
            </div>

            <p className="text-base text-muted-foreground mb-6">By {product.sellerId.name}</p>

            {/* Freshness Meter */}
            <div className="mb-6 p-4 md:p-6 bg-card border border-border rounded-lg">
              <p className="text-sm font-semibold text-foreground mb-4">Freshness Meter</p>
              {product.manufacturingDate && (
                <div className="flex items-center gap-4 mb-4">
                  <div className="text-xs text-muted-foreground">
                    {new Date(product.manufacturingDate).toLocaleDateString()}
                  </div>
                  <div className="flex-1 bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-green-500 to-red-500 transition-all"
                      style={{ width: `${freshness}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(product.expiryDate).toLocaleDateString()}
                  </div>
                </div>
              )}
              <p className="text-sm font-semibold text-foreground">
                You have <span className="text-primary">{daysLeft} days</span> to use this product
              </p>
            </div>

            {/* Pricing */}
            <div className="mb-6 p-4 md:p-6 bg-accent/10 border border-accent/20 rounded-lg">
              <div className="flex items-baseline gap-3 mb-3">
                <span className="text-4xl md:text-5xl font-bold text-primary">₹{finalPrice.toFixed(0)}</span>
                <span className="text-2xl text-muted-foreground line-through">₹{product.originalPrice.toFixed(0)}</span>
              </div>
              <p className="text-accent font-bold text-lg mb-2">{product.discountPercentage}% OFF</p>
              <p className="text-sm text-muted-foreground">
                You save ₹{(product.originalPrice - product.finalPrice).toFixed(0)}
                {deliveryMode === "delivery" && " + ₹40 delivery"}
              </p>
            </div>

            {/* Delivery/Pickup Toggle */}
            <div className="mb-6 grid grid-cols-2 gap-3 p-4 bg-card border border-border rounded-lg">
              <button
                onClick={() => setDeliveryMode("delivery")}
                className={`p-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  deliveryMode === "delivery"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                <Truck size={18} /> Delivery (+₹40)
              </button>
              <button
                onClick={() => setDeliveryMode("pickup")}
                className={`p-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
                  deliveryMode === "pickup"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-foreground hover:bg-muted/80"
                }`}
              >
                <MapPin size={18} /> Free Pickup
              </button>
            </div>

            {/* Transparency Accordion */}
            <div className="mb-6 space-y-3">
              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedAccordion(expandedAccordion === "why" ? null : "why")}
                  className="w-full p-4 bg-card hover:bg-muted transition flex items-center justify-between font-semibold text-foreground"
                >
                  Why is this cheap?
                  <span className={`transition ${expandedAccordion === "why" ? "rotate-180" : ""}`}>▼</span>
                </button>
                {expandedAccordion === "why" && (
                  <div className="p-4 bg-muted/50 border-t border-border text-sm text-muted-foreground space-y-2">
                    <p>
                      <strong>Reason:</strong> Near Expiry Product
                    </p>
                    <p>
                      <strong>Status:</strong> Sealed & Safe - Unopened & Authentic
                    </p>
                    <p>
                      <strong>Source:</strong> Verified Distributor in Bangalore
                    </p>
                    <p>
                      <strong>Inspection:</strong> {product.ocrVerified ? "✓ AI Verified" : "✓ Manually Verified"}
                    </p>
                  </div>
                )}
              </div>

              <div className="border border-border rounded-lg overflow-hidden">
                <button
                  onClick={() => setExpandedAccordion(expandedAccordion === "batch" ? null : "batch")}
                  className="w-full p-4 bg-card hover:bg-muted transition flex items-center justify-between font-semibold text-foreground"
                >
                  Product Details & Batch Info
                  <span className={`transition ${expandedAccordion === "batch" ? "rotate-180" : ""}`}>▼</span>
                </button>
                {expandedAccordion === "batch" && (
                  <div className="p-4 bg-muted/50 border-t border-border text-sm text-muted-foreground space-y-2">
                    {product.batchNumber && (
                      <p>
                        <strong>Batch Number:</strong> {product.batchNumber}
                        <CheckCircle size={16} className="inline ml-2 text-green-600" />
                      </p>
                    )}
                    {product.manufacturingDate && (
                      <p>
                        <strong>Manufacturing Date:</strong> {new Date(product.manufacturingDate).toLocaleDateString()}
                      </p>
                    )}
                    <p>
                      <strong>Expiry Date:</strong> {new Date(product.expiryDate).toLocaleDateString()}
                    </p>
                    {product.inspectionNotes && (
                      <p>
                        <strong>Inspection Notes:</strong> {product.inspectionNotes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Add to Cart Section */}
            <div className="flex gap-3 mb-6">
              <div className="flex items-center gap-2 border border-border rounded-lg p-2">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 hover:bg-muted font-bold text-lg rounded"
                >
                  −
                </button>
                <span className="w-8 text-center font-semibold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                  className="px-3 py-1 hover:bg-muted font-bold text-lg rounded"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 transition flex items-center justify-center gap-2 text-base md:text-lg"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>

            {/* Green Impact */}
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg">
              <p className="text-sm font-semibold text-green-800 mb-3 flex items-center gap-2">
                <Leaf size={18} /> Environmental Impact
              </p>
              <ul className="text-sm text-green-700 space-y-1">
                <li>✓ Save ~250g of waste per purchase</li>
                <li>✓ Earn 10 green points</li>
                <li>✓ Prevent 0.5kg CO₂ emissions</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Description Section */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-card border border-border rounded-lg">
          <h2 className="text-2xl font-bold text-foreground mb-4">About this Product</h2>
          <p className="text-muted-foreground text-base leading-relaxed">{product.description}</p>
        </div>

        {/* Reviews Section */}
        {product.reviews && product.reviews.length > 0 && (
          <div className="mt-8 md:mt-12 p-6 md:p-8 bg-card border border-border rounded-lg">
            <h2 className="text-2xl font-bold text-foreground mb-6">Customer Reviews</h2>
            <div className="space-y-4">
              {product.reviews.map((review: any, idx: number) => (
                <div key={idx} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={i < review.rating ? "fill-accent text-accent" : "text-muted-foreground"}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">{review.rating}/5</span>
                  </div>
                  <p className="text-sm text-foreground">{review.comment}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
