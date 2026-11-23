export type NavigationLink = {
    label: string
    href: string
}

export const publicLinks: NavigationLink[] = [
    { label: "Home", href: "/" },
    { label: "Browse Tuitions", href: "/tuitions" },
    { label: "Pricing", href: "/pricing" },
    { label: "How It Works", href: "/#how-it-works" },
]
