import { NextResponse } from "next/server"

const SESSION_COOKIE = "better-auth.session_token"

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

    const sessionToken = request.cookies.get(SESSION_COOKIE)?.value

    if (!sessionToken) {
        return NextResponse.redirect(new URL("/sign-in", request.url))
    }

    return NextResponse.next()
}

export const config = {
    matcher: ["/dashboard/:path*", "/tuitions/:path*", "/payment/:path*"],
}
