"use client"

import {
    ClipboardList,
    LayoutDashboard,
    Menu,
    PanelLeftClose,
    PanelLeftOpen,
    PlusCircle,
    ReceiptText,
    Users,
    X,
} from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import type { ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { getRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

const tutorLinks = [
    {
        href: "/dashboard/tutor",
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        href: "/dashboard/tutor/post-tuition",
        label: "Post Tuition",
        icon: PlusCircle,
    },
    {
        href: "/dashboard/tutor/my-tuitions",
        label: "My Tuitions",
        icon: ClipboardList,
    },
    {
        href: "/dashboard/tutor/applicants",
        label: "Applicants",
        icon: Users,
    },
]

const adminLinks = [
    {
        href: "/dashboard/admin",
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        href: "/dashboard/admin/users",
        label: "Users",
        icon: Users,
    },
    {
        href: "/dashboard/admin/tuitions",
        label: "Tuitions",
        icon: ClipboardList,
    },
    {
        href: "/dashboard/admin/transactions",
        label: "Transactions",
        icon: ReceiptText,
    },
]

const studentLinks = [
    {
        href: "/dashboard/student",
        label: "Overview",
        icon: LayoutDashboard,
    },
    {
        href: "/dashboard/student/my-applications",
        label: "My Applications",
        icon: ClipboardList,
    },
]

export function DashboardShell({ children }: { children: ReactNode }) {
    const pathname = usePathname()
    const [collapsed, setCollapsed] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const session = authClient.useSession()
    const role = getRole(
        (session.data?.user as { role?: string | null } | undefined)?.role
    )
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1)
    const links =
        role === "admin"
            ? adminLinks
            : role === "tutor"
              ? tutorLinks
              : studentLinks
    const current =
        links.find((link) => link.href === pathname) ??
        links[0] ?? {
            href: pathname,
            label: "Dashboard",
            icon: LayoutDashboard,
        }

    return (
        <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            {mobileOpen ? (
                <button
                    type="button"
                    aria-label="Close menu"
                    onClick={() => setMobileOpen(false)}
                    className="fixed inset-x-0 top-24 bottom-0 z-30 bg-black/20 backdrop-blur-sm lg:hidden"
                />
            ) : null}

            <div className="flex items-start gap-5">
                <aside
                    className={cn(
                        "glass-surface fixed top-24 bottom-6 left-4 z-40 flex w-60 flex-col rounded-3xl p-3 lg:static lg:inset-auto lg:block lg:shrink-0",
                        collapsed ? "lg:w-16" : "lg:w-60",
                        mobileOpen ? "block" : "hidden"
                    )}
                >
                    <div className="flex items-center justify-between gap-2 px-3 py-2">
                        <p
                            className={cn(
                                "text-xs font-semibold tracking-wide text-muted-foreground uppercase",
                                collapsed && "lg:hidden"
                            )}
                        >
                            {roleLabel} menu
                        </p>
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label="Close menu"
                            onClick={() => setMobileOpen(false)}
                            className="lg:hidden"
                        >
                            <X />
                        </Button>
                    </div>
                    <nav className="space-y-1">
                        {links.map((link) => {
                            const Icon = link.icon
                            const isActive = pathname === link.href

                            return (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    title={collapsed ? link.label : undefined}
                                    onClick={() => setMobileOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
                                        isActive
                                            ? "bg-primary/15 text-primary"
                                            : "text-muted-foreground hover:bg-[var(--glass-tint-soft)] hover:text-foreground",
                                        collapsed && "lg:justify-center lg:px-0"
                                    )}
                                >
                                    <Icon className="size-4 shrink-0" />
                                    <span className={cn(collapsed && "lg:hidden")}>
                                        {link.label}
                                    </span>
                                </Link>
                            )
                        })}
                    </nav>
                    <div className="mt-auto hidden pt-3 lg:block">
                        <button
                            type="button"
                            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
                            aria-label={
                                collapsed ? "Expand sidebar" : "Collapse sidebar"
                            }
                            aria-expanded={!collapsed}
                            onClick={() => setCollapsed((value) => !value)}
                            className={cn(
                                "flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-muted-foreground transition hover:bg-[var(--glass-tint-soft)] hover:text-foreground",
                                collapsed && "justify-center px-0"
                            )}
                        >
                            {collapsed ? (
                                <PanelLeftOpen className="size-4 shrink-0" />
                            ) : (
                                <PanelLeftClose className="size-4 shrink-0" />
                            )}
                            <span className={cn(collapsed && "lg:hidden")}>
                                {collapsed ? "Expand" : "Collapse"}
                            </span>
                        </button>
                    </div>
                </aside>

                <div className="min-w-0 flex-1 space-y-5">
                    <div className="glass-surface flex items-center gap-3 rounded-2xl px-4 py-3">
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon-sm"
                            aria-label={mobileOpen ? "Close menu" : "Open menu"}
                            aria-expanded={mobileOpen}
                            onClick={() => setMobileOpen((open) => !open)}
                            className="lg:hidden"
                        >
                            {mobileOpen ? <X /> : <Menu />}
                        </Button>
                        <div className="min-w-0">
                            <h1 className="font-heading truncate text-lg font-semibold">
                                {current.label}
                            </h1>
                            <p className="hidden text-xs text-muted-foreground sm:block">
                                {roleLabel} dashboard
                            </p>
                        </div>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    )
}
