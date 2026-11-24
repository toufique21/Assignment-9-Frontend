export type PremiumAudience = "student" | "tutor"

export type PremiumPrice = {
    audience: PremiumAudience
    amountCents: number
    currency: "usd"
    productName: string
    planName: "Pro Student" | "Pro Tutor"
}

export const premiumPrices: Record<PremiumAudience, PremiumPrice> = {
    student: {
        audience: "student",
        amountCents: 1000,
        currency: "usd",
        productName: "MentorLagbe Premium - Student",
        planName: "Pro Student",
    },
    tutor: {
        audience: "tutor",
        amountCents: 1500,
        currency: "usd",
        productName: "MentorLagbe Premium - Tutor",
        planName: "Pro Tutor",
    },
}

export function getPremiumPrice(role?: string | null): PremiumPrice | null {
    if (role === "student" || role === "tutor") {
        return premiumPrices[role]
    }

    return null
}

export function formatPremiumPrice(audience: PremiumAudience) {
    const price = premiumPrices[audience]

    return `$${price.amountCents / 100} one-time`
}
