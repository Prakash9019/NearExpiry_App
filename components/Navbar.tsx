"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Leaf, ShoppingCart, LogOut, Menu, X, Home, LayoutDashboard } from "lucide-react"

export default function Navbar() {
  const [user, setUser] = useState<any>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const router = useRouter()

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    const cartStr = localStorage.getItem("cart")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }
    if (cartStr) {
      const cart = JSON.parse(cartStr)
      setCartCount(cart.length || 0)
    }
  }, [])

  const handleLogout = async () => {
    const response = await fetch("/api/auth/logout", { method: "POST" })
    if (response.ok) {
      localStorage.removeItem("user")
      localStorage.removeItem("token")
      localStorage.removeItem("cart")
      setUser(null)
      router.push("/")
    }
  }

  return (
    <nav className="border-b border-slate-200 bg-white/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-primary flex items-center gap-2">
          <Leaf size={28} className="text-green-600" />
          NearExpiry
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            href="/marketplace"
            className="text-foreground hover:text-primary font-medium transition flex items-center gap-2"
          >
            <Home size={18} /> Shop
          </Link>

          {user && user.role === "seller" && (
            <Link
              href="/seller-dashboard"
              className="text-foreground hover:text-primary font-medium transition flex items-center gap-2"
            >
              <LayoutDashboard size={18} /> Dashboard
            </Link>
          )}

          {user && user.role === "admin" && (
            <Link
              href="/admin"
              className="text-foreground hover:text-primary font-medium transition flex items-center gap-2"
            >
              <LayoutDashboard size={18} /> Admin
            </Link>
          )}

          {!user ? (
            <>
              <Link href="/login" className="text-foreground hover:text-primary font-medium transition">
                Sign In
              </Link>
              <Link
                href="/register"
                className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Join Now
              </Link>
            </>
          ) : (
            <>
              {user.role === "buyer" && (
                <Link href="/cart" className="text-foreground hover:text-primary font-medium transition relative">
                  <ShoppingCart size={20} />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                      {cartCount}
                    </span>
                  )}
                </Link>
              )}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{user.email}</span>
              </div>
              <button
                onClick={handleLogout}
                className="text-foreground hover:text-primary font-medium transition flex items-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-foreground" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 p-4 md:hidden">
            <div className="flex flex-col gap-4">
              <Link href="/marketplace" className="text-foreground hover:text-primary font-medium transition">
                Shop
              </Link>

              {user && user.role === "seller" && (
                <Link href="/seller-dashboard" className="text-foreground hover:text-primary font-medium transition">
                  Dashboard
                </Link>
              )}

              {user && user.role === "admin" && (
                <Link href="/admin" className="text-foreground hover:text-primary font-medium transition">
                  Admin
                </Link>
              )}

              {!user ? (
                <>
                  <Link href="/login" className="text-foreground hover:text-primary font-medium transition">
                    Sign In
                  </Link>
                  <Link
                    href="/register"
                    className="bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold text-center"
                  >
                    Join Now
                  </Link>
                </>
              ) : (
                <>
                  {user.role === "buyer" && (
                    <Link href="/cart" className="text-foreground hover:text-primary font-medium transition">
                      Cart ({cartCount})
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="text-foreground hover:text-primary font-medium transition text-left"
                  >
                    Logout
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
