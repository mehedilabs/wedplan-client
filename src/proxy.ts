
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth";

type UserRole = "customer" | "vendor" | "admin";

const dashboardPaths: Record<UserRole, string> = {
  customer: "/dashboard/customer",
  vendor: "/dashboard/vendor",
  admin: "/dashboard/admin",
};

function isUserRole(role: unknown): role is UserRole {
  return (
    role === "customer" ||
    role === "vendor" ||
    role === "admin"
  );
}

function isPathWithin(pathname: string, basePath: string) {
  return (
    pathname === basePath ||
    pathname.startsWith(`${basePath}/`)
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAuthPage =
    pathname === "/login" || pathname === "/signup";

  const isDashboardPage =
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/");

  if (!isAuthPage && !isDashboardPage) {
    return NextResponse.next();
  }

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const user = session?.user;

  const rawRole = (
    user as { role?: unknown } | undefined
  )?.role;

  const role = isUserRole(rawRole) ? rawRole : null;

  // Logged-in users cannot access Login or Signup.
  if (isAuthPage && user) {
    const url = request.nextUrl.clone();
    url.pathname = role ? dashboardPaths[role] : "/";
    url.search = "";

    return NextResponse.redirect(url);
  }

  // Protect all dashboard routes.
  if (isDashboardPage) {
    if (!user) {
      const url = request.nextUrl.clone();
      url.pathname = "/login";
      url.search = "";

      return NextResponse.redirect(url);
    }

    if (!role) {
      const url = request.nextUrl.clone();
      url.pathname = "/";
      url.search = "";

      return NextResponse.redirect(url);
    }

    const correctDashboard = dashboardPaths[role];

    // Redirect /dashboard to the user's own dashboard.
    if (pathname === "/dashboard") {
      const url = request.nextUrl.clone();
      url.pathname = correctDashboard;
      url.search = "";

      return NextResponse.redirect(url);
    }

    // Prevent access to another role's dashboard.
    if (!isPathWithin(pathname, correctDashboard)) {
      const url = request.nextUrl.clone();
      url.pathname = correctDashboard;
      url.search = "";

      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/login",
    "/signup",
    "/dashboard",
    "/dashboard/:path*",
  ],
};
