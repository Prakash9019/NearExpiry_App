"use client"

import { useState, useEffect, useContext } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Heart, Share2, Truck, Shield, Leaf } from "lucide-react"
import { CartContext } from "../context/CartContext"
import { AuthContext } from "../context/AuthContext"

export default function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useContext(CartContext)
  const { user, token } = useContext(AuthContext)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [selectedReview, setSelectedReview] = useState(null)
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`)
      if (response.ok) {
        const data = await response.json()
        setProduct(data)
      } else {
        navigate("/marketplace")
      }
    } catch (error) {
      console.error("Error fetching product:", error)
      navigate("/marketplace")
    } finally {
      setLoading(false)
    }
  }

  const handleAddToCart = () => {
    addToCart(product, quantity)
    alert("Added to cart!")
  }

  const handleAddReview = async () => {
    if (!token) {
      navigate("/login")
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}/review`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          rating: newRating,
          comment: newComment,
        }),
      })

      if (response.ok) {
        setNewComment("")
        setNewRating(5)
        fetchProduct()
      }
    } catch (error) {
      console.error("Error adding review:", error)
    }
  }

  if (loading) return <div className="py-20 text-center">Loading...</div>
  if (!product) return <div className="py-20 text-center">Product not found</div>

  const wasteReduction = ((product.originalPrice - product.currentPrice) / product.originalPrice) * 100

  return (
    <div className="py-8">
      <div className="max-w-container px-2">
        <button onClick={() => navigate("/marketplace")} className="text-secondary hover:text-primary mb-6 font-medium">
          ← Back to Marketplace
        </button>

        <div className="grid grid-2 gap-8 mb-12">
          {/* Image */}
          <div>
            <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 h-96 flex items-center justify-center rounded-lg text-8xl">
              {["🧼", "🪥", "🧴", "🧹", "🌿", "👶"][(Math.random() * 6) | 0]}
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="badge badge-info mb-3">{product.category}</span>
            <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
            <p className="text-neutral-600 text-lg mb-6">{product.description}</p>

            {/* Seller Info */}
            <div className="card mb-6 bg-neutral-50">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center text-white font-bold">
                  {product.seller?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-bold">{product.seller?.name}</p>
                  <p className="text-sm text-neutral-600">Verified Seller ✓</p>
                </div>
              </div>
            </div>

            {/* Price Section */}
            <div className="mb-6">
              <div className="flex gap-3 items-baseline mb-3">
                <span className="text-5xl font-bold text-secondary">₹{product.currentPrice.toFixed(0)}</span>
                <span className="text-2xl line-through text-neutral-400">₹{product.originalPrice}</span>
                <span className="badge badge-success text-lg">{product.discountPercentage}% OFF</span>
              </div>
              <p className="text-green-600 font-bold">
                Save ₹{(product.originalPrice - product.currentPrice).toFixed(0)}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-2 gap-4 mb-6">
              <div className="card bg-blue-50 border border-blue-200">
                <div className="flex gap-2 items-start">
                  <Truck size={20} className="text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-blue-900">Fast Delivery</p>
                    <p className="text-sm text-blue-800">24-48 hours delivery</p>
                  </div>
                </div>
              </div>
              <div className="card bg-green-50 border border-green-200">
                <div className="flex gap-2 items-start">
                  <Leaf size={20} className="text-green-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-green-900">Eco-Friendly</p>
                    <p className="text-sm text-green-800">Save planet from waste</p>
                  </div>
                </div>
              </div>
              <div className="card bg-purple-50 border border-purple-200">
                <div className="flex gap-2 items-start">
                  <Shield size={20} className="text-purple-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-purple-900">Quality Assured</p>
                    <p className="text-sm text-purple-800">Safe & verified products</p>
                  </div>
                </div>
              </div>
              <div className="card bg-orange-50 border border-orange-200">
                <div className="flex gap-2 items-start">
                  <Leaf size={20} className="text-orange-600 flex-shrink-0 mt-1" />
                  <div>
                    <p className="font-bold text-orange-900">Green Points</p>
                    <p className="text-sm text-orange-800">Earn {product.quantity > 0 ? "50 points" : "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Stock Status */}
            <div className="mb-6">
              {product.quantity > 0 ? (
                <div className="text-lg font-bold text-green-600">✓ {product.quantity} items in stock</div>
              ) : (
                <div className="text-lg font-bold text-red-600">Out of stock</div>
              )}
            </div>

            {/* Expiry Info */}
            <div className="card bg-yellow-50 border border-yellow-200 mb-6">
              <p className="font-bold text-yellow-900">Expires in {product.daysUntilExpiry} days</p>
              <p className="text-sm text-yellow-800">Date: {new Date(product.expiryDate).toLocaleDateString()}</p>
              <p className="text-sm text-yellow-800 mt-2">
                Tier: <span className="font-bold">{product.discountTier.toUpperCase()}</span>
              </p>
            </div>

            {/* Quantity Selector */}
            {product.quantity > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <label className="font-bold">Quantity:</label>
                <div className="flex gap-2">
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="btn btn-outline btn-small">
                    -
                  </button>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                    className="w-16 text-center"
                    min="1"
                    max={product.quantity}
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.quantity, quantity + 1))}
                    className="btn btn-outline btn-small"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity === 0 || product.status === "sold-out"}
                className="btn btn-secondary flex-1"
              >
                Add to Cart (₹{(product.currentPrice * quantity).toFixed(0)})
              </button>
              <button className="btn btn-outline btn-small">
                <Heart size={20} />
              </button>
              <button className="btn btn-outline btn-small">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-2 gap-8">
          <div>
            <h2 className="text-2xl font-bold mb-4">Reviews</h2>
            <div className="space-y-4">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((review, idx) => (
                  <div key={idx} className="card">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold">{review.user?.name || "Anonymous"}</p>
                      <span className="text-yellow-500">{"⭐".repeat(review.rating)}</span>
                    </div>
                    <p className="text-neutral-600">{review.comment}</p>
                    <p className="text-xs text-neutral-400 mt-2">{new Date(review.createdAt).toLocaleDateString()}</p>
                  </div>
                ))
              ) : (
                <p className="text-neutral-600">No reviews yet. Be the first!</p>
              )}
            </div>
          </div>

          {/* Add Review */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Leave a Review</h2>
            {user ? (
              <div className="card">
                <div className="input-group">
                  <label>Rating</label>
                  <select value={newRating} onChange={(e) => setNewRating(Number.parseInt(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((n) => (
                      <option key={n} value={n}>
                        {n} Stars {"⭐".repeat(n)}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="input-group">
                  <label>Your Review</label>
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Share your thoughts..."
                    rows="4"
                  />
                </div>
                <button onClick={handleAddReview} className="btn btn-secondary w-full">
                  Submit Review
                </button>
              </div>
            ) : (
              <div className="card bg-neutral-50 text-center">
                <p className="mb-4">Please log in to leave a review</p>
                <a href="/login" className="btn btn-primary">
                  Login
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
