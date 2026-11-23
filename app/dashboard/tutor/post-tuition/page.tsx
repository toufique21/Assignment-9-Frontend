"use client"

import { Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

import { ErrorState } from "@/components/dashboard/error-state"
import { TuitionForm } from "@/components/dashboard/tutor/tuition-form"
import { ButtonLink } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { useTutorWorkspace } from "@/hooks/use-tutor-workspace"
import { canPostTuition, createTuition } from "@/lib/tutor-data"

export default function PostTuitionPage() {
    const router = useRouter()
    const { notify } = useToast()
    const { workspace, error, isPending, isReady } = useTutorWorkspace()

    if (isPending || !isReady) {
        return <Skeleton className="h-[36rem] rounded-3xl" />
    }

    if (error) {
        return <ErrorState message={error} />
    }

    if (!canPostTuition(workspace)) {
        return (
            <div className="glass-surface mx-auto max-w-lg space-y-4 rounded-3xl p-8 text-center">
                <span className="mx-auto flex size-12 items-center justify-center rounded-2xl bg-primary/12 text-primary">
                    <Sparkles className="size-5" />
                </span>
                <h2 className="font-heading text-xl font-semibold">
                    You have reached the Free plan limit
                </h2>
                <p className="text-sm text-muted-foreground">
                    Free tutors can post up to 2 tuitions. Upgrade to Pro for
                    unlimited posts, or delete an existing tuition to make room.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                    <ButtonLink href="/pricing">Upgrade to Pro</ButtonLink>
                    <ButtonLink
                        href="/dashboard/tutor/my-tuitions"
                        variant="secondary"
                    >
                        Manage tuitions
                    </ButtonLink>
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
                New posts are saved as <strong>pending</strong> until an admin
                approves them.
                {workspace.plan === "free"
                    ? ` You can post ${Math.max(0, 2 - workspace.tuitions.length)} more on the Free plan.`
                    : " Pro tutors can post without limits."}
            </p>
            <TuitionForm
                onSubmit={async (input) => {
                    await createTuition(input)
                    notify("Tuition submitted for approval.")
                    router.push("/dashboard/tutor/my-tuitions")
                }}
            />
        </div>
    )
}
