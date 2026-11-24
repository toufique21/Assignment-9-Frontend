"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { useState } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { Button } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { SectionHeading } from "@/components/ui/section-heading"
import { Skeleton } from "@/components/ui/skeleton"
import { TuitionCard } from "@/components/ui/tuition-card"
import { usePublicTuitions } from "@/hooks/use-public-tuitions"
import { reloadPublicTuitions } from "@/lib/browse-data"

const fieldClass =
    "h-10 rounded-2xl border border-white/15 bg-white/60 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 dark:bg-white/5"

type Sort = "newest" | "fee-asc" | "fee-desc"

export default function BrowseTuitionsPage() {
    const { tuitions, error, isPending, isReady } = usePublicTuitions()
    const [search, setSearch] = useState("")
    const [subject, setSubject] = useState("all")
    const [mode, setMode] = useState("all")
    const [classLevel, setClassLevel] = useState("all")
    const [sort, setSort] = useState<Sort>("newest")

    if (isPending || !isReady) {
        return (
            <Container className="py-12 sm:py-16">
                <Skeleton className="h-10 w-80 max-w-full" />
                <Skeleton className="mt-3 h-5 w-full max-w-xl" />
                <Skeleton className="mt-8 h-24 rounded-3xl" />
                <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {Array.from({ length: 6 }).map((_, index) => (
                        <div
                            key={index}
                            className="glass-surface rounded-3xl p-3"
                        >
                            <Skeleton className="aspect-video w-full rounded-2xl" />
                            <Skeleton className="mt-5 h-5 w-3/4" />
                            <Skeleton className="mt-3 h-4 w-1/2" />
                            <Skeleton className="mt-8 h-10 w-full" />
                        </div>
                    ))}
                </div>
            </Container>
        )
    }

    if (error) {
        return (
            <Container className="py-16">
                <ErrorState
                    message={error}
                    onRetry={reloadPublicTuitions}
                />
            </Container>
        )
    }

    const subjects = [...new Set(tuitions.map((item) => item.subject))].sort()
    const levels = [...new Set(tuitions.map((item) => item.classLevel))].sort()

    const query = search.trim().toLowerCase()
    const visibleTuitions = tuitions
        .filter((item) => {
            const matchesSearch =
                !query ||
                item.title.toLowerCase().includes(query) ||
                item.subject.toLowerCase().includes(query) ||
                item.tutorName.toLowerCase().includes(query) ||
                item.location.toLowerCase().includes(query)
            const matchesSubject = subject === "all" || item.subject === subject
            const matchesMode = mode === "all" || item.mode === mode
            const matchesLevel =
                classLevel === "all" || item.classLevel === classLevel

            return matchesSearch && matchesSubject && matchesMode && matchesLevel
        })
        .sort((a, b) => {
            if (sort === "fee-asc") return a.monthlyFee - b.monthlyFee
            if (sort === "fee-desc") return b.monthlyFee - a.monthlyFee

            return (
                (Date.parse(b.createdAt) || 0) - (Date.parse(a.createdAt) || 0)
            )
        })

    const hasFilters =
        Boolean(query) ||
        subject !== "all" ||
        mode !== "all" ||
        classLevel !== "all"

    function clearFilters() {
        setSearch("")
        setSubject("all")
        setMode("all")
        setClassLevel("all")
        setSort("newest")
    }

    return (
        <div className="py-12 sm:py-16">
            <Container>
                <SectionHeading
                    eyebrow="Browse tuitions"
                    title="Find your next tuition batch"
                    description="Every listing here is approved by our admin and kept active by its tutor. Explore all available batches from MentorLagbe tutors."
                />

                <section className="glass-surface mt-8 rounded-3xl p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-muted-foreground">
                        <SlidersHorizontal className="size-4 text-primary" />
                        Filters
                    </div>
                    <div className="mt-3 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                        <label className="relative lg:col-span-2">
                            <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search title, tutor or location"
                                className={`${fieldClass} w-full pl-9`}
                            />
                        </label>
                        <select
                            value={subject}
                            onChange={(event) => setSubject(event.target.value)}
                            className={fieldClass}
                        >
                            <option value="all">All subjects</option>
                            {subjects.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <select
                            value={mode}
                            onChange={(event) => setMode(event.target.value)}
                            className={fieldClass}
                        >
                            <option value="all">All modes</option>
                            <option value="Online">Online</option>
                            <option value="Offline">Offline</option>
                        </select>
                        <select
                            value={classLevel}
                            onChange={(event) =>
                                setClassLevel(event.target.value)
                            }
                            className={fieldClass}
                        >
                            <option value="all">All class levels</option>
                            {levels.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                        <select
                            value={sort}
                            onChange={(event) =>
                                setSort(event.target.value as Sort)
                            }
                            className={fieldClass}
                        >
                            <option value="newest">Newest first</option>
                            <option value="fee-asc">Fee: low to high</option>
                            <option value="fee-desc">Fee: high to low</option>
                        </select>
                    </div>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
                        <p className="text-sm text-muted-foreground">
                            Showing {visibleTuitions.length} of {tuitions.length}{" "}
                            active tuitions
                        </p>
                        {hasFilters ? (
                            <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        ) : null}
                    </div>
                </section>

                {visibleTuitions.length === 0 ? (
                    <div className="glass-surface mt-8 rounded-3xl p-12 text-center">
                        <h2 className="font-heading text-lg font-semibold">
                            No tuitions found
                        </h2>
                        <p className="mt-1 text-sm text-muted-foreground">
                            {tuitions.length === 0
                                ? "No approved and active tuitions are available right now."
                                : "Try a different search or clear your filters."}
                        </p>
                        {hasFilters ? (
                            <Button
                                type="button"
                                size="sm"
                                className="mt-5"
                                onClick={clearFilters}
                            >
                                Clear filters
                            </Button>
                        ) : null}
                    </div>
                ) : (
                    <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {visibleTuitions.map((tuition) => (
                            <TuitionCard key={tuition.id} tuition={tuition} />
                        ))}
                    </div>
                )}
            </Container>
        </div>
    )
}
