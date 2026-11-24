import { Suspense } from "react"

import {
    PaymentSuccess,
    PaymentSuccessFallback,
} from "@/components/payment/payment-success"

export const metadata = {
    title: "Payment Successful | MentorLagbe",
}

export default function PaymentSuccessPage() {
    return (
        <Suspense fallback={<PaymentSuccessFallback />}>
            <PaymentSuccess />
        </Suspense>
    )
}
