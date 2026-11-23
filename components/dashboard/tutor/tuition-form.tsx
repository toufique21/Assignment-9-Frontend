"use client"

import { ImagePlus } from "lucide-react"
import { useState } from "react"

import { AuthField } from "@/components/auth/auth-field"
import { Button, ButtonLink } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/api-client"
import { uploadImage } from "@/lib/imgbb"
import type { TuitionInput } from "@/lib/tutor-data"
import type { Tuition } from "@/lib/tuitions"

const subjects = [
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "Programming",
    "English",
    "IELTS",
    "Other",
]

const classLevels = [
    "Class 9–10",
    "Class 11–12",
    "All Levels",
    "University",
    "Adult Learners",
]

const selectClass =
    "glass-surface h-11 w-full rounded-2xl px-4 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/60"

type FormState = {
    title: string
    subject: string
    classLevel: string
    mode: "Online" | "Offline"
    location: string
    monthlyFee: string
    daysPerWeek: string
    description: string
}

function toFormState(initial?: Tuition): FormState {
    return {
        title: initial?.title ?? "",
        subject: initial?.subject ?? subjects[0],
        classLevel: initial?.classLevel ?? classLevels[0],
        mode: initial?.mode ?? "Online",
        location: initial?.location ?? "",
        monthlyFee: initial ? String(initial.monthlyFee) : "",
        daysPerWeek: initial ? String(initial.daysPerWeek) : "2",
        description: initial?.description ?? "",
    }
}

export function TuitionForm({
    initial,
    onSubmit,
    submitLabel = "Publish tuition",
}: {
    initial?: Tuition
    onSubmit: (input: TuitionInput) => void | Promise<void>
    submitLabel?: string
}) {
    const { notify } = useToast()
    const [form, setForm] = useState<FormState>(() => toFormState(initial))
    const [imageUrl, setImageUrl] = useState(initial?.bannerImage ?? "")
    const [file, setFile] = useState<File | null>(null)
    const [uploading, setUploading] = useState(false)

    function update<K extends keyof FormState>(key: K, value: FormState[K]) {
        setForm((current) => ({ ...current, [key]: value }))
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()

        const monthlyFee = Number(form.monthlyFee)
        const daysPerWeek = Number(form.daysPerWeek)

        if (!form.title.trim() || !form.description.trim()) {
            notify("Title and description are required.", "error")
            return
        }
        if (!form.subject || !form.classLevel) {
            notify("Choose a subject and class level.", "error")
            return
        }
        if (!Number.isFinite(monthlyFee) || monthlyFee <= 0) {
            notify("Enter a valid monthly fee.", "error")
            return
        }
        if (!Number.isInteger(daysPerWeek) || daysPerWeek < 1 || daysPerWeek > 7) {
            notify("Days per week must be between 1 and 7.", "error")
            return
        }
        if (form.mode === "Offline" && !form.location.trim()) {
            notify("Add a location for offline tuitions.", "error")
            return
        }

        let bannerImage = imageUrl.trim()

        if (file) {
            setUploading(true)
            try {
                bannerImage = await uploadImage(file)
            } catch (error) {
                notify(
                    error instanceof Error
                        ? error.message
                        : "Image upload failed.",
                    "error"
                )
                setUploading(false)
                return
            }
            setUploading(false)
        }

        try {
            await onSubmit({
                title: form.title.trim(),
                subject: form.subject,
                classLevel: form.classLevel,
                mode: form.mode,
                location:
                    form.mode === "Online" ? "Remote" : form.location.trim(),
                monthlyFee,
                daysPerWeek,
                bannerImage,
                description: form.description.trim(),
            })
        } catch (error) {
            notify(getErrorMessage(error), "error")
        }
    }

    return (
        <form onSubmit={handleSubmit} className="glass-surface rounded-3xl p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2">
                <AuthField
                    id="tuition-title"
                    label="Title"
                    placeholder="e.g. HSC Mathematics Mastery"
                    value={form.title}
                    onChange={(event) => update("title", event.target.value)}
                />

                <div className="space-y-2">
                    <label htmlFor="tuition-subject" className="text-sm font-medium">
                        Subject
                    </label>
                    <select
                        id="tuition-subject"
                        className={selectClass}
                        value={form.subject}
                        onChange={(event) => update("subject", event.target.value)}
                    >
                        {subjects.map((subject) => (
                            <option key={subject}>{subject}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="tuition-level" className="text-sm font-medium">
                        Class Level
                    </label>
                    <select
                        id="tuition-level"
                        className={selectClass}
                        value={form.classLevel}
                        onChange={(event) =>
                            update("classLevel", event.target.value)
                        }
                    >
                        {classLevels.map((level) => (
                            <option key={level}>{level}</option>
                        ))}
                    </select>
                </div>

                <div className="space-y-2">
                    <label htmlFor="tuition-mode" className="text-sm font-medium">
                        Mode
                    </label>
                    <select
                        id="tuition-mode"
                        className={selectClass}
                        value={form.mode}
                        onChange={(event) =>
                            update("mode", event.target.value as FormState["mode"])
                        }
                    >
                        <option>Online</option>
                        <option>Offline</option>
                    </select>
                </div>

                <AuthField
                    id="tuition-location"
                    label="Location"
                    placeholder={
                        form.mode === "Online" ? "Remote" : "e.g. Dhanmondi, Dhaka"
                    }
                    value={form.location}
                    onChange={(event) => update("location", event.target.value)}
                />

                <AuthField
                    id="tuition-fee"
                    label="Monthly fee (৳)"
                    type="number"
                    min={1}
                    placeholder="4500"
                    value={form.monthlyFee}
                    onChange={(event) => update("monthlyFee", event.target.value)}
                />

                <AuthField
                    id="tuition-days"
                    label="Days / week"
                    type="number"
                    min={1}
                    max={7}
                    value={form.daysPerWeek}
                    onChange={(event) => update("daysPerWeek", event.target.value)}
                />

                <div className="space-y-2">
                    <label htmlFor="tuition-image" className="text-sm font-medium">
                        Banner image
                    </label>
                    <div className="relative">
                        <ImagePlus className="pointer-events-none absolute top-3.5 left-3.5 size-4 text-muted-foreground" />
                        <AuthField
                            id="tuition-image"
                            label=""
                            className="pl-10"
                            placeholder="Paste an image URL"
                            value={imageUrl}
                            onChange={(event) => setImageUrl(event.target.value)}
                        />
                    </div>
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="tuition-file" className="text-sm font-medium">
                        Or upload an image
                    </label>
                    <input
                        id="tuition-file"
                        type="file"
                        accept="image/*"
                        onChange={(event) =>
                            setFile(event.target.files?.[0] ?? null)
                        }
                        className="glass-surface h-11 w-full rounded-2xl px-4 py-2 text-sm outline-none file:mr-3 file:rounded-full file:bg-primary/15 file:px-3 file:py-1 file:text-xs file:font-semibold file:text-primary focus-visible:ring-2 focus-visible:ring-primary/60"
                    />
                    <p className="text-xs text-muted-foreground">
                        Files upload through ImgBB. Paste a URL if ImgBB is not
                        configured.
                    </p>
                </div>

                <div className="space-y-2 sm:col-span-2">
                    <label htmlFor="tuition-description" className="text-sm font-medium">
                        Description
                    </label>
                    <textarea
                        id="tuition-description"
                        rows={5}
                        placeholder="Explain your teaching approach, topics and schedule..."
                        value={form.description}
                        onChange={(event) =>
                            update("description", event.target.value)
                        }
                        className="glass-surface min-h-28 w-full rounded-2xl px-4 py-3 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/60"
                    />
                </div>
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
                <Button type="submit" disabled={uploading}>
                    {uploading ? "Uploading image..." : submitLabel}
                </Button>
                <ButtonLink href="/dashboard/tutor/my-tuitions" variant="secondary">
                    Cancel
                </ButtonLink>
            </div>
        </form>
    )
}
