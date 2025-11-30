"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { TrendingDown, Leaf, Clock, Users } from "lucide-react"
import ProductCard from "../components/ProductCard"

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchFeaturedProducts()
  }, [])

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/products?limit=6&sortBy=discount")
      if (response.ok) {
        const data = await response.json()
        setFeaturedProducts(data.products)
      }
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary to-neutral-800 text-white py-20">
        <div className="max-w-container px-2">
          <div className="max-w-2xl">
            <h1 className="text-5xl font-bold mb-4">Save Money, Save the Planet</h1>
            <p className="text-xl text-neutral-300 mb-8">
              Buy near-expiry household essentials at 30-70% discount. Zero waste, maximum savings.
            </p>
            <Link to="/marketplace" className="btn btn-secondary">
              Shop Now
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-container px-2">
          <div className="grid grid-4">
            <div className="text-center">
              <TrendingDown className="inline-block mb-4 text-accent" size={40} />
              <div className="text-3xl font-bold text-primary">70%</div>
              <p className="text-neutral-600">Average Savings</p>
            </div>
            <div className="text-center">
              <Leaf className="inline-block mb-4 text-success" size={40} />
              <div className="text-3xl font-bold text-primary">50K+</div>
              <p className="text-neutral-600">Kg Waste Saved</p>
            </div>
            <div className="text-center">
              <Clock className="inline-block mb-4 text-warning" size={40} />
              <div className="text-3xl font-bold text-primary">24hrs</div>
              <p className="text-neutral-600">Quick Delivery</p>
            </div>
            <div className="text-center">
              <Users className="inline-block mb-4 text-info" size={40} />
              <div className="text-3xl font-bold text-primary">10K+</div>
              <p className="text-neutral-600">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-neutral-50">
        <div className="max-w-container px-2">
          <h2 className="text-4xl font-bold text-center mb-12">Why NearExpiry?</h2>
          <div className="grid grid-3">
            <div className="card">
              <div className="text-4xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-2">100% Safe</h3>
              <p className="text-neutral-600">All products verified by health experts. Expiry dates guaranteed.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-2">Best Deals</h3>
              <p className="text-neutral-600">Exclusive discounts on trusted household brands.</p>
            </div>
            <div className="card">
              <div className="text-4xl mb-4">🌍</div>
              <h3 className="text-xl font-bold mb-2">Save Planet</h3>
              <p className="text-neutral-600">Track your green impact and earn rewards.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16">
        <div className="max-w-container px-2">
          <h2 className="text-4xl font-bold mb-12">Hot Deals Right Now</h2>
          {loading ? (
            <div className="text-center py-12">Loading products...</div>
          ) : (
            <div className="grid grid-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-secondary text-white py-16">
        <div className="max-w-container px-2 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Start Saving?</h2>
          <p className="text-lg mb-8 text-green-100">Join 10,000+ customers already saving money and the planet</p>
          <Link to="/marketplace" className="btn bg-white text-secondary hover:bg-neutral-100">
            Explore Marketplace
          </Link>
        </div>
      </section>
    </div>
  )
}
