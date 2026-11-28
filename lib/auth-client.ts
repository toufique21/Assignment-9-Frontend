import { createAuthClient } from "better-auth/react"
import { jwtClient } from "better-auth/client/plugins"

function getAuthBaseURL() {
    if (typeof window !== "undefined") {
        return window.location.origin
    }

    return (
        process.env.NEXT_PUBLIC_BETTER_AUTH_URL ||
        process.env.BETTER_AUTH_URL ||
        "http://localhost:3000"
    )
}

export const authClient = createAuthClient({
    baseURL: getAuthBaseURL(),
    plugins: [
        jwtClient()
    ]
})

export const { signIn, signUp, signOut } = authClient

export { useSession } from "@/lib/session-context"
