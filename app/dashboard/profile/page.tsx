"use client"

import { Mail, Pencil, ShieldCheck } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState, type FormEvent } from "react"

import { AuthField } from "@/components/auth/auth-field"
import { StatusBadge } from "@/components/dashboard/status-badge"
import { AvatarUpload } from "@/components/ui/avatar-upload"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { authClient } from "@/lib/auth-client"
import { getErrorMessage } from "@/lib/api-client"
import { formatDate } from "@/lib/format"
import { getRole } from "@/lib/roles"

type ProfileUser = {
    id: string
    name?: string | null
    email?: string | null
    image?: string | null
    role?: string | null
    plan?: string | null
    phone?: string | null
    bio?: string | null
    createdAt?: string | null
    emailVerified?: boolean | null
}

export default function ProfilePage() {
    const session = authClient.useSession()
    const user = session.data?.user as ProfileUser | undefined

    if (session.isPending || !user) {
        return (
            <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
                <Skeleton className="h-[30rem] rounded-3xl" />
                <Skeleton className="h-[30rem] rounded-3xl" />
            </div>
        )
    }

    return <ProfileView key={user.id} user={user} />
}

function ProfileView({ user }: { user: ProfileUser }) {
    const router = useRouter()
    const { notify } = useToast()
    const [editing, setEditing] = useState(false)
    const [name, setName] = useState(user.name ?? "")
    const [image, setImage] = useState(user.image ?? "")
    const [phone, setPhone] = useState(user.phone ?? "")
    const [bio, setBio] = useState(user.bio ?? "")
    const [uploadingImage, setUploadingImage] = useState(false)
    const [saving, setSaving] = useState(false)

    const role = getRole(user.role)
    const plan = user.plan === "pro" ? "pro" : "free"

    function resetForm() {
        setName(user.name ?? "")
        setImage(user.image ?? "")
        setPhone(user.phone ?? "")
        setBio(user.bio ?? "")
    }

    function closeEditor() {
        resetForm()
        setEditing(false)
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()

        if (!name.trim()) {
            notify("Name is required.", "error")
            return
        }

        setSaving(true)

        try {
            // The client type does not know the server's custom user fields.
            const payload = {
                name: name.trim(),
                image: image || null,
                phone: phone.trim(),
                bio: bio.trim(),
            } as unknown as Parameters<typeof authClient.updateUser>[0]

            const { error } = await authClient.updateUser(payload)

            if (error) {
                notify(error.message ?? "Could not update your profile.", "error")
                return
            }

            await authClient.getSession()
            notify("Profile updated.")
            setEditing(false)
            router.refresh()
        } catch (error) {
            notify(getErrorMessage(error), "error")
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
            <section className="glass-surface rounded-3xl p-6">
                <div className="text-center">
                    <h2 className="font-heading text-lg font-semibold">
                        Profile photo
                    </h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                        This picture appears across your MentorLagbe account.
                    </p>
                </div>
                <div className="mt-6">
                    <AvatarUpload
                        value={image}
                        onChange={setImage}
                        name={name || user.email || "Member"}
                        size="lg"
                        readOnly={!editing}
                        onUploadingChange={setUploadingImage}
                    />
                </div>

                <div className="mt-8 space-y-3 border-t border-border pt-6 text-sm">
                    <InfoRow icon={Mail} label="Email" value={user.email ?? "—"} />
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Role</span>
                        <StatusBadge status={role} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Plan</span>
                        <StatusBadge status={plan} />
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Verified</span>
                        <StatusBadge
                            status={user.emailVerified ? "active" : "pending"}
                        >
                            {user.emailVerified ? "Verified" : "Not verified"}
                        </StatusBadge>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">Member since</span>
                        <span className="font-medium">
                            {user.createdAt ? formatDate(user.createdAt) : "—"}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-muted-foreground">User ID</span>
                        <span className="max-w-32 truncate font-mono text-xs">
                            {user.id}
                        </span>
                    </div>
                </div>
            </section>

            <section className="glass-surface rounded-3xl p-6">
                {editing ? (
                    <form onSubmit={handleSubmit}>
                        <div className="flex items-center gap-2 text-primary">
                            <Pencil className="size-5" />
                            <h2 className="font-heading text-lg font-semibold">
                                Edit profile
                            </h2>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Update your photo and personal details. Role and plan
                            are managed by account permissions.
                        </p>

                        <div className="mt-6 grid gap-4 sm:grid-cols-2">
                            <AuthField
                                id="profile-name"
                                label="Full name"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                                autoComplete="name"
                            />
                            <AuthField
                                id="profile-email"
                                label="Email"
                                value={user.email ?? ""}
                                disabled
                                className="opacity-70"
                            />
                            <AuthField
                                id="profile-phone"
                                label="Phone number"
                                placeholder="+880 1XXX-XXXXXX"
                                value={phone}
                                onChange={(event) => setPhone(event.target.value)}
                                autoComplete="tel"
                                className="sm:col-span-2"
                            />
                            <div className="space-y-2 sm:col-span-2">
                                <label
                                    htmlFor="profile-bio"
                                    className="text-sm font-medium"
                                >
                                    Bio
                                </label>
                                <textarea
                                    id="profile-bio"
                                    rows={5}
                                    maxLength={280}
                                    placeholder="Tell us a little about yourself..."
                                    value={bio}
                                    onChange={(event) => setBio(event.target.value)}
                                    className="glass-surface min-h-28 w-full rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
                                />
                                <p className="text-right text-xs text-muted-foreground">
                                    {bio.length}/280
                                </p>
                            </div>
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                            <Button
                                type="submit"
                                disabled={saving || uploadingImage}
                            >
                                {uploadingImage
                                    ? "Uploading photo..."
                                    : saving
                                      ? "Saving..."
                                      : "Save changes"}
                            </Button>
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={closeEditor}
                                disabled={saving || uploadingImage}
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                ) : (
                    <div>
                        <div className="flex flex-wrap items-start justify-between gap-3">
                            <div className="flex items-center gap-2 text-primary">
                                <ShieldCheck className="size-5" />
                                <h2 className="font-heading text-lg font-semibold">
                                    Personal information
                                </h2>
                            </div>
                            <Button
                                type="button"
                                variant="secondary"
                                size="sm"
                                onClick={() => setEditing(true)}
                            >
                                <Pencil />
                                Edit profile
                            </Button>
                        </div>

                        <dl className="mt-6 grid gap-4 sm:grid-cols-2">
                            <ViewField label="Full name" value={name || "—"} />
                            <ViewField
                                label="Email"
                                value={user.email ?? "—"}
                            />
                            <ViewField
                                label="Phone number"
                                value={phone || "Not added yet"}
                            />
                            <ViewField label="Role" value={role} />
                            <ViewField label="Plan" value={plan} />
                            <ViewField
                                label="Bio"
                                value={bio || "No bio added yet."}
                                wide
                            />
                        </dl>
                    </div>
                )}
            </section>
        </div>
    )
}

function ViewField({
    label,
    value,
    wide = false,
}: {
    label: string
    value: string
    wide?: boolean
}) {
    return (
        <div className={wide ? "sm:col-span-2" : undefined}>
            <dt className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {label}
            </dt>
            <dd className="mt-1 rounded-2xl bg-[var(--glass-tint-soft)] px-3 py-2.5 text-sm">
                {value}
            </dd>
        </div>
    )
}

function InfoRow({
    icon: Icon,
    label,
    value,
}: {
    icon: typeof Mail
    label: string
    value: string
}) {
    return (
        <div className="flex items-center justify-between gap-3">
            <span className="inline-flex items-center gap-2 text-muted-foreground">
                <Icon className="size-3.5" />
                {label}
            </span>
            <span className="max-w-40 truncate font-medium">{value}</span>
        </div>
    )
}
