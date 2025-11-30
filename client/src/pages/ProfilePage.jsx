"use client"

import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../context/AuthContext"
import { Mail, Phone, MapPin, Leaf, TrendingDown } from "lucide-react"

export default function ProfilePage() {
  const { user, token, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate("/login")
    }
  }, [token])

  if (!token || !user) return null

  return (
    <div className="py-8">
      <div className="max-w-container px-2">
        <h1 className="text-4xl font-bold mb-8">My Profile</h1>

        <div className="grid grid-2 gap-8">
          {/* User Info */}
          <div>
            <div className="card">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold">
                  {user.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-2xl font-bold">{user.name}</h2>
                  <p className="text-neutral-600 capitalize">{user.role}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={20} className="text-neutral-400" />
                  <div>
                    <p className="text-sm text-neutral-600">Email</p>
                    <p className="font-bold">{user.email}</p>
                  </div>
                </div>

                {user.phone && (
                  <div className="flex items-center gap-3">
                    <Phone size={20} className="text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-600">Phone</p>
                      <p className="font-bold">{user.phone}</p>
                    </div>
                  </div>
                )}

                {user.address && (
                  <div className="flex items-center gap-3">
                    <MapPin size={20} className="text-neutral-400" />
                    <div>
                      <p className="text-sm text-neutral-600">Address</p>
                      <p className="font-bold">
                        {user.address.street}, {user.address.city}, {user.address.state}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <button onClick={logout} className="btn btn-outline w-full mt-6">
                Logout
              </button>
            </div>
          </div>

          {/* Impact Stats */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Your Impact</h2>

            <div className="space-y-4">
              <div className="card bg-green-50 border-2 border-green-200">
                <div className="flex items-center gap-4">
                  <Leaf size={32} className="text-green-600" />
                  <div>
                    <p className="text-sm text-green-700">Waste Saved</p>
                    <p className="text-3xl font-bold text-green-900">{user.wasteSavedKg || 0} kg</p>
                  </div>
                </div>
              </div>

              <div className="card bg-emerald-50 border-2 border-emerald-200">
                <div className="flex items-center gap-4">
                  <TrendingDown size={32} className="text-emerald-600" />
                  <div>
                    <p className="text-sm text-emerald-700">Green Points Earned</p>
                    <p className="text-3xl font-bold text-emerald-900">{user.greenPoints || 0}</p>
                  </div>
                </div>
              </div>

              <div className="card bg-blue-50 border-2 border-blue-200">
                <h3 className="font-bold text-lg mb-3">Impact Breakdown</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex justify-between">
                    <span className="text-blue-700">Carbon Saved</span>
                    <span className="font-bold">{(user.wasteSavedKg * 2.5).toFixed(1)} kg CO₂</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-blue-700">Trees Preserved</span>
                    <span className="font-bold">{Math.floor(user.greenPoints / 20)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-blue-700">Community Level</span>
                    <span className="font-bold">
                      {user.greenPoints > 500 ? "Gold" : user.greenPoints > 200 ? "Silver" : "Bronze"}
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
