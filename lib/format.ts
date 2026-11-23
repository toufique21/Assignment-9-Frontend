export function formatMonthlyFee(amount: number) {
    return `৳${amount.toLocaleString("en-BD")}`
}

export function formatUsd(amount: number) {
    return `$${amount.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })}`
}

export function formatDate(value: string) {
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    }).format(new Date(value))
}
