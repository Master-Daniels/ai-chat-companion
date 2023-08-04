import { NextResponse } from "next/server";

import { currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";

export async function POST(req: Request) {
    try {
        const { name, description, instructions, seed, src, categoryId } = await req.json();

        const user = await currentUser();

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized user", { status: 401, statusText: "FAILURE" });
        }

        if (!name || !description || !instructions || !seed || !src || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400, statusText: "FAILURE" });
        }

        // TODO: check for subscription

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
