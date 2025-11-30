"use client"

import Link from "next/link"
import { Shield, CheckCircle, Eye, Award } from "lucide-react"

export default function TrustVerification() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-3 mb-6">
            <Shield size={40} className="text-primary" />
            <div>
              <h1 className="text-4xl font-bold text-foreground">Trust & Verification</h1>
              <p className="text-muted-foreground">How we ensure product safety and seller authenticity</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Trust Badges */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Our Verification Badges</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-green-100">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Verified Seller</h3>
                <p className="text-muted-foreground text-sm">
                  Seller has completed identity verification, GST registration check, and bank account validation.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-blue-100">
                  <Eye size={24} className="text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">AI Expiry Verification</h3>
                <p className="text-muted-foreground text-sm">
                  Product expiry dates automatically verified using OCR technology from uploaded documents.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-purple-100">
                  <Award size={24} className="text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Authentic Products</h3>
                <p className="text-muted-foreground text-sm">
                  Products sourced directly from wholesalers with authentic invoices and packaging verification.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-orange-100">
                  <Shield size={24} className="text-orange-600" />
                </div>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Safety Guarantee</h3>
                <p className="text-muted-foreground text-sm">
                  All products inspected for tampering, proper storage conditions, and manufacturing integrity.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Verification Process */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-8">Seller Verification Process</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: "Profile Verification",
                description: "Seller completes profile with company details, GST number, and PAN.",
              },
              {
                step: 2,
                title: "Document Review",
                description: "Our team verifies GST registration and business legitimacy.",
              },
              {
                step: 3,
                title: "Bank Account Validation",
                description: "Bank details verified for secure payout processing.",
              },
              {
                step: 4,
                title: "Product Inspection",
                description: "Sample products inspected for authenticity and expiry confirmation.",
              },
              {
                step: 5,
                title: "Go Live",
                description: "Seller badge displayed on profile. Can start listing products immediately.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary text-primary-foreground font-bold">
                    {item.step}
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-foreground">{item.title}</h3>
                  <p className="text-muted-foreground text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Product Inspection */}
        <div className="bg-white p-8 rounded-xl border border-slate-200 mb-12">
          <h2 className="text-2xl font-bold text-foreground mb-6">Product Expiry Verification</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-foreground mb-2">AI-Powered OCR Scanning</h3>
              <p className="text-muted-foreground text-sm">
                We use advanced image recognition to automatically detect and verify expiry dates from product packaging
                and invoice documents.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Manual Review</h3>
              <p className="text-muted-foreground text-sm">
                For disputed or unclear dates, our verification team manually reviews high-resolution images.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-foreground mb-2">Ongoing Monitoring</h3>
              <p className="text-muted-foreground text-sm">
                Product expiry status continuously monitored. Items automatically removed 3 days before expiry.
              </p>
            </div>
          </div>
        </div>

        {/* Buyer Protection */}
        <div className="bg-gradient-to-r from-primary to-secondary text-primary-foreground p-8 rounded-xl mb-12">
          <h2 className="text-2xl font-bold mb-6">Our Buyer Protection Policy</h2>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>Full refund if product arrives expired or damaged</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>Dispute resolution within 48 hours</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>Free replacement for quality issues</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
              <span>24/7 customer support for complaints</span>
            </li>
          </ul>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-6">Questions about verification? Contact our trust team.</p>
          <Link
            href="/"
            className="inline-block bg-primary text-primary-foreground px-8 py-3 rounded-lg font-semibold hover:bg-primary/90 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
