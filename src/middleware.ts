import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const { pathname } = req.nextUrl;

  console.log("Middleware - Token:", token);

  // Redirect unauthenticated users
  if (!token && pathname !== "/auth/signin") {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  // Role-based authorization
  if (pathname.startsWith("/admin") && token?.user.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  if (pathname.startsWith("/lab") && token?.user.role !== "lab_manager" && token?.user.role !== "admin" ) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  if (pathname.startsWith("/company") && token?.user.role !== "company_user") {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
  }

  // Protect the /profile route for authenticated users
  if (pathname === "/profile" && !token) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }
  return NextResponse.next();
}

// Apply middleware to specific routes
export const config = {
  matcher: ["/admin/:path*", "/lab/:path*", "/company/:path*"],
};
