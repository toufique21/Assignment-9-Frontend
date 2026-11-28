import { FileQuestion } from "lucide-react"

import { ButtonLink } from "@/components/ui/button"
import { FeedbackPage } from "@/components/ui/feedback-page"

export default function NotFound() {
    return (
        <FeedbackPage
            icon={<FileQuestion className="size-5" />}
            title="Page not found"
            description="We couldn't find that page. It may have moved or never existed."
        >
            <ButtonLink href="/" className="w-full sm:w-auto">
                Back to Home
            </ButtonLink>
        </FeedbackPage>
    )
}
