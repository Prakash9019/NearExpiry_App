"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, CheckCircle, FileUp, Building2 } from "lucide-react"

export default function SellerOnboarding() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    companyName: "",
    gstNumber: "",
    bankAccountName: "",
    bankAccountNumber: "",
    bankIFSC: "",
    panNumber: "",
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const sellerId = localStorage.getItem("userId")
      const response = await fetch("/api/sellers/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sellerId, ...formData }),
      })

      if (response.ok) {
        setSuccess(true)
        setTimeout(() => {
          window.location.href = "/seller-dashboard"
        }, 2000)
      }
    } catch (error) {
      console.error("Submission error:", error)
    } finally {
      setSubmitting(false)
    }
  }

  const steps = [
    { number: 1, title: "Company Details", icon: Building2 },
    { number: 2, title: "Bank Information", icon: FileUp },
    { number: 3, title: "Upload Documents", icon: FileUp },
  ]

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center max-w-md">
          <CheckCircle size={64} className="text-green-600 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-foreground mb-2">Submitted Successfully!</h1>
          <p className="text-muted-foreground mb-8">
            Your verification request has been submitted. We'll review it within 24 hours.
          </p>
          <Link
            href="/seller-dashboard"
            className="inline-block bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-green-50 p-4">
      {/* Header */}
      <div className="max-w-4xl mx-auto mb-12">
        <Link href="/" className="text-primary font-semibold inline-flex items-center gap-2 mb-8">
          ← Back to Home
        </Link>
        <h1 className="text-4xl font-bold text-foreground mb-2">Seller Verification</h1>
        <p className="text-muted-foreground text-lg">Complete these steps to start selling on NearExpiry</p>
      </div>

      {/* Progress Steps */}
      <div className="max-w-4xl mx-auto mb-12">
        <div className="flex justify-between">
          {steps.map((s, idx) => (
            <div key={s.number} className="flex flex-col items-center flex-1">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg mb-2 transition ${
                  step >= s.number ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                }`}
              >
                {step > s.number ? <CheckCircle size={24} /> : s.number}
              </div>
              <p className="text-sm font-semibold text-center">{s.title}</p>
              {idx < steps.length - 1 && (
                <div
                  className={`hidden md:block absolute h-1 w-24 mt-6 ${step > s.number ? "bg-primary" : "bg-muted"}`}
                  style={{ marginLeft: "50%" }}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8">
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Company Details</h2>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleChange}
                  required
                  placeholder="Your company name"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">GST Number</label>
                <input
                  type="text"
                  name="gstNumber"
                  value={formData.gstNumber}
                  onChange={handleChange}
                  required
                  placeholder="15-digit GST number"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">PAN Number</label>
                <input
                  type="text"
                  name="panNumber"
                  value={formData.panNumber}
                  onChange={handleChange}
                  required
                  placeholder="10-character PAN"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Bank Information</h2>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Account Holder Name</label>
                <input
                  type="text"
                  name="bankAccountName"
                  value={formData.bankAccountName}
                  onChange={handleChange}
                  required
                  placeholder="Name on bank account"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">Account Number</label>
                <input
                  type="text"
                  name="bankAccountNumber"
                  value={formData.bankAccountNumber}
                  onChange={handleChange}
                  required
                  placeholder="Bank account number"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">IFSC Code</label>
                <input
                  type="text"
                  name="bankIFSC"
                  value={formData.bankIFSC}
                  onChange={handleChange}
                  required
                  placeholder="11-character IFSC code"
                  className="w-full px-4 py-3 border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Upload Documents</h2>
              <div className="border-2 border-dashed border-primary rounded-lg p-8 text-center">
                <FileUp size={40} className="text-primary mx-auto mb-3" />
                <p className="font-semibold text-foreground mb-1">Upload GST Certificate & Invoice Samples</p>
                <p className="text-muted-foreground text-sm mb-4">Drag and drop or click to upload PDF/JPG files</p>
                <input type="file" multiple className="hidden" accept=".pdf,.jpg,.jpeg,.png" />
                <button
                  type="button"
                  className="bg-primary text-primary-foreground px-6 py-2 rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Choose Files
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Maximum 5 files, 10MB each. Accepted formats: PDF, JPG, PNG
              </p>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-4 mt-8">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold hover:bg-primary/10 transition"
              >
                Previous
              </button>
            )}
            {step < 3 ? (
              <button
                type="button"
                onClick={() => setStep(step + 1)}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition flex items-center justify-center gap-2"
              >
                Next <ArrowRight size={20} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold hover:bg-primary/90 transition disabled:opacity-50"
              >
                {submitting ? "Submitting..." : "Submit for Verification"}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}
