"use client"

import { Check, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { Button, ButtonLink, buttonVariants } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import {
    getRequestStatus,
    startPremiumCheckout,
} from "@/lib/payment-client"
import type { PremiumAudience } from "@/lib/payment-config"
import { audiences, plans, type Audience } from "@/lib/pricing"
import { getRole } from "@/lib/roles"
import { cn } from "@/lib/utils"

export function PricingPlans() {
    const router = useRouter()
    const { notify } = useToast()
    const session = authClient.useSession()
    const user = session.data?.user as
        | { role?: string | null; plan?: string | null }
        | undefined
    const role = getRole(user?.role)
    const isSignedIn = Boolean(user)
    const isAdmin = role === "admin"
    const isPremium = user?.plan === "pro"
    const [audience, setAudience] = useState<Audience>("student")
    const [busy, setBusy] = useState<PremiumAudience | null>(null)
    const visiblePlans = plans.filter((plan) => plan.audience === audience)

    async function handleCheckout(target: PremiumAudience) {
        setBusy(target)

        try {
            const url = await startPremiumCheckout(target)
            window.location.assign(url)
        } catch (error) {
            const status = getRequestStatus(error)

            if (status === 401) {
                notify("Sign in to purchase Premium.", "error")
                router.push("/sign-in")
                return
            }

            const message =
                error instanceof Error ? error.message : "Could not start checkout."

            notify(message, "error")

            if (status === 409) {
                router.refresh()
            }
        } finally {
            setBusy(null)
        }
    }

    return (
        <div className="space-y-8">
            <div
                role="group"
                aria-label="Choose pricing type"
                className="glass-surface mx-auto flex w-fit gap-1 rounded-full p-1"
            >
                {audiences.map((option) => (
                    <button
                        key={option.value}
                        type="button"
                        aria-pressed={audience === option.value}
                        onClick={() => setAudience(option.value)}
                        className={cn(
                            buttonVariants({
                                variant:
                                    audience === option.value
                                        ? "default"
                                        : "ghost",
                                size: "sm",
                            }),
                            "rounded-full"
                        )}
                    >
                        {option.label}
                    </button>
                ))}
            </div>

            <div className="mx-auto grid max-w-3xl gap-5 sm:grid-cols-2">
                {visiblePlans.map((plan) => {
                    const isPro = plan.name === "Pro"
                    const wrongRole = Boolean(user) && role !== plan.audience
                    const isBusy = busy === plan.audience

                    return (
                        <article
                            key={plan.name}
                            className={cn(
                                "glass-surface flex h-full flex-col gap-5 rounded-3xl p-6",
                                plan.highlighted && "ring-2 ring-primary/60"
                            )}
                        >
                            <div className="space-y-1">
                                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                    {plan.audience} plan
                                </p>
                                <h3 className="font-heading text-xl font-semibold">
                                    {plan.name}
                                </h3>
                            </div>

                            <div>
                                <p className="font-heading text-3xl font-semibold">
                                    {plan.price}
                                </p>
                                <p className="mt-1 text-sm text-muted-foreground">
                                    {plan.note}
                                </p>
                            </div>

                            <ul className="flex-1 space-y-3 text-sm">
                                {plan.features.map((feature) => (
                                    <li
                                        key={feature}
                                        className="flex items-start gap-2"
                                    >
                                        <Check className="mt-0.5 size-4 shrink-0 text-[#34c759]" />
                                        <span>{feature}</span>
                                    </li>
                                ))}
                            </ul>

                            {!session.isPending &&
                                !isAdmin &&
                                (isPro ? (
                                    wrongRole ? (
                                        <Button
                                            type="button"
                                            disabled
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            Not allowed
                                        </Button>
                                    ) : isPremium ? (
                                        <ButtonLink
                                            href={`/dashboard/${role}`}
                                            variant="secondary"
                                            className="w-full"
                                        >
                                            Premium active
                                        </ButtonLink>
                                    ) : (
                                        <Button
                                            type="button"
                                            onClick={() =>
                                                handleCheckout(
                                                    plan.audience as PremiumAudience
                                                )
                                            }
                                            disabled={busy !== null}
                                            variant={
                                                plan.highlighted
                                                    ? "default"
                                                    : "secondary"
                                            }
                                            className="w-full"
                                        >
                                            {isBusy ? (
                                                <>
                                                    <Loader2 className="size-4 animate-spin" />
                                                    Opening checkout...
                                                </>
                                            ) : (
                                                plan.cta
                                            )}
                                        </Button>
                                    )
                                ) : !isSignedIn ? (
                                    <ButtonLink
                                        href={plan.href}
                                        variant={
                                            plan.highlighted
                                                ? "default"
                                                : "secondary"
                                        }
                                        className="w-full"
                                    >
                                        {plan.cta}
                                    </ButtonLink>
                                ) : null)}
                        </article>
                    )
                })}
            </div>
        </div>
    )
}
