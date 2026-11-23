import "./globals.css"

import { Footer } from "@/components/layout/footer"
import { Navbar } from "@/components/layout/navbar"
import { ThemeProvider } from "@/components/theme-provider"
import { ToastProvider } from "@/components/ui/toast"

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en" suppressHydrationWarning className="antialiased">
            <body className="flex min-h-svh flex-col">
                <ThemeProvider>
                    <ToastProvider>
                        <Navbar />
                        <main className="flex-1">{children}</main>
                        <Footer />
                    </ToastProvider>
                </ThemeProvider>
            </body>
        </html>
    )
}
