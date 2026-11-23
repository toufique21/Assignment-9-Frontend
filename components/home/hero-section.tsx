import { ArrowRight, Search, ShieldCheck, Star } from "lucide-react"
import Image from "next/image"

import { ButtonLink, buttonVariants } from "@/components/ui/button"
import { Container } from "@/components/ui/container"

const heroImage =
    "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80"

export function HeroSection() {
    return (
        <section className="relative overflow-hidden py-16 sm:py-24">
            <div
                aria-hidden="true"
                className="absolute -top-32 -left-32 size-96 rounded-full bg-[#ff9500]/20 blur-3xl"
            />
            <div
                aria-hidden="true"
                className="absolute -right-32 top-10 size-96 rounded-full bg-[#5e5ce6]/20 blur-3xl"
            />

            <Container className="relative grid items-center gap-12 lg:grid-cols-2">
                <div className="space-y-6">
                    <span className="glass-surface inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold text-primary">
                        <Star className="size-3.5 fill-current" />
                        Trusted by students & tutors
                    </span>

                    <h1 className="font-heading text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                        Find Your Ideal Tutor or{" "}
                        <span className="text-primary">Mentorship Batch</span> Today
                    </h1>

                    <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                        Browse verified tutors by subject, class level, mode and
                        budget. Apply in minutes and learn with confidence.
                    </p>

                    <form
                        action="/tuitions"
                        method="get"
                        className="glass-surface flex flex-col gap-2 rounded-2xl p-2 sm:flex-row"
                    >
                        <div className="flex flex-1 items-center gap-2 px-3">
                            <Search
                                className="size-5 shrink-0 text-muted-foreground"
                                aria-hidden="true"
                            />
                            <input
                                type="search"
                                name="q"
                                aria-label="Search tuitions"
                                placeholder="Search by subject or tuition title"
                                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                        <button type="submit" className={buttonVariants({ size: "lg" })}>
                            Search Tuitions
                        </button>
                    </form>

                    <div className="flex flex-wrap items-center gap-3">
                        <ButtonLink href="/tuitions" size="lg">
                            Browse Tuitions
                            <ArrowRight className="size-4" />
                        </ButtonLink>
                        <ButtonLink href="/pricing" size="lg" variant="secondary">
                            Explore Pro Plans
                        </ButtonLink>
                    </div>

                    <p className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                        <ShieldCheck className="size-4 text-[#34c759]" />
                        Admin-approved listings · Verified tutors
                    </p>
                </div>

                <div className="relative">
                    <div className="glass-surface relative aspect-[4/3] overflow-hidden rounded-[2rem] p-2">
                        <div className="relative h-full w-full overflow-hidden rounded-[1.6rem] bg-gradient-to-br from-[#ff9500]/20 to-[#5e5ce6]/20">
                            <Image
                                src={heroImage}
                                alt="Students learning together with a tutor"
                                fill
                                priority
                                unoptimized
                                sizes="(max-width: 1024px) 100vw, 50vw"
                                className="object-cover"
                            />
                        </div>
                    </div>

                    <div className="glass-surface absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl px-4 py-3 sm:left-3">
                        <span className="flex size-10 items-center justify-center rounded-full bg-[#34c759]/15 text-[#248a3d]">
                            <ShieldCheck className="size-5" />
                        </span>
                        <div>
                            <p className="text-sm font-semibold">Verified tutors</p>
                            <p className="text-xs text-muted-foreground">
                                Approved by MentorLagbe
                            </p>
                        </div>
                    </div>
                </div>
            </Container>
        </section>
    )
}
