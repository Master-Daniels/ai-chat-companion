"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { useCompletion } from "ai/react";

import { Companion, Message } from "@prisma/client";

import ChatHeader from "@/components/ChatHeader";
import ChatForm from "@/components/ChatForm";
import ChatMessages from "@/components/ChatMessages";
import { ChatMessageProps } from "@/components/ChatMessage";

interface IProps {
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
}

const ChatClient = ({ companion }: IProps) => {
    const router = useRouter();
    const [messages, setMessages] = useState<ChatMessageProps[]>(companion.messages);

    const { input, isLoading, handleInputChange, handleSubmit, setInput } = useCompletion({
        api: `/api/chat/${companion.id}`,
        onFinish(undefined, completion) {
            const systemMessage: ChatMessageProps = {
                role: "SYSTEM",
                content: completion,
            };
            setMessages((current) => [...current, systemMessage]);
            setInput("");

            router.refresh();
        },
    });

    const onSubmit = (event: FormEvent<HTMLFormElement>) => {
        const userMessage: ChatMessageProps = {
            role: "USER",
            content: input,
        };

        setMessages((current) => [...current, userMessage]);

        handleSubmit(event);
    };

    return (
        <div className="flex flex-col h-full p-4 space-y-2">
            <ChatHeader companion={companion} />
            <ChatMessages {...{ companion, isLoading, messages }} />
            <ChatForm {...{ input, isLoading, handleInputChange, onSubmit }} />
        </div>
    );
};

export default ChatClient;
