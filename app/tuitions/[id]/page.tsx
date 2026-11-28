"use client"

import {
    ArrowLeft,
    CalendarDays,
    CheckCircle2,
    Clock3,
    Globe2,
    MapPin,
    UserRound,
    Wallet,
} from "lucide-react"
import Image from "next/image"
import { useParams, useRouter } from "next/navigation"
import { useState } from "react"
import type { FormEvent } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { Button, ButtonLink } from "@/components/ui/button"
import { Container } from "@/components/ui/container"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { apiFetch, getErrorMessage } from "@/lib/api-client"
import { useSession } from "@/lib/auth-client"
import { reloadPublicTuitions } from "@/lib/browse-data"
import { formatDate, formatMonthlyFee } from "@/lib/format"
import { getRole } from "@/lib/roles"
import type { TutorProfile, Tuition } from "@/lib/tuitions"
import { usePublicTuitions } from "@/hooks/use-public-tuitions"
import { useStudentWorkspace } from "@/hooks/use-student-workspace"
import {
    canApplyToTuition,
    FREE_APPLICATION_LIMIT,
    reloadWorkspace,
} from "@/lib/student-data"

const fieldClass =
    "h-10 w-full rounded-2xl border border-white/15 bg-white/60 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 dark:bg-white/5"

export default function TuitionDetailPage() {
    const params = useParams<{ id: string }>()
    const { workspace, error, isPending, isReady } = usePublicTuitions()
    const session = useSession()
    const user = session.data?.user as
        | { name?: string | null; email?: string | null; role?: string | null }
        | undefined
    const role = getRole(user?.role)
    const dashboardHref = user ? `/dashboard/${role}` : "/sign-in"
    const isStudent = Boolean(user) && role === "student"
    const { workspace: studentWorkspace } = useStudentWorkspace()
    const applicationLimitReached =
        isStudent &&
        studentWorkspace.email === user?.email &&
        !canApplyToTuition(studentWorkspace)

    if (isPending || !isReady) {
        return (
            <Container className="py-12">
                <Skeleton className="h-10 w-40" />
                <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    <div className="glass-surface rounded-3xl p-3">
                        <Skeleton className="aspect-video w-full rounded-2xl" />
                        <Skeleton className="mt-6 h-8 w-3/4" />
                        <Skeleton className="mt-3 h-5 w-1/2" />
                        <Skeleton className="mt-8 h-32 w-full" />
                    </div>
                    <Skeleton className="h-96 rounded-3xl" />
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

    const tuition = workspace.tuitions.find((item) => item.id === params.id)

    if (!tuition) {
        return (
            <Container className="py-20">
                <div className="glass-surface mx-auto max-w-md rounded-3xl p-8 text-center">
                    <h1 className="font-heading text-xl font-semibold">
                        Tuition not found
                    </h1>
                    <p className="mt-2 text-sm text-muted-foreground">
                        This batch is no longer approved and active, or the link
                        is invalid.
                    </p>
                    <ButtonLink href="/tuitions" className="mt-6 w-full">
                        Back to all tuitions
                    </ButtonLink>
                </div>
            </Container>
        )
    }

    const hasApplied =
        isStudent &&
        studentWorkspace.email === user?.email &&
        studentWorkspace.applications.some(
            (application) => application.tuitionId === tuition.id
        )

    return (
        <div className="py-10 sm:py-14">
            <Container>
                <ButtonLink
                    href="/tuitions"
                    variant="ghost"
                    size="sm"
                    className="-ml-3"
                >
                    <ArrowLeft />
                    All tuitions
                </ButtonLink>

                <div className="mt-5 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                    <article className="glass-surface overflow-hidden rounded-3xl">
                        <div className="relative aspect-video bg-gradient-to-br from-[#fc8e2d]/20 to-[#5e5ce6]/20">
                            {tuition.bannerImage ? (
                                <Image
                                    src={tuition.bannerImage}
                                    alt={`${tuition.title} banner`}
                                    fill
                                    unoptimized
                                    sizes="(max-width: 1024px) 100vw, 60vw"
                                    className="object-cover"
                                />
                            ) : null}
                            <span className="absolute top-4 left-4 rounded-full border border-white/40 bg-black/25 backdrop-blur-md px-3 py-1 text-xs font-semibold text-white">
                                {tuition.mode}
                            </span>
                        </div>

                        <div className="space-y-6 p-6 sm:p-8">
                            <div>
                                <p className="text-xs font-semibold tracking-wide text-primary uppercase">
                                    {tuition.subject}
                                </p>
                                <h1 className="font-heading mt-2 text-2xl font-semibold sm:text-3xl">
                                    {tuition.title}
                                </h1>
                            </div>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <Detail icon={UserRound} label="Tutor">
                                    {tuition.tutorName}
                                </Detail>
                                <Detail icon={CalendarDays} label="Class level">
                                    {tuition.classLevel}
                                </Detail>
                                <Detail icon={Globe2} label="Mode">
                                    {tuition.mode}
                                </Detail>
                                <Detail icon={MapPin} label="Location">
                                    {tuition.location}
                                </Detail>
                                <Detail icon={Clock3} label="Frequency">
                                    {tuition.daysPerWeek} days/week
                                </Detail>
                                <Detail icon={Wallet} label="Monthly fee">
                                    {formatMonthlyFee(tuition.monthlyFee)}
                                </Detail>
                            </div>

                            <div className="border-t border-border pt-6">
                                <h2 className="font-heading text-lg font-semibold">
                                    About this tuition
                                </h2>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {tuition.description ||
                                        "No description provided by the tutor."}
                                </p>
                            </div>

                            <div className="border-t border-border pt-6">
                                <div className="flex items-center gap-2 text-primary">
                                    <CheckCircle2 className="size-5" />
                                    <h2 className="font-heading text-lg font-semibold">
                                        Apply for this batch
                                    </h2>
                                </div>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    Your application will be sent to the tutor
                                    with a pending status.
                                </p>

                                {isStudent ? (
                                    hasApplied ? (
                                        <div className="mt-6 rounded-2xl bg-[var(--glass-tint-soft)] p-5 text-center">
                                            <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                                                <CheckCircle2 className="size-5" />
                                            </span>
                                            <p className="mt-3 text-sm font-medium">
                                                You already applied to this
                                                tuition.
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                You can track its status in your
                                                applications.
                                            </p>
                                            <ButtonLink
                                                href="/dashboard/student/my-applications"
                                                className="mt-4 w-full"
                                            >
                                                View my applications
                                            </ButtonLink>
                                        </div>
                                    ) : applicationLimitReached ? (
                                        <div className="mt-6 rounded-2xl bg-[var(--glass-tint-soft)] p-5 text-center">
                                            <p className="text-sm font-medium">
                                                You have used all{" "}
                                                {FREE_APPLICATION_LIMIT} free
                                                applications.
                                            </p>
                                            <p className="mt-1 text-sm text-muted-foreground">
                                                Upgrade to Premium to apply to
                                                unlimited tuitions.
                                            </p>
                                            <ButtonLink
                                                href="/pricing"
                                                className="mt-4 w-full"
                                            >
                                                Upgrade to Premium
                                            </ButtonLink>
                                        </div>
                                    ) : (
                                        <ApplyForm
                                            key={`${tuition.id}-${user?.email ?? ""}`}
                                            tuition={tuition}
                                            studentName={user?.name ?? ""}
                                            studentEmail={user?.email ?? ""}
                                        />
                                    )
                                ) : (
                                    <div className="mt-6 rounded-2xl bg-[var(--glass-tint-soft)] p-5 text-center">
                                        <p className="text-sm text-muted-foreground">
                                            {user
                                                ? "Use a student account to apply for tuitions."
                                                : "Sign in as a student to apply for this tuition."}
                                        </p>
                                        <ButtonLink
                                            href={dashboardHref}
                                            className="mt-4 w-full"
                                        >
                                            {user ? "Go to my dashboard" : "Sign in"}
                                        </ButtonLink>
                                    </div>
                                )}
                            </div>
                        </div>
                    </article>

                    <TutorProfileCard
                        tuition={tuition}
                        profile={tuition.tutorProfile}
                    />
                </div>
            </Container>
        </div>
    )
}

function Detail({
    icon: Icon,
    label,
    children,
}: {
    icon: typeof UserRound
    label: string
    children: React.ReactNode
}) {
    return (
        <div className="flex items-start gap-3 rounded-2xl bg-[var(--glass-tint-soft)] p-3">
            <Icon className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="min-w-0">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className="mt-0.5 truncate text-sm font-medium">{children}</p>
            </div>
        </div>
    )
}

function ProfileDetail({
    label,
    children,
}: {
    label: string
    children: React.ReactNode
}) {
    return (
        <div>
            <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                {label}
            </p>
            <div className="mt-1 text-sm">{children}</div>
        </div>
    )
}

function TutorProfileCard({
    tuition,
    profile,
}: {
    tuition: Tuition
    profile?: TutorProfile | null
}) {
    const name = profile?.name || tuition.tutorName || "MentorLagbe Tutor"
    const email = profile?.email || tuition.tutorEmail
    const image = profile?.image || ""
    const initials =
        name
            .trim()
            .split(/\s+/)
            .slice(0, 2)
            .map((part) => part.charAt(0))
            .join("")
            .toUpperCase() || "?"

    return (
        <aside className="glass-surface h-fit rounded-3xl p-6 lg:sticky lg:top-24">
            <div className="flex items-center gap-2 text-primary">
                <UserRound className="size-5" />
                <h2 className="font-heading text-lg font-semibold">
                    Tutor profile
                </h2>
            </div>

            <div className="mt-6 flex flex-col items-center text-center">
                <div className="relative size-20 overflow-hidden rounded-full bg-gradient-to-br from-[#fc8e2d] to-[#5e5ce6] ring-2 ring-white/40">
                    {image ? (
                        <Image
                            src={image}
                            alt={`${name} profile picture`}
                            fill
                            unoptimized
                            sizes="80px"
                            className="object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-lg font-semibold text-white">
                            {initials}
                        </span>
                    )}
                </div>
                <h3 className="font-heading mt-3 text-lg font-semibold">{name}</h3>
                <span className="mt-3 rounded-full bg-[#fc8e2d]/15 px-3 py-1 text-xs font-semibold text-[#8a4e00] dark:text-[#d98a2b]">
                    {profile?.role === "tutor" ? "Verified Tutor" : "Tutor"}
                </span>
            </div>

            <div className="mt-6 space-y-4 border-t border-border pt-6 text-sm">
                <ProfileDetail label="Email">
                    {email ? (
                        <a
                            href={`mailto:${email}`}
                            className="break-all font-medium hover:text-primary"
                        >
                            {email}
                        </a>
                    ) : (
                        <span className="font-medium">—</span>
                    )}
                </ProfileDetail>
                <ProfileDetail label="Phone number">
                    {profile?.phone ? (
                        <a
                            href={`tel:${profile.phone}`}
                            className="font-medium hover:text-primary"
                        >
                            {profile.phone}
                        </a>
                    ) : (
                        <span className="font-medium">Not added yet</span>
                    )}
                </ProfileDetail>
                <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">Member since</span>
                    <span className="font-medium">
                        {profile?.createdAt
                            ? formatDate(profile.createdAt)
                            : "—"}
                    </span>
                </div>
                <ProfileDetail label="Bio">
                    <span className="leading-relaxed text-muted-foreground">
                        {profile?.bio || "This tutor has not added a bio yet."}
                    </span>
                </ProfileDetail>
            </div>
        </aside>
    )
}

function ApplyForm({
    tuition,
    studentName,
    studentEmail,
}: {
    tuition: Tuition
    studentName: string
    studentEmail: string
}) {
    const router = useRouter()
    const { notify } = useToast()
    const [phone, setPhone] = useState("")
    const [preferredSchedule, setPreferredSchedule] = useState("")
    const [studentNote, setStudentNote] = useState("")
    const [submitting, setSubmitting] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setSubmitting(true)

        try {
            await apiFetch("/applications", {
                method: "POST",
                body: JSON.stringify({
                    tuitionId: tuition.id,
                    tuitionTitle: tuition.title,
                    subject: tuition.subject,
                    monthlyFee: tuition.monthlyFee,
                    tutorEmail: tuition.tutorEmail,
                    tutorName: tuition.tutorName,
                    studentName,
                    studentEmail,
                    studentPhone: phone,
                    preferredSchedule,
                    studentNote,
                }),
            })

            reloadWorkspace()
            notify("Application sent to the tutor.")
            router.push("/dashboard/student/my-applications")
        } catch (error) {
            notify(getErrorMessage(error), "error")
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                    Your name
                </span>
                <input
                    value={studentName}
                    disabled
                    className={`${fieldClass} mt-1 opacity-70`}
                />
            </label>
            <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                    Your email
                </span>
                <input
                    value={studentEmail}
                    disabled
                    className={`${fieldClass} mt-1 opacity-70`}
                />
            </label>
            <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                    Phone number
                </span>
                <input
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder="+880 1XXX-XXXXXX"
                    className={`${fieldClass} mt-1`}
                />
            </label>
            <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                    Preferred schedule
                </span>
                <input
                    value={preferredSchedule}
                    onChange={(event) => setPreferredSchedule(event.target.value)}
                    placeholder="Evenings, weekends, etc."
                    className={`${fieldClass} mt-1`}
                />
            </label>
            <label className="block">
                <span className="text-xs font-medium text-muted-foreground">
                    Message to tutor
                </span>
                <textarea
                    value={studentNote}
                    onChange={(event) => setStudentNote(event.target.value)}
                    placeholder="Tell the tutor what you want to focus on."
                    rows={3}
                    className={`${fieldClass} h-auto py-2.5`}
                />
            </label>
            <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? "Sending..." : "Send application"}
            </Button>
        </form>
    )
}
