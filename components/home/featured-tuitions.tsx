import { ArrowRight } from "lucide-react"

import { ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { TuitionCard } from "@/components/ui/tuition-card"
import { getFeaturedTuitions } from "@/lib/tuitions"

export async function FeaturedTuitionsSection() {
    const tuitions = await getFeaturedTuitions()

    return (
        <section className="py-16 sm:py-20">
            <Container>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <SectionHeading
                        eyebrow="Featured"
                        title="Latest approved tuitions"
                        description="Hand-picked batches from verified tutors, ready for you to join."
                    />
                    <ButtonLink href="/tuitions" variant="ghost">
                        View all tuitions
                        <ArrowRight className="size-4" />
                    </ButtonLink>
                </div>

                <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {tuitions.map((tuition) => (
                        <TuitionCard key={tuition.id} tuition={tuition} />
                    ))}
                </div>
            </Container>
        </section>
    )
}
