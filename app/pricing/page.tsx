import { PricingPlans } from "@/components/pricing/pricing-plans"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"

export const metadata = {
    title: "Pricing | MentorLagbe",
}

export default function PricingPage() {
    return (
        <section className="py-16 sm:py-20">
            <Container>
                <SectionHeading
                    eyebrow="Pricing"
                    title="Choose the plan that fits you"
                    description="Compare student and tutor plans, then upgrade whenever you are ready."
                    centered
                />

                <div className="mt-10">
                    <PricingPlans />
                </div>
            </Container>
        </section>
    )
}
