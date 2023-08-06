import { StreamingTextResponse, LangChainStream } from "ai";
import { auth, currentUser } from "@clerk/nextjs";

import { CallbackManager } from "langchain/callbacks";
import { Replicate } from "langchain/llms/replicate";

import { NextResponse } from "next/server";

import { MemoryManager } from "@/lib/memory";
import { rateLimit } from "@/lib/rateLimit";
import prisma from "@/lib/prismadb";

export async function POST(request: Request, { params: { chatId } }: { params: { chatId: string } }) {
    try {
        const { prompt } = await request.json();
        const user = await currentUser();

        if (!user || !user.firstName || !user.id) {
            return new NextResponse("Unauthorized", { status: 401, statusText: "FAILURE" });
        }

        const identifier = request.url + "-" + user.id;
        const { success } = await rateLimit(identifier);

        if (!success) {
            return new NextResponse("Rate Limit Exceeded", { status: 429, statusText: "FAILURE" });
        }

        const companion = await prisma.companion.update({
            where: {
                id: chatId,
            },
            data: {
                messages: {
                    create: {
                        content: prompt,
                        role: "USER",
                        userId: user.id,
                    },
                },
            },
        });

        if (!companion) {
            return new NextResponse("Companion Not Found", { status: 404, statusText: "FAILURE" });
        }

        const name = companion.id;
        const companion_file_name = name + ".txt";

        const companionKey = {
            companionName: name,
            userId: user.id,
            modelName: "llama2-13b",
        };

        const memoryManager = await MemoryManager.getInstance();

        const records = await memoryManager.readLatestHistory(companionKey);

        if (records.length === 0) {
            await memoryManager.seedChatHistory(companion.seed, "\n\n", companionKey);
        }

        await memoryManager.writeToHistory("User" + prompt + "\n", companionKey);

        const recentChatHistory = await memoryManager.readLatestHistory(companionKey);

        const similarDocs = await memoryManager.vectorSearch(recentChatHistory, companion_file_name);

        let relevantHistory = "";
        if (!!similarDocs && similarDocs.length !== 0) {
            relevantHistory = similarDocs.map((doc) => doc.pageContent).join("\n");
        }

        const { handlers } = LangChainStream();

        const model = new Replicate({
            model: "a16z-infra/llama-2-13b-chat:df7690f1994d94e96ad9d568eac121aecf50684a0b0963b25a41cc40061269e5",
            input: {
                max_length: 2048,
            },
            apiKey: process.env.REPLICATE_API_TOKEN,
            callbackManager: CallbackManager.fromHandlers(handlers),
        });

        // Turn verbose on for debugging
        model.verbose = true;

        const resp = String(
            await model
                .call(
                    `
        ONLY generate plain sentences without prefix of who is speaking. DO NOT use ${companion.name}: prefix. 

        ${companion.instructions}

        Below are relevant details about ${companion.name}'s past and the conversation you are in.
        ${relevantHistory}


        ${recentChatHistory}\n${companion.name}:`
                )
                .catch(console.error)
        );

        const cleaned = resp.replaceAll(",", "");
        const chunks = cleaned.split("\n");
        const response = chunks[0];

        await memoryManager.writeToHistory("" + response.trim(), companionKey);
        var Readable = require("stream").Readable;

        let s = new Readable();
        s.push(response);
        s.push(null);
        if (response !== undefined && response.length > 1) {
            memoryManager.writeToHistory("" + response.trim(), companionKey);

            await prisma.companion.update({
                where: {
                    id: chatId,
                },
                data: {
                    messages: {
                        create: {
                            content: response.trim(),
                            role: "SYSTEM",
                            userId: user.id,
                        },
                    },
                },
            });
        }

        return new StreamingTextResponse(s);
    } catch (error: any) {
        console.log("[CHAT_POST]: ", error.message);
        return new NextResponse("Internal error", { status: 500, statusText: "FAILURE" });
    }
}
