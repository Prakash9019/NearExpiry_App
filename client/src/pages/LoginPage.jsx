"use client"

import { useState, useContext } from "react"
import { useNavigate, Link } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Mail, Lock } from "lucide-react"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { setUser, setToken } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (response.ok) {
        const data = await response.json()
        localStorage.setItem("token", data.token)
        setToken(data.token)
        setUser(data.user)
        navigate(data.user.role === "seller" ? "/seller-dashboard" : "/marketplace")
      } else {
        const data = await response.json()
        setError(data.error || "Invalid credentials")
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
          <h1 className="text-4xl font-bold text-center mb-2">Welcome Back</h1>
          <p className="text-center text-neutral-600 mb-8">Login to your NearExpiry account</p>

          <div className="card">
            {error && <div className="bg-red-50 border border-red-200 text-red-800 p-3 rounded mb-6">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label className="flex items-center gap-2 mb-2">
                  <Mail size={18} /> Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                />
              </div>

              <div className="input-group">
                <label className="flex items-center gap-2 mb-2">
                  <Lock size={18} /> Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>

              <button type="submit" disabled={loading} className="btn btn-primary w-full mb-4">
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="text-center text-neutral-600">
              Don't have an account?{" "}
              <Link to="/register" className="font-bold text-secondary">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
