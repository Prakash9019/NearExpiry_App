"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MapPin, Package, CheckCircle, Loader } from "lucide-react"

interface Task {
  _id: string
  orderId: string
  status: string
  items: any[]
}

export default function PickupPartnerDashboard() {
  const [user, setUser] = useState<any>(null)
  const [assignedTasks, setAssignedTasks] = useState<Task[]>([])
  const [partnerInfo, setPartnerInfo] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user") || "{}")
    if (userData.role !== "partner") {
      router.push("/login")
      return
    }

    setUser(userData)
    fetchPartnerData(userData.id)
  }, [router])

  const fetchPartnerData = async (userId: string) => {
    try {
      const [tasksRes, partnerRes] = await Promise.all([
        fetch(`/api/shipments?partnerId=${userId}`),
        fetch(`/api/partners/${userId}`),
      ])

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json()
        setAssignedTasks(tasksData)
      }

      if (partnerRes.ok) {
        const partnerData = await partnerRes.json()
        setPartnerInfo(partnerData)
      }
    } catch (error) {
      console.error("Failed to fetch partner data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleTaskComplete = async (taskId: string) => {
    try {
      const response = await fetch(`/api/shipments/${taskId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "delivered" }),
      })

      if (response.ok) {
        fetchPartnerData(user.id)
      }
    } catch (error) {
      console.error("Error:", error)
    }
  }

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <p className="text-muted-foreground">Loading partner dashboard...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-foreground">Pickup Partner Dashboard</h1>
          {partnerInfo && (
            <p className="text-sm text-muted-foreground">
              {partnerInfo.name} • {partnerInfo.location}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Assigned Tasks</p>
            <p className="text-3xl font-bold text-primary">{assignedTasks.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Completed Today</p>
            <p className="text-3xl font-bold text-green-600">
              {assignedTasks.filter((t) => t.status === "delivered").length}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200">
            <p className="text-sm text-muted-foreground mb-2">Capacity Used</p>
            <p className="text-3xl font-bold text-accent">
              {partnerInfo ? Math.round((partnerInfo.currentInventory / partnerInfo.capacity) * 100) : 0}%
            </p>
          </div>
        </div>

        {/* Assigned Shipments */}
        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-200">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Package size={20} /> Assigned Shipments
            </h2>
          </div>

          {assignedTasks.length === 0 ? (
            <div className="p-12 text-center">
              <Loader size={48} className="text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">No tasks assigned yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Order ID</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Items</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Location</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-foreground">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {assignedTasks.map((task) => (
                    <tr key={task._id} className="border-b border-slate-200 hover:bg-slate-50">
                      <td className="px-6 py-4 font-semibold text-foreground">#{task.orderId.slice(-6)}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold ${
                            task.status === "delivered"
                              ? "bg-green-50 text-green-700"
                              : task.status === "in-transit"
                                ? "bg-blue-50 text-blue-700"
                                : "bg-yellow-50 text-yellow-700"
                          }`}
                        >
                          {task.status === "delivered" && <CheckCircle size={14} />}
                          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{task.items?.length || 0} items</td>
                      <td className="px-6 py-4 flex items-center gap-1 text-muted-foreground text-sm">
                        <MapPin size={14} /> View map
                      </td>
                      <td className="px-6 py-4">
                        {task.status !== "delivered" && (
                          <button
                            onClick={() => handleTaskComplete(task._id)}
                            className="bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold hover:bg-primary/90 transition"
                          >
                            Mark Delivered
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
