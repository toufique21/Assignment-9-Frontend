"use client"

import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { AuthField } from "@/components/auth/auth-field"
import { GoogleButton } from "@/components/auth/google-button"
import {
    RoleSelector,
    type SignUpRole,
} from "@/components/auth/role-selector"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"

export function SignUpForm() {
    const router = useRouter()
    const { notify } = useToast()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [role, setRole] = useState<SignUpRole>("student")
    const [image, setImage] = useState("")
    const [uploadingImage, setUploadingImage] = useState(false)
    const [loading, setLoading] = useState(false)
    const [googleLoading, setGoogleLoading] = useState(false)

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!name.trim() || !email.trim() || !password) {
            notify("Please fill in all fields.", "error")
            return
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            notify("Please enter a valid email address.", "error")
            return
        }

        if (password.length < 8) {
            notify("Password must be at least 8 characters long.", "error")
            return
        }

        setLoading(true)

        try {
            const payload = {
                name: name.trim(),
                email: email.trim(),
                password,
                role,
                ...(image ? { image } : {}),
                callbackURL: "/",
            }

            const { error } = await authClient.signUp.email(payload)

            if (error) {
                notify(error.message ?? "Could not create your account.", "error")
                return
            }

            notify("Your account is ready. Welcome to MentorLagbe!")
            router.push("/")
            router.refresh()
        } catch {
            notify("Something went wrong. Please try again.", "error")
        } finally {
            setLoading(false)
        }
    }

    async function handleGoogle() {
        setGoogleLoading(true)

        try {
            const { error } = await authClient.signIn.social({
                provider: "google",
                callbackURL: "/",
            })

            if (error) {
                notify(
                    error.message ?? "Google sign-in is not configured yet.",
                    "error"
                )
                setGoogleLoading(false)
            }
        } catch {
            notify("Could not start Google sign-in.", "error")
            setGoogleLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                <div className="glass-surface rounded-3xl px-4 py-5">
                    <AvatarUpload
                        value={image}
                        onChange={setImage}
                        name={name || "New Member"}
                        size="lg"
                        onUploadingChange={setUploadingImage}
                    />
                </div>
                <AuthField
                    id="sign-up-name"
                    label="Full Name"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    required
                />
                <AuthField
                    id="sign-up-email"
                    label="Email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />
                <AuthField
                    id="sign-up-password"
                    label="Password"
                    type="password"
                    autoComplete="new-password"
                    placeholder="At least 8 characters"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />
                <RoleSelector value={role} onChange={setRole} />
                <Button
                    type="submit"
                    disabled={loading || uploadingImage}
                    className="w-full"
                >
                    {uploadingImage
                        ? "Uploading photo..."
                        : loading
                          ? "Creating account..."
                          : "Create Account"}
                </Button>
            </form>

            <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className="h-px flex-1 bg-border" />
                or continue with
                <span className="h-px flex-1 bg-border" />
            </div>

            <GoogleButton onClick={handleGoogle} disabled={googleLoading} />
        </div>
    )
}
