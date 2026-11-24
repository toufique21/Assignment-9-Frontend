import { Mail, MapPin, Phone } from "lucide-react"
import Link from "next/link"
import type { ReactNode } from "react"

import { Brand } from "@/components/layout/brand"
import {
    InstagramIcon,
    LinkedInIcon,
    XIcon,
} from "@/components/layout/social-icons"
import { buttonVariants } from "@/components/ui/button"
import { publicLinks } from "@/lib/navigation"
import { cn } from "@/lib/utils"

const socials: { label: string; href: string; icon: ReactNode }[] = [
    { label: "X", href: "https://x.com", icon: <XIcon className="size-4" /> },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com",
        icon: <LinkedInIcon className="size-4" />,
    },
    {
        label: "Instagram",
        href: "https://www.instagram.com",
        icon: <InstagramIcon className="size-4" />,
    },
]

export function Footer() {
    return (
        <footer className="mt-20 border-t border-border/70 bg-[var(--nav-bg)] backdrop-blur-xl backdrop-saturate-150">
            <div className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="glass-surface grid gap-8 rounded-3xl p-8 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="space-y-4">
                        <Brand />
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
                            Find verified tutors and mentorship batches by subject,
                            class level, mode and budget — all in one place.
                        </p>
                        <div className="flex items-center gap-2">
                            {socials.map((social) => (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    aria-label={social.label}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={cn(
                                        buttonVariants({ variant: "ghost", size: "icon-sm" })
                                    )}
                                >
                                    {social.icon}
                                </a>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="mb-3 text-sm font-semibold text-foreground">
                            Explore
                        </h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            {publicLinks.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="transition-colors hover:text-foreground"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-sm font-semibold text-foreground">
                            Account
                        </h2>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link
                                    href="/sign-in"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Sign In
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/sign-up"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Sign Up
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/profile"
                                    className="transition-colors hover:text-foreground"
                                >
                                    Update Profile
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h2 className="mb-3 text-sm font-semibold text-foreground">
                            Contact
                        </h2>
                        <ul className="space-y-3 text-sm text-muted-foreground">
                            <li className="flex items-center gap-2">
                                <Mail className="size-4 shrink-0" />
                                mentor@lagbe.com
                            </li>
                            <li className="flex items-center gap-2">
                                <Phone className="size-4 shrink-0" />
                                +880 1700-000000
                            </li>
                            <li className="flex items-center gap-2">
                                <MapPin className="size-4 shrink-0" />
                                Dhaka, Bangladesh
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-6 flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
                    <p>
                        © {new Date().getFullYear()} MentorLagbe. All rights reserved.
                    </p>
                    <p>Built for students and tutors, everywhere.</p>
                </div>
            </div>
        </footer>
    )
}
