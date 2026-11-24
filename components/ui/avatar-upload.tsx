"use client"

import { Camera, Loader2, X } from "lucide-react"
import Image from "next/image"
import { useEffect, useId, useRef, useState } from "react"
import type { ChangeEvent } from "react"

import { PremiumCrown } from "@/components/ui/premium-crown"
import { useToast } from "@/components/ui/toast"
import { getErrorMessage } from "@/lib/api-client"
import { uploadImage } from "@/lib/imgbb"
import { cn } from "@/lib/utils"

function initials(name: string) {
    const parts = name.trim().split(/\s+/).slice(0, 2)
    const value = parts.map((part) => part.charAt(0)).join("").toUpperCase()

    return value || "?"
}

export function AvatarUpload({
    value,
    onChange,
    name,
    size = "md",
    readOnly = false,
    isPremium = false,
    onUploadingChange,
}: {
    value: string
    onChange: (url: string) => void
    name: string
    size?: "md" | "lg"
    readOnly?: boolean
    isPremium?: boolean
    onUploadingChange?: (uploading: boolean) => void
}) {
    const inputId = useId()
    const { notify } = useToast()
    const [preview, setPreview] = useState("")
    const [uploading, setUploading] = useState(false)
    const objectUrlRef = useRef<string | null>(null)

    useEffect(() => {
        return () => {
            if (objectUrlRef.current) {
                URL.revokeObjectURL(objectUrlRef.current)
            }
        }
    }, [])

    function setUploadingState(next: boolean) {
        setUploading(next)
        onUploadingChange?.(next)
    }

    function releasePreview() {
        if (objectUrlRef.current) {
            URL.revokeObjectURL(objectUrlRef.current)
            objectUrlRef.current = null
        }
        setPreview("")
    }

    async function handleChange(event: ChangeEvent<HTMLInputElement>) {
        const input = event.currentTarget
        const file = input.files?.[0]
        input.value = ""
        releasePreview()

        if (!file) return

        if (!file.type.startsWith("image/")) {
            notify("Please choose an image file.", "error")
            return
        }

        if (file.size > 32 * 1024 * 1024) {
            notify("Image must be smaller than 32MB.", "error")
            return
        }

        const objectUrl = URL.createObjectURL(file)
        objectUrlRef.current = objectUrl
        setPreview(objectUrl)
        setUploadingState(true)

        try {
            const url = await uploadImage(file)
            onChange(url)
        } catch (error) {
            notify(getErrorMessage(error), "error")
        } finally {
            releasePreview()
            setUploadingState(false)
        }
    }

    const displayUrl = preview || value
    const avatarClass = size === "lg" ? "size-28" : "size-20"

    return (
        <div className="flex flex-col items-center gap-3">
            <div className={cn("relative", avatarClass)}>
                <div className="relative h-full w-full overflow-hidden rounded-full bg-gradient-to-br from-[#b86500] to-[#5e5ce6] ring-2 ring-white/40">
                    {displayUrl ? (
                        <Image
                            src={displayUrl}
                            alt="Profile picture preview"
                            fill
                            unoptimized
                            sizes="112px"
                            className="object-cover"
                        />
                    ) : (
                        <span className="flex h-full w-full items-center justify-center text-xl font-semibold text-white">
                            {initials(name)}
                        </span>
                    )}
                    {uploading ? (
                        <span className="absolute inset-0 flex items-center justify-center bg-black/45">
                            <Loader2 className="size-6 animate-spin text-white" />
                        </span>
                    ) : null}
                </div>
                {isPremium ? (
                    <PremiumCrown className="absolute -top-1 -right-1 size-6 [&_svg]:size-4" />
                ) : null}
            </div>

            {!readOnly ? (
                <>
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <input
                            id={inputId}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleChange}
                        />
                        <label
                            htmlFor={inputId}
                            className="glass-secondary inline-flex h-9 cursor-pointer items-center gap-2 rounded-2xl px-4 text-xs font-semibold"
                        >
                            <Camera className="size-3.5" />
                            {value || preview ? "Change photo" : "Upload photo"}
                        </label>
                        {value ? (
                            <button
                                type="button"
                                onClick={() => {
                                    releasePreview()
                                    onChange("")
                                }}
                                className="glass-ghost inline-flex h-9 items-center gap-1.5 rounded-2xl px-3 text-xs font-semibold text-muted-foreground"
                            >
                                <X className="size-3.5" />
                                Remove
                            </button>
                        ) : null}
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                        {uploading
                            ? "Uploading to ImgBB..."
                            : "JPG, PNG or WebP · uploaded through ImgBB"}
                    </p>
                </>
            ) : null}
        </div>
    )
}
