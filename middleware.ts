import { type NextRequest, NextResponse } from "next/server"
import { getAuthToken, verifyToken } from "./lib/auth"

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  const protectedPaths = ["/orders", "/profile", "/seller-dashboard", "/checkout"]
  const sellerPaths = ["/seller-dashboard"]

  if (protectedPaths.some((path) => pathname.startsWith(path))) {
    const token = await getAuthToken()

    if (!token || !verifyToken(token)) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/orders/:path*", "/profile/:path*", "/seller-dashboard/:path*", "/checkout/:path*"],
}
