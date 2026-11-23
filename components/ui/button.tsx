import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"
import Link from "next/link"
import type { ComponentProps } from "react"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
    "glass-button group/button inline-flex shrink-0 items-center justify-center whitespace-nowrap text-sm font-medium select-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
    {
        variants: {
            variant: {
                default: "glass-primary",
                secondary: "glass-secondary",
                outline: "glass-outline",
                ghost: "glass-ghost",
                destructive: "glass-danger",
                link: "glass-link",
            },
            size: {
                default: "h-10 gap-2 px-5",
                sm: "h-9 gap-1.5 px-4 text-[0.85rem]",
                lg: "h-11 gap-2 px-6",
                icon: "size-10",
                "icon-sm": "size-9",
                "icon-lg": "size-11",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

type ButtonStyleProps = VariantProps<typeof buttonVariants>

function Button({
    className,
    variant = "default",
    size = "default",
    ...props
}: ButtonPrimitive.Props & ButtonStyleProps) {
    return (
        <ButtonPrimitive
            className={cn(buttonVariants({ variant, size, className }))}
            {...props}
        />
    )
}

/** A Link that looks and behaves like a Button, without nesting <a> inside <button>. */
function ButtonLink({
    className,
    variant = "default",
    size = "default",
    ...props
}: ComponentProps<typeof Link> & ButtonStyleProps) {
    return (
        <Link className={cn(buttonVariants({ variant, size, className }))} {...props} />
    )
}

export { Button, ButtonLink, buttonVariants }
