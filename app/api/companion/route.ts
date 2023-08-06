import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";
import { checkSubscription } from "@/lib/subscription";

export async function POST(req: Request) {
    const isPro = await checkSubscription();
    try {
        const { name, description, instructions, seed, src, categoryId } = await req.json();

        const user = await currentUser();

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized user", { status: 401, statusText: "FAILURE" });
        }

        if (!name || !description || !instructions || !seed || !src || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400, statusText: "FAILURE" });
        }

        if (!isPro)
            return new NextResponse("You need to subscribe to create a companion", {
                status: 403,
                statusText: "FAILURE",
            });

        const companion = await prisma.companion.create({
            data: {
                userId: user.id,
                categoryId,
                userName: user.firstName,
                src,
                name,
                description,
                instructions,
                seed,
            },
        });

        return NextResponse.json(companion);
    } catch (error: any) {
        console.log("[COMPANION POST ERROR]:", error.message);
        return new NextResponse("Internal Error", { status: 500, statusText: "FAILURE" });
    }
}
