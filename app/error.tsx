"use client"

import { TriangleAlert } from "lucide-react"
import { useEffect } from "react"

import { Button, ButtonLink } from "@/components/ui/button"
import { FeedbackPage } from "@/components/ui/feedback-page"

export default function Error({
    error,
    retry,
}: {
    error: unknown
    retry: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <FeedbackPage
            icon={<TriangleAlert className="size-5" />}
            title="Something went wrong"
            description="An unexpected error stopped this page from loading. Please try again."
        >
            <Button type="button" onClick={retry} className="w-full sm:w-auto">
                Try again
            </Button>
            <ButtonLink
                href="/"
                variant="secondary"
                className="w-full sm:w-auto"
            >
                Back to Home
            </ButtonLink>
        </FeedbackPage>
    )
}
