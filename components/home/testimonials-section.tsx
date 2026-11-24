import { Star } from "lucide-react"

import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"

type Testimonial = {
    name: string
    role: string
    quote: string
}

const testimonials: Testimonial[] = [
    {
        name: "Ayesha Rahman",
        role: "HSC Student",
        quote: "I found a physics tutor in my area within a day. The regular mock tests made a real difference.",
    },
    {
        name: "Mehedi Hasan",
        role: "Tutor",
        quote: "Posting my batch and managing applications is simple. I can focus on teaching instead of admin work.",
    },
    {
        name: "Sara Islam",
        role: "IELTS Learner",
        quote: "The speaking practice sessions gave me the confidence I needed for my exam.",
    },
]

export function TestimonialsSection() {
    return (
        <section className="py-16 sm:py-20">
            <Container>
                <SectionHeading
                    eyebrow="Testimonials"
                    title="Stories from our community"
                    description="Real feedback from learners and mentors on MentorLagbe."
                    centered
                />

                <div className="mt-10 grid gap-5 lg:grid-cols-3">
                    {testimonials.map((testimonial) => (
                        <figure
                            key={testimonial.name}
                            className="glass-surface flex h-full flex-col gap-5 rounded-3xl p-6"
                        >
                            <div className="flex gap-1 text-[#b86500]" aria-label="5 out of 5 stars">
                                {Array.from({ length: 5 }).map((_, index) => (
                                    <Star key={index} className="size-4 fill-current" />
                                ))}
                            </div>
                            <blockquote className="flex-1 text-sm leading-relaxed text-foreground/80">
                                “{testimonial.quote}”
                            </blockquote>
                            <figcaption className="flex items-center gap-3">
                                <span className="flex size-10 items-center justify-center rounded-full bg-gradient-to-br from-[#b86500] to-[#5e5ce6] text-sm font-semibold text-white">
                                    {testimonial.name.charAt(0)}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold">
                                        {testimonial.name}
                                    </p>
                                    <p className="text-xs text-muted-foreground">
                                        {testimonial.role}
                                    </p>
                                </div>
                            </figcaption>
                        </figure>
                    ))}
                </div>
            </Container>
        </section>
    )
}
