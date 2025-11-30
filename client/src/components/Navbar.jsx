"use client"

import React, { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { ShoppingCart, LogOut, User, Menu } from "lucide-react"
import { AuthContext } from "../context/AuthContext"

export default function Navbar() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = React.useState(false)

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  return (
    <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-container px-2 py-3">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-primary">
            NearExpiry
          </Link>

          <div className="hidden md:flex gap-4 items-center">
            <Link to="/marketplace" className="text-neutral-700 hover:text-secondary font-medium">
              Marketplace
            </Link>
            {user?.role === "seller" && (
              <Link to="/seller-dashboard" className="text-neutral-700 hover:text-secondary font-medium">
                Dashboard
              </Link>
            )}
            <Link to="/cart" className="relative flex items-center gap-2 hover:text-secondary">
              <ShoppingCart size={20} />
              <span className="text-sm">Cart</span>
            </Link>

            {user ? (
              <div className="flex gap-3 items-center">
                <Link to="/profile" className="flex items-center gap-2 px-3 py-2 hover:bg-neutral-100 rounded">
                  <User size={20} />
                  <span className="text-sm">{user.name}</span>
                </Link>
                <button onClick={handleLogout} className="btn btn-outline btn-small gap-2">
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Link to="/login" className="btn btn-outline btn-small">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-small">
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
            <Menu size={24} />
          </button>
        </div>

        {menuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-neutral-200 pt-4">
            <Link to="/marketplace" className="block py-2 text-neutral-700 hover:text-secondary">
              Marketplace
            </Link>
            {user?.role === "seller" && (
              <Link to="/seller-dashboard" className="block py-2 text-neutral-700 hover:text-secondary">
                Dashboard
              </Link>
            )}
            <Link to="/cart" className="block py-2 text-neutral-700 hover:text-secondary">
              Cart
            </Link>
            {user ? (
              <>
                <Link to="/profile" className="block py-2 text-neutral-700 hover:text-secondary">
                  Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="block w-full text-left py-2 text-neutral-700 hover:text-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-2 mt-4">
                <Link to="/login" className="btn btn-outline btn-small flex-1">
                  Login
                </Link>
                <Link to="/register" className="btn btn-primary btn-small flex-1">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
