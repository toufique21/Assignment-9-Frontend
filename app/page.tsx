import { Suspense } from "react"

import { FeaturedTuitionsSection } from "@/components/home/featured-tuitions"
import { FeaturedTuitionsSkeleton } from "@/components/home/featured-tuitions-skeleton"
import { HeroSection } from "@/components/home/hero-section"
import { HowItWorksSection } from "@/components/home/how-it-works-section"
import { PricingSection } from "@/components/home/pricing-section"
import { SubjectsSection } from "@/components/home/subjects-section"
import { TestimonialsSection } from "@/components/home/testimonials-section"

export default function HomePage() {
    return (
        <>
            <HeroSection />
            <Suspense fallback={<FeaturedTuitionsSkeleton />}>
                <FeaturedTuitionsSection />
            </Suspense>
            <PricingSection />
            <HowItWorksSection />
            <SubjectsSection />
            <TestimonialsSection />
        </>
    )
}
