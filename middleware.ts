import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import { getToken } from "next-auth/jwt";

const i18nMiddleware = createMiddleware(routing);
const protectedPaths = ["/dashboard", "/test"];

// Landing page paths yang tidak boleh diakses oleh authenticated users
const landingPagePaths = ["/", "/features", "/pricing"];

// RBAC: role-based access control
const roleBlockedRoutes: Record<string, string[]> = {
  teacher: [
    "/dashboard/reading",
    "/dashboard/listening",
    "/dashboard/speaking",
    "/dashboard/writing",
  ],
  student: [
    // Student tidak bisa create test (hanya bisa mengerjakan test)
    "/test/reading/create",
    "/test/listening/create",
    "/test/speaking/create",
    "/test/writing/create",
  ],
};

// Helper function untuk check apakah path adalah create test route
function isCreateTestRoute(pathname: string): boolean {
  return /^\/test\/(reading|listening|speaking|writing)\/create/.test(pathname);
}

// Helper function untuk check apakah path adalah landing page
function isLandingPagePath(pathname: string): boolean {
  const pathWithoutLocale = pathname.replace(/^\/(en|vi)/, "") || "/";

  return landingPagePaths.some((landingPath) => {
    if (landingPath === "/") {
      return pathWithoutLocale === "/";
    }
    return pathWithoutLocale.startsWith(landingPath);
  });
}

export default async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // --- Jalankan i18n hanya untuk route i18n ---
  if (
    pathname === "/" ||
    pathname.startsWith("/en") ||
    pathname.startsWith("/vi")
  ) {
    // Check jika user sudah login dan mengakses landing page
    if (token && isLandingPagePath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard/profile", req.url));
    }

    const i18nResponse = await i18nMiddleware(req);
    if (i18nResponse) return i18nResponse;
  }

  // --- Auth check untuk protected routes ---
  const isProtected = protectedPaths.some((path) => pathname.startsWith(path));
  if (isProtected && !token) {
    const loginUrl = new URL("/auth/sign-in", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // --- RBAC check ---
  const role = token?.role as string | undefined;

  // Student tidak boleh akses create test routes
  if (role === "student" && isCreateTestRoute(pathname)) {
    return NextResponse.redirect(new URL("/dashboard/profile", req.url));
  }

  // Check role blocked routes
  if (role && roleBlockedRoutes[role]) {
    const blocked = roleBlockedRoutes[role].some((route) =>
      pathname.startsWith(route),
    );
    if (blocked) {
      return NextResponse.redirect(new URL("/dashboard/profile", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/(en|vi)/:path*",
    "/dashboard/:path*",
    "/test/:path*",
    "/features/:path*",
    "/pricing/:path*",
  ],
};
