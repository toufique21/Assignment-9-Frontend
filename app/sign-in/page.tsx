import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { SignInForm } from "@/components/auth/sign-in-form"

export const metadata = {
    title: "Sign In | MentorLagbe",
}

export default function SignInPage() {
    return (
        <AuthCard
            title="Welcome back"
            subtitle="Sign in to continue your learning journey."
            footer={
                <>
                    New to MentorLagbe?{" "}
                    <Link href="/sign-up" className="font-semibold text-primary">
                        Create an account
                    </Link>
                </>
            }
        >
            <SignInForm />
        </AuthCard>
    )
}
