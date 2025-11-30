"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Leaf, Zap, ShoppingCart, TrendingDown, Users, Award, ChevronRight, AlertCircle } from "lucide-react"
import Navbar from "@/components/Navbar"

export default function Home() {
  const [user, setUser] = useState<any>(null)
  const [urgencyDeals, setUrgencyDeals] = useState<any[]>([])
  const [savings, setSavings] = useState({ totalSavings: 0, wasteSaved: 0, people: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }

    const fetchUrgencyDeals = async () => {
      try {
        const res = await fetch("/api/products?sortBy=expiry-urgent")
        const data = await res.json()
        setUrgencyDeals(data.slice(0, 6))
      } catch (error) {
        console.error("Failed to fetch urgency deals:", error)
      }
    }

    const calculateSavings = async () => {
      try {
        const res = await fetch("/api/savings-tracker")
        const data = await res.json()
        setSavings(data)
      } catch (error) {
        console.error("Failed to fetch savings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchUrgencyDeals()
    calculateSavings()
  }, [])

  const categories = [
    { name: "Soaps", icon: "🧼", count: 300 },
    { name: "Toothpaste", icon: "🪥", count: 250 },
    { name: "Shampoos", icon: "🧴", count: 180 },
    { name: "Detergents", icon: "🧽", count: 150 },
    { name: "Cleaners", icon: "🧹", count: 120 },
    { name: "Dishwash", icon: "🍽️", count: 90 },
    { name: "Baby Care", icon: "👶", count: 80 },
  ]

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {user ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
          {/* Welcome Section */}
          <section className="mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome back, {user.email.split("@")[0]}!
            </h1>
            <p className="text-muted-foreground text-lg">Continue shopping or explore new deals today</p>
          </section>

          {/* Stats Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12">
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition">
              <div className="text-3xl font-bold text-primary mb-2">0</div>
              <p className="text-muted-foreground">Active Orders</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition">
              <div className="text-3xl font-bold text-green-600 mb-2">0 kg</div>
              <p className="text-muted-foreground">Waste Saved</p>
            </div>
            <div className="bg-card p-6 rounded-lg border border-border hover:shadow-lg transition">
              <div className="text-3xl font-bold text-accent mb-2">0</div>
              <p className="text-muted-foreground">Green Points</p>
            </div>
          </section>

          {/* Quick Actions */}
          <section className="flex flex-col sm:flex-row gap-4 mb-12">
            <Link
              href="/marketplace"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold hover:bg-primary/90 transition"
            >
              <ShoppingCart size={20} /> Continue Shopping
            </Link>
            {user.role === "seller" && (
              <Link
                href="/seller-dashboard"
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary/10 transition"
              >
                <Zap size={20} /> My Inventory
              </Link>
            )}
            {user.role === "admin" && (
              <Link
                href="/admin"
                className="flex-1 inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-4 rounded-lg font-bold hover:bg-primary/10 transition"
              >
                <Zap size={20} /> Admin Panel
              </Link>
            )}
          </section>
        </div>
      ) : (
        <>
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-200 py-4">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <p className="text-sm md:text-base font-semibold text-green-700">
                <Leaf className="inline-block mr-2" size={16} />
                India has saved ₹{savings.totalSavings.toLocaleString()} and {savings.wasteSaved}kg of waste on
                NearExpiry today
              </p>
            </div>
          </div>

          {/* Hero */}
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 text-center">
            <div className="mb-6 inline-block">
              <span className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-semibold">
                <Leaf size={16} /> Eco-Friendly Shopping
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-tight">
              Save Money, <span className="text-primary">Save the Planet</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
              Buy premium household essentials at 20-60% off. Help reduce waste while saving big on soaps, shampoos,
              detergents, and more.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Link
                href="/marketplace"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg font-bold hover:bg-primary/90 transition text-lg"
              >
                <ShoppingCart size={20} /> Start Shopping
              </Link>
              <Link
                href="/seller-onboarding"
                className="inline-flex items-center justify-center gap-2 border-2 border-primary text-primary px-8 py-3 rounded-lg font-bold hover:bg-primary/10 transition text-lg"
              >
                <Zap size={20} /> Become a Seller
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-20">
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition">
                <div className="text-3xl font-bold text-primary mb-2">500K+</div>
                <p className="text-muted-foreground">Kg Waste Saved</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition">
                <div className="text-3xl font-bold text-accent mb-2">50%</div>
                <p className="text-muted-foreground">Avg. Discount</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-lg transition">
                <div className="text-3xl font-bold text-secondary mb-2">10K+</div>
                <p className="text-muted-foreground">Happy Shoppers</p>
              </div>
            </div>
          </section>

          <section className="bg-card border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl md:text-3xl font-bold text-foreground flex items-center gap-2">
                  <AlertCircle size={28} className="text-accent" />
                  Steal Deals: Under ₹50 (Expires in Less Than 10 Days)
                </h2>
                <Link
                  href="/marketplace"
                  className="text-primary font-semibold flex items-center gap-1 hover:gap-2 transition"
                >
                  View All <ChevronRight size={18} />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 overflow-x-auto pb-4">
                {urgencyDeals.length > 0 ? (
                  urgencyDeals.map((product: any) => (
                    <Link
                      key={product._id}
                      href={`/product/${product._id}`}
                      className="flex-shrink-0 w-full bg-background rounded-lg border border-border hover:shadow-lg hover:border-primary/50 transition overflow-hidden group"
                    >
                      <div className="relative h-32 bg-muted overflow-hidden group-hover:scale-105 transition">
                        <img
                          src={product.image || "/placeholder.svg?height=150&width=150&query=urgency deal"}
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-accent text-accent-foreground px-2 py-1 rounded text-xs font-bold">
                          Only {product.quantity} left
                        </div>
                      </div>
                      <div className="p-3">
                        <p className="font-bold text-foreground text-sm line-clamp-1">{product.name}</p>
                        <div className="flex items-baseline gap-1 mt-2">
                          <span className="text-xl font-bold text-primary">₹{product.finalPrice.toFixed(0)}</span>
                          <span className="text-xs text-muted-foreground line-through">
                            ₹{product.originalPrice.toFixed(0)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full text-center text-muted-foreground py-8">
                    No urgent deals available right now
                  </p>
                )}
              </div>
            </div>
          </section>

          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">Browse by Category</h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.name}
                    href={`/marketplace?category=${cat.name.toLowerCase().replace(/\s/g, "-")}`}
                    className="group p-6 bg-card border border-border rounded-lg text-center hover:shadow-lg hover:border-primary/50 transition"
                  >
                    <div className="text-3xl md:text-4xl mb-3 group-hover:scale-110 transition">{cat.icon}</div>
                    <p className="font-semibold text-foreground text-sm md:text-base">{cat.name}</p>
                    <p className="text-xs text-muted-foreground mt-1">{cat.count}+ items</p>
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Features */}
          <section className="bg-card border-t border-border py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl md:text-3xl font-bold text-center text-foreground mb-12">
                Why Choose NearExpiry?
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="p-6 md:p-8 border border-border rounded-lg hover:shadow-lg hover:border-primary/30 transition">
                  <TrendingDown size={40} className="text-accent mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Huge Discounts</h3>
                  <p className="text-muted-foreground">
                    Save 20-60% on trusted brands. Prices drop automatically as products near expiry.
                  </p>
                </div>

                <div className="p-6 md:p-8 border border-border rounded-lg hover:shadow-lg hover:border-primary/30 transition">
                  <Leaf size={40} className="text-green-600 mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Green Impact</h3>
                  <p className="text-muted-foreground">
                    Earn green points, track waste saved, and contribute to a sustainable future.
                  </p>
                </div>

                <div className="p-6 md:p-8 border border-border rounded-lg hover:shadow-lg hover:border-primary/30 transition">
                  <Award size={40} className="text-primary mb-4" />
                  <h3 className="text-lg md:text-xl font-bold text-foreground mb-2">Verified Sellers</h3>
                  <p className="text-muted-foreground">
                    100% authentic products from verified sellers with ratings and reviews.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA */}
          <section className="bg-gradient-to-r from-primary to-secondary text-primary-foreground py-12 md:py-20">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Users size={40} className="mx-auto mb-6 opacity-90" />
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Join Thousands Saving & Living Green</h2>
              <p className="text-base md:text-lg mb-8 opacity-90">
                Start shopping discounted essentials today and make a difference tomorrow.
              </p>
              <Link
                href="/marketplace"
                className="inline-flex items-center gap-2 bg-primary-foreground text-primary px-8 py-3 rounded-lg font-bold hover:bg-slate-100 transition"
              >
                <ShoppingCart size={20} /> Shop Now
              </Link>
            </div>
          </section>

          {/* Footer */}
          <footer className="border-t border-border bg-card py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
              <p className="mb-2 font-semibold">NearExpiry - Save Money. Save the Planet.</p>
              <p className="text-sm">Made with love for a sustainable future</p>
            </div>
          </footer>
        </>
      )}
    </div>
  )
}
