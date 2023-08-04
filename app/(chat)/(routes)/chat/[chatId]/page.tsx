import { redirect } from "next/navigation";

import { auth, redirectToSignIn } from "@clerk/nextjs";

import prisma from "@/lib/prismadb";
import ChatClient from "./components/ChatClient";

interface IProps {
    params: { chatId: string };
}

const ChatIdPage = async ({ params: { chatId } }: IProps) => {
    const { userId } = auth();

    if (!userId) return redirectToSignIn();

    const companion = await prisma.companion.findUnique({
        where: {
            id: chatId,
        },
        include: {
            messages: {
                orderBy: {
                    createdAt: "desc",
                },
                where: {
                    userId,
                },
            },
            _count: {
                select: {
                    messages: true,
                },
            },
        },
    });

    if (!companion) redirect("/");

    return <ChatClient companion={companion} />;
};

export default ChatIdPage;
