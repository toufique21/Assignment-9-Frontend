"use client"

import {
    ChevronDown,
    LayoutDashboard,
    LogOut,
    Menu,
    UserRound,
    X,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect, useRef, useState } from "react"

import { Brand } from "@/components/layout/brand"
import { ButtonLink } from "@/components/ui/button"
import { PremiumCrown } from "@/components/ui/premium-crown"
import { useToast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { publicLinks } from "@/lib/navigation"
import { getRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

type NavUser = {
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
    plan?: string | null
}

type SessionState = ReturnType<typeof authClient.useSession>

const roleStyles = {
    student: "bg-[#b86500]/15 text-[#8a4e00] dark:text-[#d98a2b]",
    tutor: "bg-[#34c759]/15 text-[#248a3d] dark:text-[#75e28b]",
    admin: "bg-[#5e5ce6]/15 text-[#4b49c7] dark:text-[#a7a5ff]",
}

const planStyles = {
    free: "bg-[var(--glass-tint-soft)] text-muted-foreground",
    premium:
        "bg-[#7c3aed]/12 text-[#6d28d9] ring-1 ring-[#7c3aed]/25 dark:text-[#c4b5fd]",
}

function displayName(user: NavUser) {
    return user.name?.trim() || user.email?.split("@")[0] || "Account"
}

function isPremium(user: NavUser) {
    return user.plan === "pro"
}

function isActive(href: string, pathname: string) {
    if (href.startsWith("/#")) return false
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
}

function Avatar({ user }: { user: NavUser }) {
    const initial = displayName(user).charAt(0).toUpperCase()
    const hasImage =
        user.image && (user.image.startsWith("http") || user.image.startsWith("/"))

    return (
        <span className="relative inline-flex size-8 shrink-0">
            {hasImage ? (
                <Image
                    src={user.image as string}
                    alt=""
                    width={32}
                    height={32}
                    unoptimized
                    className="size-8 rounded-full object-cover ring-1 ring-white/40"
                />
            ) : (
                <span className="flex size-8 items-center justify-center rounded-full bg-gradient-to-br from-[#b86500] to-[#5e5ce6] text-xs font-semibold text-white ring-1 ring-white/40">
                    {initial}
                </span>
            )}
            {isPremium(user) ? (
                <PremiumCrown className="absolute -top-1 -right-1" />
            ) : null}
        </span>
    )
}

function UserMenu({
    user,
    onNavigate,
}: {
    user: NavUser
    onNavigate?: () => void
}) {
    const [open, setOpen] = useState(false)
    const [signingOut, setSigningOut] = useState(false)
    const containerRef = useRef<HTMLDivElement>(null)
    const router = useRouter()
    const { notify } = useToast()
    const role = getRole(user.role)

    useEffect(() => {
        if (!open) return

        function closeOnOutsideClick(event: MouseEvent) {
            if (!containerRef.current?.contains(event.target as Node)) {
                setOpen(false)
            }
        }

        function closeOnEscape(event: KeyboardEvent) {
            if (event.key === "Escape") setOpen(false)
        }

        document.addEventListener("mousedown", closeOnOutsideClick)
        document.addEventListener("keydown", closeOnEscape)

        return () => {
            document.removeEventListener("mousedown", closeOnOutsideClick)
            document.removeEventListener("keydown", closeOnEscape)
        }
    }, [open])

    async function handleSignOut() {
        setSigningOut(true)

        try {
            await authClient.signOut()
            notify("Signed out successfully")
            setOpen(false)
            onNavigate?.()
            router.replace("/")
            router.refresh()
        } catch {
            notify("Could not sign out. Please try again.", "error")
        } finally {
            setSigningOut(false)
        }
    }

    function navigate() {
        setOpen(false)
        onNavigate?.()
    }

    return (
        <div className="relative" ref={containerRef}>
            <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-haspopup="menu"
                className="flex items-center gap-2 rounded-full p-1 pr-2 transition-colors hover:bg-[var(--glass-tint-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
            >
                <Avatar user={user} />
                <span className="max-w-24 truncate text-sm font-medium">
                    {displayName(user)}
                </span>
                <ChevronDown
                    className={cn(
                        "size-4 text-muted-foreground transition-transform",
                        open && "rotate-180"
                    )}
                />
            </button>

            {open && (
                <div
                    role="menu"
                    className="glass-surface absolute top-[calc(100%+0.75rem)] right-0 w-60 rounded-2xl p-2"
                >
                    <div className="flex items-start justify-between gap-2 px-3 py-2">
                        <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                                <p className="min-w-0 truncate text-sm font-semibold">
                                    {displayName(user)}
                                </p>
                                <span
                                    className={cn(
                                        "shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold capitalize tracking-wide",
                                        roleStyles[role]
                                    )}
                                >
                                    {role}
                                </span>
                            </div>
                            <p className="truncate text-xs text-muted-foreground">
                                {user.email}
                            </p>
                        </div>
                        <span
                            className={cn(
                                "mt-0.5 shrink-0 rounded-full px-2 py-0.5 text-[0.65rem] font-semibold tracking-wide",
                                isPremium(user)
                                    ? planStyles.premium
                                    : planStyles.free
                            )}
                        >
                            {isPremium(user) ? "Premium" : "Free"}
                        </span>
                    </div>
                    <div className="my-1 h-px bg-border" />
                    <Link
                        href={`/dashboard/${role}`}
                        role="menuitem"
                        onClick={navigate}
                        className="nav-link w-full justify-start rounded-xl"
                    >
                        <LayoutDashboard className="size-4" />
                        Dashboard
                    </Link>
                    <Link
                        href="/dashboard/profile"
                        role="menuitem"
                        onClick={navigate}
                        className="nav-link w-full justify-start rounded-xl"
                    >
                        <UserRound className="size-4" />
                        Update Profile
                    </Link>
                    <div className="my-1 h-px bg-border" />
                    <button
                        type="button"
                        role="menuitem"
                        onClick={handleSignOut}
                        disabled={signingOut}
                        className="nav-link w-full justify-start rounded-xl text-destructive hover:text-destructive"
                    >
                        <LogOut className="size-4" />
                        {signingOut ? "Signing out..." : "Sign Out"}
                    </button>
                </div>
            )}
        </div>
    )
}

function AuthControls({
    session,
    onNavigate,
}: {
    session: SessionState
    onNavigate?: () => void
}) {
    const user = session.data?.user as NavUser | undefined

    if (session.isPending) {
        return (
            <div
                aria-hidden="true"
                className="h-10 w-36 animate-pulse rounded-full bg-[var(--glass-tint-soft)]"
            />
        )
    }

    if (user) {
        return <UserMenu user={user} onNavigate={onNavigate} />
    }

    return (
        <div className="flex items-center gap-2">
            <ButtonLink
                href="/sign-in"
                variant="secondary"
                size="sm"
                onClick={onNavigate}
            >
                Sign In
            </ButtonLink>
            <ButtonLink href="/sign-up" size="sm" onClick={onNavigate}>
                Sign Up
            </ButtonLink>
        </div>
    )
}

function NavLinks({
    pathname,
    stacked = false,
    onNavigate,
}: {
    pathname: string
    stacked?: boolean
    onNavigate?: () => void
}) {
    return (
        <nav
            aria-label="Main navigation"
            className={stacked ? "flex flex-col gap-1" : "flex items-center gap-1"}
        >
            {publicLinks.map((link) => {
                const active = isActive(link.href, pathname)

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        data-active={active}
                        aria-current={active ? "page" : undefined}
                        onClick={onNavigate}
                        className={cn(
                            "nav-link",
                            stacked && "w-full justify-start rounded-xl"
                        )}
                    >
                        {link.label}
                    </Link>
                )
            })}
        </nav>
    )
}

export function Navbar() {
    const pathname = usePathname()
    const session = authClient.useSession()
    const [menuOpen, setMenuOpen] = useState(false)

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150">
            <div className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
                <Brand />

                <div className="hidden items-center gap-6 md:flex">
                    <NavLinks pathname={pathname} />
                    <AuthControls session={session} />
                </div>

                <button
                    type="button"
                    onClick={() => setMenuOpen((value) => !value)}
                    aria-label={
                        menuOpen ? "Close navigation menu" : "Open navigation menu"
                    }
                    aria-expanded={menuOpen}
                    aria-controls="mobile-navigation"
                    className="flex size-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-[var(--glass-tint-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:hidden"
                >
                    {menuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </button>
            </div>

            {menuOpen && (
                <div
                    id="mobile-navigation"
                    className="glass-surface mx-4 mb-3 rounded-3xl p-3 sm:mx-6 md:hidden"
                >
                    <NavLinks
                        pathname={pathname}
                        stacked
                        onNavigate={() => setMenuOpen(false)}
                    />
                    <div className="my-3 h-px bg-border" />
                    <AuthControls
                        session={session}
                        onNavigate={() => setMenuOpen(false)}
                    />
                </div>
            )}
        </header>
    )
}
