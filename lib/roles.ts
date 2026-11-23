export const roles = ["student", "tutor", "admin"] as const

export type UserRole = (typeof roles)[number]

export function getRole(role?: string | null): UserRole {
    return roles.find((item) => item === role) ?? "student"
}
