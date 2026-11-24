import { formatPremiumPrice } from "@/lib/payment-config"

export type Audience = "student" | "tutor"

export type Plan = {
    audience: Audience
    name: "Free" | "Pro"
    price: string
    note: string
    features: string[]
    cta: string
    href: string
    highlighted?: boolean
}

export const plans: Plan[] = [
    {
        audience: "student",
        name: "Free",
        price: "$0",
        note: "Everything you need to get started",
        features: [
            "Browse approved tuitions",
            "Apply to tuition batches",
            "5 saved tuitions",
        ],
        cta: "Start Free",
        href: "/sign-up",
    },
    {
        audience: "student",
        name: "Pro",
        price: formatPremiumPrice("student"),
        note: "For serious learners",
        features: [
            "Unlimited saved tuitions",
            "Priority booking",
            "Verified learner badge",
        ],
        cta: "Buy Premium",
        href: "/pricing",
        highlighted: true,
    },
    {
        audience: "tutor",
        name: "Free",
        price: "$0",
        note: "Share your first batches",
        features: ["Post up to 2 tuitions", "Manage applicants", "Profile page"],
        cta: "Start Free",
        href: "/sign-up",
    },
    {
        audience: "tutor",
        name: "Pro",
        price: formatPremiumPrice("tutor"),
        note: "For professional mentors",
        features: [
            "Unlimited tuition posts",
            "Verified tutor badge",
            "Priority listing",
        ],
        cta: "Buy Premium",
        href: "/pricing",
        highlighted: true,
    },
]

export const audiences: { value: Audience; label: string }[] = [
    { value: "student", label: "Student prices" },
    { value: "tutor", label: "Tutor prices" },
]
