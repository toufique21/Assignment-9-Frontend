import {
    ClipboardList,
    GraduationCap,
    Search,
    UserPlus,
    type LucideIcon,
} from "lucide-react"

import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"

type Step = {
    icon: LucideIcon
    title: string
    description: string
}

const steps: Step[] = [
    {
        icon: UserPlus,
        title: "Create your profile",
        description: "Sign up as a student or tutor in less than a minute.",
    },
    {
        icon: Search,
        title: "Find the right match",
        description: "Filter by subject, class level, mode and monthly budget.",
    },
    {
        icon: ClipboardList,
        title: "Apply with one click",
        description: "Send your details and let the tutor review your request.",
    },
    {
        icon: GraduationCap,
        title: "Start learning",
        description: "Join online or offline sessions and track every step.",
    },
]

export function HowItWorksSection() {
    return (
        <section id="how-it-works" className="scroll-mt-24 py-16 sm:py-20">
            <Container>
                <SectionHeading
                    eyebrow="How it works"
                    title="From search to your first class"
                    description="Four simple steps connect the right learner with the right mentor."
                    centered
                />

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                    {steps.map((step, index) => {
                        const Icon = step.icon

                        return (
                            <article
                                key={step.title}
                                className="glass-surface relative h-full rounded-3xl p-6"
                            >
                                <span className="absolute top-5 right-5 font-heading text-3xl font-semibold text-primary/20">
                                    0{index + 1}
                                </span>
                                <span className="flex size-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Icon className="size-5" />
                                </span>
                                <h3 className="mt-5 font-heading text-lg font-semibold">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {step.description}
                                </p>
                            </article>
                        )
                    })}
                </div>
            </Container>
        </section>
    )
}
