import { auth, currentUser } from "@clerk/nextjs";

import { NextResponse } from "next/server";

import prisma from "@/lib/prismadb";
import { stripe } from "@/lib/stripe";
import { absoluteURL } from "@/lib/utils";

const settingsURL = absoluteURL("/settings");
export async function GET(request: Request) {
    try {
        const { userId } = auth();
        const user = await currentUser();

        if (!userId || !user) return new NextResponse("Unauthorized", { status: 401, statusText: "FAILURE" });

        const userSubscription = await prisma.userSubscription.findUnique({
            where: {
                userId,
            },
        });

        if (userSubscription && userSubscription.stripeCustomerId) {
            const stripeSession = await stripe.billingPortal.sessions.create({
                customer: userSubscription.stripeCustomerId,
                return_url: settingsURL,
            });
            return new NextResponse(JSON.stringify({ url: stripeSession.url, status: 200, statusText: "SUCCESS" }));
        }

        const stripeSession = await stripe.checkout.sessions.create({
            success_url: settingsURL,
            cancel_url: settingsURL,
            payment_method_types: ["card"],
            mode: "subscription",
            billing_address_collection: "auto",
            customer_email: user.emailAddresses[0].emailAddress,
            line_items: [
                {
                    price_data: {
                        currency: "USD",
                        product_data: { name: "Companion Plus", description: "Create and Customize AI Companions." },
                        unit_amount: 999,
                        recurring: { interval: "month" },
                    },
                    quantity: 1,
                },
            ],
            metadata: {
                userId,
            },
        });

        return new NextResponse(JSON.stringify({ url: stripeSession.url, status: 200, statusText: "SUCCESS" }));
    } catch (error: any) {
        console.log("[STRIPE_GET]: ", error);
        return new NextResponse("Internal Error", { status: 500, statusText: "FAILURE" });
    }
}
