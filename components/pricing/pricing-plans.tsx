"use client"

import { Check } from "lucide-react"
import { useState } from "react"

import { ButtonLink, buttonVariants } from "@/components/ui/button"
import { audiences, plans, type Audience } from "@/lib/pricing"
import { cn } from "@/lib/utils"

export function PricingPlans() {
    const [audience, setAudience] = useState<Audience>("student")
    const visiblePlans = plans.filter((plan) => plan.audience === audience)

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
                                variant: audience === option.value ? "default" : "ghost",
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
                {visiblePlans.map((plan) => (
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
                                <li key={feature} className="flex items-start gap-2">
                                    <Check className="mt-0.5 size-4 shrink-0 text-[#34c759]" />
                                    <span>{feature}</span>
                                </li>
                            ))}
                        </ul>

                        <ButtonLink
                            href={plan.href}
                            variant={plan.highlighted ? "default" : "secondary"}
                            className="w-full"
                        >
                            {plan.cta}
                        </ButtonLink>
                    </article>
                ))}
            </div>
        </div>
    )
}
