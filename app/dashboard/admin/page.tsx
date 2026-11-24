"use client"

import {
    BadgeCheck,
    Clock3,
    DollarSign,
    UserCheck,
    Users,
} from "lucide-react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatCard } from "@/components/dashboard/stat-card"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminWorkspace } from "@/hooks/use-admin-workspace"
import { reloadAdminWorkspace } from "@/lib/admin-data"
import { formatDate, formatUsd } from "@/lib/format"

export default function AdminOverviewPage() {
    const { workspace, error, isPending, isReady } = useAdminWorkspace()

    if (isPending || !isReady) {
        return (
            <div className="space-y-5">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                    {[0, 1, 2, 3, 4].map((item) => (
                        <Skeleton key={item} className="h-32 rounded-3xl" />
                    ))}
                </div>
                <div className="grid gap-5 lg:grid-cols-2">
                    <Skeleton className="h-72 rounded-3xl" />
                    <Skeleton className="h-72 rounded-3xl" />
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <ErrorState message={error} onRetry={reloadAdminWorkspace} />
        )
    }

    const pending = workspace.tuitions
        .filter((tuition) => tuition.approvalStatus === "pending")
        .slice(0, 5)
    const recentPayments = workspace.transactions.slice(0, 5)

    return (
        <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
                <StatCard
                    label="Total Users"
                    value={workspace.summary.totalUsers}
                    hint="Registered accounts"
                    icon={Users}
                />
                <StatCard
                    label="Total Tutors"
                    value={workspace.summary.totalTutors}
                    hint="Accounts with tutor role"
                    icon={UserCheck}
                />
                <StatCard
                    label="Pending Tuitions"
                    value={workspace.summary.pendingTuitions}
                    hint="Waiting for review"
                    icon={Clock3}
                />
                <StatCard
                    label="Approved Tuitions"
                    value={workspace.summary.approvedTuitions}
                    hint="Visible on browse page"
                    icon={BadgeCheck}
                />
                <StatCard
                    label="Stripe Revenue"
                    value={formatUsd(workspace.summary.totalRevenue)}
                    hint="Live Stripe payments"
                    icon={DollarSign}
                />
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
                <section className="glass-surface rounded-3xl p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-heading text-base font-semibold">
                                Pending approvals
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Newest tutor submissions first
                            </p>
                        </div>
                        <ButtonLink
                            href="/dashboard/admin/tuitions"
                            variant="secondary"
                            size="sm"
                        >
                            Review all
                        </ButtonLink>
                    </div>

                    <div className="mt-4 space-y-2">
                        {pending.length ? (
                            pending.map((tuition) => (
                                <div
                                    key={tuition.id}
                                    className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--glass-tint-soft)] px-4 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {tuition.title}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {tuition.tutorName} · {tuition.subject}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-xs text-muted-foreground">
                                        {tuition.createdAt
                                            ? formatDate(tuition.createdAt)
                                            : "—"}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="rounded-2xl bg-[var(--glass-tint-soft)] px-4 py-8 text-center text-sm text-muted-foreground">
                                Nothing is waiting for approval.
                            </p>
                        )}
                    </div>
                </section>

                <section className="glass-surface rounded-3xl p-5">
                    <div className="flex items-center justify-between gap-3">
                        <div>
                            <h2 className="font-heading text-base font-semibold">
                                Recent transactions
                            </h2>
                            <p className="mt-0.5 text-xs text-muted-foreground">
                                Latest Pro plan payments
                            </p>
                        </div>
                        <ButtonLink
                            href="/dashboard/admin/transactions"
                            variant="secondary"
                            size="sm"
                        >
                            View all
                        </ButtonLink>
                    </div>

                    <div className="mt-4 space-y-2">
                        {recentPayments.length ? (
                            recentPayments.map((payment) => (
                                <div
                                    key={payment.id}
                                    className="flex items-center justify-between gap-3 rounded-2xl bg-[var(--glass-tint-soft)] px-4 py-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium">
                                            {payment.userName}
                                        </p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            {payment.planName} ·{" "}
                                            {formatDate(payment.paidAt)}
                                        </p>
                                    </div>
                                    <span className="shrink-0 text-sm font-semibold tabular-nums">
                                        {formatUsd(Number(payment.amount))}
                                    </span>
                                </div>
                            ))
                        ) : (
                            <p className="rounded-2xl bg-[var(--glass-tint-soft)] px-4 py-8 text-center text-sm text-muted-foreground">
                                No transactions yet.
                            </p>
                        )}
                    </div>
                </section>
            </div>
        </div>
    )
}
