"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { AuthField } from "@/components/auth/auth-field"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

export function SignInForm() {
    const router = useRouter()
    const { notify } = useToast()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [loading, setLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!email.trim() || !password) {
            notify("Please enter your email and password.", "error")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            notify("Please enter a valid email address.", "error")
            return
        }

        setLoading(true)

        try {
            const { error } = await authClient.signIn.email({
                email: email.trim(),
                password,
                callbackURL: "/",
            })

            if (error) {
                notify(error.message ?? "Invalid email or password.", "error")
                return
            }

            notify("Welcome back!")
            router.push("/")
            router.refresh()
        } catch {
            notify("Something went wrong. Please try again.", "error")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <AuthField
                    id="sign-in-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <AuthField
                    id="sign-in-password"
                    label="Password"
                    type="password"
                    autoComplete="current-password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "Signing in..." : "Sign In"}
                </Button>
            </form>
        </div>
    )
}
