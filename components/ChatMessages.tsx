"use client";

import { Companion } from "@prisma/client";
import ChatMessage, { ChatMessageProps } from "./ChatMessage";
import { ElementRef, useEffect, useRef, useState } from "react";

interface IProps {
    companion: Companion;
    isLoading: boolean;
    messages: ChatMessageProps[];
}

const ChatMessages = ({ companion, isLoading, messages }: IProps) => {
    const [fakeLoading, setFakeLoading] = useState<boolean>(!messages.length ? true : false);
    const scrollRef = useRef<ElementRef<"div">>(null);

    useEffect(() => {
        const timer = setTimeout(() => {
            setFakeLoading(false);
        }, 1000);

        return () => {
            clearTimeout(timer);
        };
    }, []);

    useEffect(() => {
        if (scrollRef) {
            scrollRef?.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages.length]);

    return (
        <div className="flex-1 overflow-y-auto pr-4">
            <ChatMessage
                isLoading={fakeLoading}
                role="SYSTEM"
                src={companion.src}
                content={`Hello I am ${companion.name}, ${companion.description} `}
            />
            {messages.map((message) => (
                <ChatMessage
                    key={message.content}
                    isLoading={fakeLoading}
                    role={message.role}
                    src={message.src}
                    content={message.content}
                />
            ))}
            {isLoading && <ChatMessage isLoading role="SYSTEM" src={companion.src} />}
            <div ref={scrollRef} />
        </div>
    );
};

export default ChatMessages;
