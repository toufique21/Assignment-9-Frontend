import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { PricingPlans } from "@/components/pricing/pricing-plans"

export function PricingSection() {
    return (
        <section className="py-16 sm:py-20" id="pricing">
            <Container>
                <SectionHeading
                    eyebrow="Pricing"
                    title="Simple plans for students and tutors"
                    description="Start for free, upgrade when you need more room to grow."
                    centered
                />

                <div className="mt-10">
                    <PricingPlans />
                </div>
            </Container>
        </section>
    )
}
