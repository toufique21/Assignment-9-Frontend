"use client"

import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export type SignUpRole = "student" | "tutor"

const roles: { value: SignUpRole; label: string }[] = [
    { value: "student", label: "Student" },
    { value: "tutor", label: "Tutor" },
]

export function RoleSelector({
    value,
    onChange,
}: {
    value: SignUpRole
    onChange: (role: SignUpRole) => void
}) {
    return (
        <div className="space-y-2">
            <p className="text-sm font-medium">I want to join as</p>
            <div
                role="radiogroup"
                aria-label="Account role"
                className="glass-surface flex gap-1 rounded-full p-1"
            >
                {roles.map((role) => (
                    <button
                        key={role.value}
                        type="button"
                        role="radio"
                        aria-checked={value === role.value}
                        onClick={() => onChange(role.value)}
                        className={cn(
                            buttonVariants({
                                variant: value === role.value ? "default" : "ghost",
                                size: "sm",
                            }),
                            "flex-1 rounded-full"
                        )}
                    >
                        {role.label}
                    </button>
                ))}
            </div>
        </div>
    )
}
