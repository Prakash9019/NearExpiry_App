import Link from "next/link"
import { AlertCircle, ArrowRight } from "lucide-react"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <AlertCircle size={64} className="mx-auto text-muted-foreground mb-6 opacity-50" />
        <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
        <p className="text-xl text-muted-foreground mb-8">Page not found</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-lg font-bold hover:bg-primary/90 transition"
        >
          Back to Home <ArrowRight size={20} />
        </Link>
      </div>
    </div>
  )
}
