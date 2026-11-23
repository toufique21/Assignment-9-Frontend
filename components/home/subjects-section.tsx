import {
    Atom,
    Calculator,
    Code2,
    Languages,
    type LucideIcon,
} from "lucide-react"

import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"

type Subject = {
    name: string
    icon: LucideIcon
    count: string
}

const subjects: Subject[] = [
    { name: "Mathematics", icon: Calculator, count: "420+ tutors" },
    { name: "Physics", icon: Atom, count: "260+ tutors" },
    { name: "Programming", icon: Code2, count: "180+ tutors" },
    { name: "IELTS", icon: Languages, count: "140+ tutors" },
]

const stats = [
    { value: "2.4k+", label: "Students learning" },
    { value: "850+", label: "Verified tutors" },
    { value: "120+", label: "Subjects covered" },
    { value: "98%", label: "Happy learners" },
]

export function SubjectsSection() {
    return (
        <section className="py-16 sm:py-20">
            <Container>
                <SectionHeading
                    eyebrow="Explore"
                    title="Top subjects, trusted mentors"
                    description="Find help in the subjects learners search for most."
                    centered
                />

                <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {subjects.map((subject) => {
                        const Icon = subject.icon

                        return (
                            <article
                                key={subject.name}
                                className="glass-surface flex items-center gap-4 rounded-3xl p-5"
                            >
                                <span className="flex size-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                                    <Icon className="size-6" />
                                </span>
                                <div>
                                    <h3 className="font-heading font-semibold">
                                        {subject.name}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        {subject.count}
                                    </p>
                                </div>
                            </article>
                        )
                    })}
                </div>

                <div className="glass-surface mt-6 grid gap-6 rounded-3xl p-8 sm:grid-cols-2 lg:grid-cols-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <p className="font-heading text-3xl font-semibold text-primary">
                                {stat.value}
                            </p>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {stat.label}
                            </p>
                        </div>
                    ))}
                </div>
            </Container>
        </section>
    )
}
