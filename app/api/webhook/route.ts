import { headers } from "next/headers";
import { NextResponse } from "next/server";

import Stripe from "stripe";

import prisma from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";

export async function POST(request: Request) {
    const body = await request.text();
    const signature = headers().get("Stripe-Signature") as string;

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
    } catch (error: any) {
        console.log("[WEBHOOK_ERROR]: ", error.message);

        return new NextResponse("Webhook Error: " + error.message, { status: 400, statusText: "FAILURE" });
    }

    const session = event.data.object as Stripe.Checkout.Session;

    if (event.type === "checkout.session.completed") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        if (!session.metadata?.userId) {
            return new NextResponse("User ID is required", { status: 400, statusText: "FAILURE" });
        }

        const sub = await prisma.userSubscription.create({
            data: {
                userId: session?.metadata?.userId,
                stripeSubscriptionId: subscription.id,
                stripeCustomerId: subscription.customer as string,
                stripePriceId: subscription.items.data[0].price.id,
                stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
            },
        });
    }

    if (event.type === "invoice.payment_succeeded") {
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);

        const exists = !!(await prisma.userSubscription.findFirst({
            where: {
                stripeSubscriptionId: subscription.id,
            },
        }));

        if (exists)
            await prisma.userSubscription.update({
                where: {
                    stripeSubscriptionId: subscription.id,
                },
                data: {
                    stripePriceId: subscription.items.data[0].price.id,
                    stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000),
                },
            });
    }

    return new NextResponse(null, { status: 200 });
}
