import "./globals.css"

import { headers } from "next/headers"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast"
import { auth } from "@/lib/auth"
import {
    SessionProvider,
    type SessionPayload,
} from "@/lib/session-context"

export const dynamic = "force-dynamic"

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    const session = await auth.api.getSession({ headers: await headers() })
    const initialData = session?.user
        ? (session as unknown as SessionPayload)
        : null

    return (
        <html lang="en" suppressHydrationWarning className="antialiased">
            <body className="flex min-h-svh flex-col">
                <SessionProvider initialData={initialData}>
                    <ThemeProvider>
                        <ToastProvider>
                            <Navbar />
                            <main className="flex-1">{children}</main>
                            <Footer />
                        </ToastProvider>
                    </ThemeProvider>
                </SessionProvider>
            </body>
        </html>
    )
}
