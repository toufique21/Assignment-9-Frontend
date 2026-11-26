import { CalendarDays, UserRound } from "lucide-react"
import Image from "next/image"

import { ButtonLink } from "@/components/ui/button"
import { formatMonthlyFee } from "@/lib/format"
import type { Tuition } from "@/lib/tuitions"

export function TuitionCard({ tuition }: { tuition: Tuition }) {
    return (
        <article className="glass-surface group flex h-full flex-col overflow-hidden rounded-3xl transition-transform duration-300 hover:-translate-y-1">
            <div className="relative aspect-video overflow-hidden bg-gradient-to-br from-[#fc8e2d]/20 to-[#5e5ce6]/20">
                {tuition.bannerImage && (
                    <Image
                        src={tuition.bannerImage}
                        alt={`${tuition.title} banner`}
                        fill
                        unoptimized
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                )}
                <span className="absolute top-3 left-3 rounded-full border border-white/40 bg-black/25 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                    {tuition.mode}
                </span>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-5">
                <div className="space-y-2">
                    <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                        {tuition.subject}
                    </p>
                    <h3 className="font-heading line-clamp-2 text-lg leading-snug font-semibold">
                        {tuition.title}
                    </h3>
                </div>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                    <span className="rounded-full bg-[var(--glass-tint-soft)] px-2.5 py-1 font-medium">
                        {tuition.classLevel}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {tuition.daysPerWeek} days/week
                    </span>
                </div>

                <div className="mt-auto border-t border-border pt-4">
                    <div className="flex items-end justify-between gap-3">
                        <div>
                            <p className="text-xs text-muted-foreground">
                                Monthly fee
                            </p>
                            <p className="font-heading text-lg font-semibold">
                                {formatMonthlyFee(tuition.monthlyFee)}
                            </p>
                        </div>
                        <ButtonLink
                            href={`/tuitions/${tuition.id}`}
                            size="sm"
                            aria-label={`View details for ${tuition.title}`}
                        >
                            View Details
                        </ButtonLink>
                    </div>
                    <p className="mt-3 inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                        <UserRound className="size-3.5" />
                        {tuition.tutorName}
                    </p>
                </div>
            </div>
        </article>
    )
}
