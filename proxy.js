import { NextResponse } from "next/server"

const SESSION_COOKIE_NAMES = [
    "better-auth.session_token",
    "__Secure-better-auth.session_token",
    "better-auth.session_data",
    "__Secure-better-auth.session_data",
]

function isProtectedPath(pathname) {
    if (pathname === "/dashboard" || pathname.startsWith("/dashboard/")) {
        return true
    }

    // Browse list is public, but individual tuition details require sign-in.
    if (pathname.startsWith("/tuitions/")) {
        return true
    }

    return pathname.startsWith("/payment/")
}

export function proxy(request) {
    const { pathname } = request.nextUrl

    if (!isProtectedPath(pathname)) {
        return NextResponse.next()
    }

    const hasSessionCookie = SESSION_COOKIE_NAMES.some((name) =>
        Boolean(request.cookies.get(name)?.value)
    )

    if (!hasSessionCookie) {
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/tuitions/:path*", "/payment/:path*"],
}
