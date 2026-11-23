/** Uploads an image file to ImgBB and returns the public URL. */
export async function uploadImage(file: File): Promise<string> {
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY

    if (!apiKey) {
        throw new Error("ImgBB is not configured. Paste an image URL instead.")
    }

    const body = new FormData()
    body.append("image", file)

    const response = await fetch(
        `https://api.imgbb.com/1/upload?key=${apiKey}`,
        { method: "POST", body }
    )

    if (!response.ok) {
        throw new Error("Image upload failed. Please try again.")
    }

    const result: unknown = await response.json()
    const url = (result as { data?: { url?: string } })?.data?.url

    if (!url) {
        throw new Error("Image upload failed. Please try again.")
    }

    return url
}
