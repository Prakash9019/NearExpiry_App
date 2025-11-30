"use client"

import { useContext } from "react"
import { Link } from "react-router-dom"
import { ShoppingCart, Leaf, Clock } from "lucide-react"
import { CartContext } from "../context/CartContext"

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext)

  const discountLabel =
    product.discountTier === "hot-deal"
      ? "🔥 Hot Deal"
      : product.discountTier === "good-deal"
        ? "⭐ Good Deal"
        : "✓ Fair Deal"

  const handleAddToCart = (e) => {
    e.preventDefault()
    addToCart(product, 1)
    alert("Added to cart!")
  }

  return (
    <Link to={`/product/${product._id}`}>
      <div className="card overflow-hidden hover:shadow-lg">
        {/* Image Placeholder */}
        <div className="bg-gradient-to-br from-neutral-200 to-neutral-300 h-48 flex items-center justify-center mb-4 relative">
          <span className="text-4xl">{["🧼", "🪥", "🧴", "🧹", "🌿", "👶"][(Math.random() * 6) | 0]}</span>
          <div className="absolute top-2 right-2">
            <span className="badge badge-warning">{discountLabel}</span>
          </div>
        </div>

        {/* Content */}
        <div>
          <h3 className="font-bold text-lg mb-1 line-clamp-2">{product.name}</h3>

          <div className="flex gap-2 mb-3">
            <span className="badge badge-info text-xs">{product.category}</span>
            <span className="text-sm text-neutral-500">{product.rating} ⭐</span>
          </div>

          {/* Price Section */}
          <div className="mb-3">
            <div className="flex gap-2 items-baseline">
              <span className="text-2xl font-bold text-secondary">₹{product.currentPrice.toFixed(0)}</span>
              <span className="text-sm line-through text-neutral-400">₹{product.originalPrice}</span>
              <span className="badge badge-success">{product.discountPercentage}% OFF</span>
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex gap-4 text-xs text-neutral-600 mb-4">
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>Expires in {product.daysUntilExpiry} days</span>
            </div>
            <div className="flex items-center gap-1">
              <Leaf size={14} className="text-success" />
              <span>Eco-friendly</span>
            </div>
          </div>

          {/* Stock */}
          {product.quantity > 0 ? (
            <div className="text-xs text-success font-bold mb-3">✓ {product.quantity} in stock</div>
          ) : (
            <div className="text-xs text-danger font-bold mb-3">Out of stock</div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={product.quantity === 0 || product.status === "sold-out"}
            className="btn btn-secondary w-full flex justify-center gap-2"
          >
            <ShoppingCart size={18} />
            Add to Cart
          </button>
        </div>
      </div>
    </Link>
  )
}
