import { NextResponse } from "next/server";

import { auth, currentUser } from "@clerk/nextjs";
import prisma from "@/lib/prismadb";

export async function PATCH(req: Request, { params: { companionId } }: { params: { companionId: string } }) {
    try {
        const { name, description, instructions, seed, src, categoryId } = await req.json();

        const user = await currentUser();

        if (!companionId) {
            return new NextResponse("Companion ID is required", { status: 400, statusText: "FAILURE" });
        }

        if (!user || !user.id || !user.firstName) {
            return new NextResponse("Unauthorized user", { status: 401, statusText: "FAILURE" });
        }

        if (!name || !description || !instructions || !seed || !src || !categoryId) {
            return new NextResponse("Missing required fields", { status: 400, statusText: "FAILURE" });
        }

        // TODO: check for subscription

        const companion = await prisma.companion.update({
            where: {
                id: companionId,
                userId: user.id,
            },
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
        console.log("[COMPANION PATCH ERROR]:", error.message);
        return new NextResponse("Internal Server Error", { status: 500, statusText: "FAILURE" });
    }
}

export async function DELETE(req: Request, { params: { companionId } }: { params: { companionId: string } }) {
    try {
        const { userId } = auth();
        if (!userId) {
            return new NextResponse("Unauthorized user", { status: 401, statusText: "FAILURE" });
        }
        const companion = await prisma.companion.delete({
            where: {
                userId,
                id: companionId,
            },
        });

        return NextResponse.json(companion);
    } catch (error: any) {
        console.log("[COMPANION DELETE ERROR]: ", error.message);
        return new NextResponse("Internal Server Error", { status: 500, statusText: "FAILURE" });
    }
}
