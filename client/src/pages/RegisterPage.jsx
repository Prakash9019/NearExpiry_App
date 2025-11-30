"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { User, Mail, Lock, Briefcase } from "lucide-react"

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "buyer",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { setUser, setToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
        navigate(data.user.role === "seller" ? "/seller-dashboard" : "/marketplace")
      } else {
        const data = await response.json()
        setError(data.error || "Registration failed")
      }
    } catch (error) {
      setError("Network error. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="py-12">
      <div className="max-w-container px-2">
        <div className="max-w-md mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2">Join NearExpiry</h1>
          <p className="text-center text-neutral-600 mb-8">Create your account to start saving</p>

          <div className="card">
            {error && <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-6">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="flex items-center gap-2">
                  <User size={18} /> Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="input-group">
                <label className="flex items-center gap-2">
                  <Mail size={18} /> Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label className="flex items-center gap-2">
                  <Lock size={18} /> Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="input-group">
                <label className="flex items-center gap-2">
                  <Lock size={18} /> Confirm Password
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                />
              </div>

              <div className="input-group">
                <label className="flex items-center gap-2">
                  <Briefcase size={18} /> Account Type
                </label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                </select>
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full mb-4">
                {loading ? "Creating account..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-neutral-600">
              Already have an account?{" "}
              <Link to="/login" className="font-bold text-secondary">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
