"use client"

import {
    CalendarDays,
    Eye,
    EyeOff,
    MapPin,
    Pencil,
    PlusCircle,
    Trash2,
    Users,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { TuitionForm } from "@/components/dashboard/tutor/tuition-form"
import { Button, ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { useTutorWorkspace } from "@/hooks/use-tutor-workspace"
import { getErrorMessage } from "@/lib/api-client"
import { formatMonthlyFee } from "@/lib/format"
import {
    deleteTuition,
    toggleTuitionStatus,
    updateTuition,
} from "@/lib/tutor-data"
import type { Tuition } from "@/lib/tuitions"

export default function MyTuitionsPage() {
    const { workspace, error, isPending, isReady } = useTutorWorkspace()
    const { notify } = useToast()
    const [editing, setEditing] = useState<Tuition | null>(null)

    if (isPending || !isReady) {
        return (
            <div className="grid gap-4 sm:grid-cols-2">
                {[0, 1].map((item) => (
                    <Skeleton key={item} className="h-80 rounded-3xl" />
                ))}
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} />
    }

    if (editing) {
        return (
            <div className="space-y-4">
                <div className="glass-surface flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3">
                    <p className="text-sm">
                        Editing <strong>{editing.title}</strong>
                    </p>
                    <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setEditing(null)}
                    >
                        Close editor
                    </Button>
                </div>
                <TuitionForm
                    initial={editing}
                    submitLabel="Save changes"
                    onSubmit={async (input) => {
                        await updateTuition(editing.id, input)
                        notify("Tuition updated.")
                        setEditing(null)
                    }}
                />
            </div>
        )
    }

    return (
        <div className="space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <p className="text-sm text-muted-foreground">
                    {workspace.tuitions.length} tuition
                    {workspace.tuitions.length === 1 ? "" : "s"} in your workspace.
                </p>
                <ButtonLink href="/dashboard/tutor/post-tuition" size="sm">
                    <PlusCircle />
                    New tuition
                </ButtonLink>
            </div>

            {workspace.tuitions.length === 0 ? (
                <div className="glass-surface space-y-4 rounded-3xl p-10 text-center">
                    <h2 className="font-heading text-lg font-semibold">
                        No tuitions yet
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Post your first tuition to start receiving applications.
                    </p>
                    <ButtonLink href="/dashboard/tutor/post-tuition">
                        Post a tuition
                    </ButtonLink>
                </div>
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {workspace.tuitions.map((tuition) => {
                        const applicantCount = workspace.applications.filter(
                            (application) =>
                                application.tuitionId === tuition.id
                        ).length

                        return (
                            <article
                                key={tuition.id}
                                className="glass-surface flex h-full flex-col overflow-hidden rounded-3xl"
                            >
                                <div className="relative aspect-[2.4/1] overflow-hidden bg-gradient-to-br from-[#fc8e2d]/20 to-[#5e5ce6]/20">
                                    {tuition.bannerImage && (
                                        <Image
                                            src={tuition.bannerImage}
                                            alt={`${tuition.title} banner`}
                                            fill
                                            unoptimized
                                            sizes="(max-width: 1024px) 100vw, 50vw"
                                            className="object-cover"
                                        />
                                    )}
                                </div>

                                <div className="flex flex-1 flex-col gap-4 p-5">
                                    <div className="space-y-2">
                                        <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                            {tuition.subject}
                                        </p>
                                        <h2 className="font-heading text-lg leading-snug font-semibold">
                                            {tuition.title}
                                        </h2>
                                        <div className="flex flex-wrap gap-2">
                                            <StatusBadge
                                                status={tuition.approvalStatus}
                                            />
                                            <StatusBadge
                                                status={
                                                    tuition.isActive
                                                        ? "active"
                                                        : "closed"
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
                                        <span>
                                            {formatMonthlyFee(tuition.monthlyFee)}/month
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <CalendarDays className="size-3.5" />
                                            {tuition.daysPerWeek} days/week
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <MapPin className="size-3.5" />
                                            {tuition.location}
                                        </span>
                                        <span className="inline-flex items-center gap-1.5">
                                            <Users className="size-3.5" />
                                            {applicantCount} applicants
                                        </span>
                                    </div>

                                    <div className="mt-auto flex flex-wrap gap-2 border-t border-border pt-4">
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="secondary"
                                            onClick={() => setEditing(tuition)}
                                        >
                                            <Pencil />
                                            Edit
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="ghost"
                                            onClick={async () => {
                                                try {
                                                    await toggleTuitionStatus(
                                                        tuition.id
                                                    )
                                                    notify(
                                                        tuition.isActive
                                                            ? "Tuition closed."
                                                            : "Tuition activated."
                                                    )
                                                } catch (error) {
                                                    notify(
                                                        getErrorMessage(error),
                                                        "error"
                                                    )
                                                }
                                            }}
                                        >
                                            {tuition.isActive ? <EyeOff /> : <Eye />}
                                            {tuition.isActive ? "Close" : "Activate"}
                                        </Button>
                                        <Button
                                            type="button"
                                            size="sm"
                                            variant="destructive"
                                            onClick={async () => {
                                                const confirmed = window.confirm(
                                                    `Delete "${tuition.title}" and its applications?`
                                                )
                                                if (!confirmed) return

                                                try {
                                                    await deleteTuition(tuition.id)
                                                    notify("Tuition deleted.")
                                                } catch (error) {
                                                    notify(
                                                        getErrorMessage(error),
                                                        "error"
                                                    )
                                                }
                                            }}
                                        >
                                            <Trash2 />
                                            Delete
                                        </Button>
                                    </div>
                                </div>
                            </article>
                        )
                    })}
                </div>
            )}
        </div>
    )
}
