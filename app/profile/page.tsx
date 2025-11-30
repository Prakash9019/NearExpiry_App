"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { User, Leaf, Award, LogOut, Package } from "lucide-react"

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (!user.id) {
      router.push("/login")
      return
    }
    setUserData(user)
    setLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    localStorage.removeItem("token")
    localStorage.removeItem("cart")
    router.push("/login")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading profile...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-foreground">My Profile</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Card */}
          <div className="md:col-span-1">
            <div className="bg-white p-8 rounded-xl border border-slate-200">
              <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4">
                {userData?.name?.charAt(0).toUpperCase()}
              </div>
              <h2 className="text-2xl font-bold text-foreground text-center mb-1">{userData?.name}</h2>
              <p className="text-muted-foreground text-center mb-6">{userData?.email}</p>
              <div className="p-3 bg-blue-50 rounded-lg border border-blue-200 text-center mb-6">
                <p className="text-xs text-blue-600 font-semibold">Account Type</p>
                <p className="text-lg font-bold text-blue-700 capitalize">{userData?.role}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full border-2 border-red-300 text-red-600 py-2 rounded-lg font-bold hover:bg-red-50 transition flex items-center justify-center gap-2"
              >
                <LogOut size={18} /> Logout
              </button>
            </div>
          </div>

          {/* Stats & Impact */}
          <div className="md:col-span-2 space-y-6">
            {/* Green Impact */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-xl border border-green-200">
              <h3 className="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
                <Leaf size={24} className="text-green-600" /> Green Impact Profile
              </h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">Waste Saved</p>
                  <p className="text-3xl font-bold text-green-600">{userData?.wasteSavedKg?.toFixed(2) || 0}</p>
                  <p className="text-xs text-muted-foreground">kg</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">Carbon Saved</p>
                  <p className="text-3xl font-bold text-green-600">{userData?.carbonSavedKg?.toFixed(2) || 0}</p>
                  <p className="text-xs text-muted-foreground">kg CO2</p>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-muted-foreground">Green Points</p>
                  <p className="text-3xl font-bold text-secondary">{userData?.greenPoints || 0}</p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="grid grid-cols-2 gap-4">
              <Link
                href="/orders"
                className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-primary/30 transition"
              >
                <Package size={24} className="text-primary mb-2" />
                <h3 className="font-bold text-foreground">My Orders</h3>
                <p className="text-sm text-muted-foreground">Track your purchases</p>
              </Link>

              <Link
                href={userData?.role === "seller" ? "/seller-dashboard" : "/marketplace"}
                className="bg-white p-6 rounded-xl border border-slate-200 hover:shadow-lg hover:border-primary/30 transition"
              >
                <Award size={24} className="text-primary mb-2" />
                <h3 className="font-bold text-foreground">
                  {userData?.role === "seller" ? "Seller Dashboard" : "Keep Shopping"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {userData?.role === "seller" ? "Manage your products" : "Find more deals"}
                </p>
              </Link>
            </div>

            {/* Account Settings */}
            <div className="bg-white p-6 rounded-xl border border-slate-200">
              <h3 className="font-bold text-foreground mb-4 flex items-center gap-2">
                <User size={20} /> Account Information
              </h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-muted-foreground">Email Address</p>
                  <p className="font-semibold text-foreground">{userData?.email}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Account Type</p>
                  <p className="font-semibold text-foreground capitalize">{userData?.role}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Member Since</p>
                  <p className="font-semibold text-foreground">
                    {new Date(userData?.createdAt || Date.now()).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
