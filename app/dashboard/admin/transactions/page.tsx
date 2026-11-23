"use client"

import { DollarSign, ReceiptText, UserCheck, Users } from "lucide-react"
import { useState } from "react"

import { ErrorState } from "@/components/dashboard/error-state"
import { StatCard } from "@/components/dashboard/stat-card"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { Skeleton } from "@/components/ui/skeleton"
import { useAdminWorkspace } from "@/hooks/use-admin-workspace"
import { reloadAdminWorkspace } from "@/lib/admin-data"
import { formatDate, formatUsd } from "@/lib/format"

const fieldClass =
    "h-10 rounded-2xl border border-white/15 bg-white/60 px-3 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15 dark:bg-white/5"

export default function AdminTransactionsPage() {
    const { workspace, error, isPending, isReady } = useAdminWorkspace()
    const [search, setSearch] = useState("")
    const [roleFilter, setRoleFilter] = useState<"all" | "tutor" | "student">(
        "all"
    )

    if (isPending || !isReady) {
        return (
            <div className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {[0, 1, 2, 3].map((item) => (
                        <Skeleton key={item} className="h-28 rounded-3xl" />
                    ))}
                </div>
                <Skeleton className="h-[26rem] rounded-3xl" />
            </div>
        )
    }

    if (error) {
        return <ErrorState message={error} onRetry={reloadAdminWorkspace} />
    }

    const paid = workspace.transactions.filter(
        (transaction) => transaction.paymentStatus === "paid"
    )
    const revenue = paid.reduce(
        (sum, transaction) => sum + Number(transaction.amount || 0),
        0
    )
    const tutorRevenue = paid
        .filter((transaction) => transaction.userRole === "tutor")
        .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)
    const studentRevenue = paid
        .filter((transaction) => transaction.userRole === "student")
        .reduce((sum, transaction) => sum + Number(transaction.amount || 0), 0)

    const visibleTransactions = workspace.transactions.filter((transaction) => {
        const matchesSearch =
            transaction.userName.toLowerCase().includes(search.toLowerCase()) ||
            transaction.userEmail.toLowerCase().includes(search.toLowerCase()) ||
            transaction.transactionId.toLowerCase().includes(search.toLowerCase())
        const matchesRole =
            roleFilter === "all" || transaction.userRole === roleFilter

        return matchesSearch && matchesRole
    })

    return (
        <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    label="Total Revenue"
                    value={formatUsd(revenue)}
                    hint="Paid transactions"
                    icon={DollarSign}
                />
                <StatCard
                    label="Transactions"
                    value={paid.length}
                    hint="Successful payments"
                    icon={ReceiptText}
                />
                <StatCard
                    label="Tutor Revenue"
                    value={formatUsd(tutorRevenue)}
                    hint="Pro Tutor plans"
                    icon={UserCheck}
                />
                <StatCard
                    label="Student Revenue"
                    value={formatUsd(studentRevenue)}
                    hint="Pro Student plans"
                    icon={Users}
                />
            </div>

            <section className="glass-surface rounded-3xl p-5">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="font-heading text-base font-semibold">
                            Payment records
                        </h2>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                            Stripe subscription transactions
                        </p>
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                        <label className="relative">
                            <ReceiptText className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search user or transaction ID"
                                className={`${fieldClass} w-full pl-9 sm:w-64`}
                            />
                        </label>
                        <select
                            value={roleFilter}
                            onChange={(event) =>
                                setRoleFilter(
                                    event.target.value as "all" | "tutor" | "student"
                                )
                            }
                            className={fieldClass}
                        >
                            <option value="all">All roles</option>
                            <option value="tutor">Tutor</option>
                            <option value="student">Student</option>
                        </select>
                    </div>
                </div>

                <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[820px] text-left text-sm">
                        <thead className="border-b border-white/10 text-xs tracking-wide text-muted-foreground uppercase">
                            <tr>
                                <th className="px-4 py-3 font-medium">User</th>
                                <th className="px-4 py-3 font-medium">Role</th>
                                <th className="px-4 py-3 font-medium">Plan</th>
                                <th className="px-4 py-3 font-medium">Amount</th>
                                <th className="px-4 py-3 font-medium">
                                    Transaction ID
                                </th>
                                <th className="px-4 py-3 font-medium">Date</th>
                                <th className="px-4 py-3 font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/10">
                            {visibleTransactions.map((transaction) => (
                                <tr key={transaction.id} className="hover:bg-white/5">
                                    <td className="px-4 py-4">
                                        <p className="font-medium">
                                            {transaction.userName}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {transaction.userEmail}
                                        </p>
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge status={transaction.userRole} />
                                    </td>
                                    <td className="px-4 py-4">{transaction.planName}</td>
                                    <td className="px-4 py-4 font-semibold tabular-nums">
                                        {formatUsd(Number(transaction.amount))}
                                    </td>
                                    <td className="px-4 py-4 font-mono text-xs text-muted-foreground">
                                        {transaction.transactionId}
                                    </td>
                                    <td className="px-4 py-4 text-xs text-muted-foreground">
                                        {formatDate(transaction.paidAt)}
                                    </td>
                                    <td className="px-4 py-4">
                                        <StatusBadge
                                            status={transaction.paymentStatus}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {!visibleTransactions.length ? (
                    <p className="px-4 py-12 text-center text-sm text-muted-foreground">
                        No transactions match your filters.
                    </p>
                ) : null}
            </section>
        </div>
    )
}
