import Link from "next/link"

import { AuthCard } from "@/components/auth/auth-card"
import { SignUpForm } from "@/components/auth/sign-up-form"

export const metadata = {
    title: "Sign Up | MentorLagbe",
}

export default function SignUpPage() {
    return (
        <AuthCard
            title="Create your account"
            subtitle="Join as a student or tutor and start growing today."
            footer={
                <>
                    Already have an account?{" "}
                    <Link href="/sign-in" className="font-semibold text-primary">
                        Sign in
                    </Link>
                </>
            }
        >
            <SignUpForm />
        </AuthCard>
    )
}
