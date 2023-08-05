"use client";

import { useTheme } from "next-themes";
import { BeatLoader } from "react-spinners";
import { useToast } from "./ui/use-toast";
import { cn } from "@/lib/utils";
import BotAvatar from "./BotAvatar";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/button";
import { Copy } from "lucide-react";

export interface ChatMessageProps {
    role: "SYSTEM" | "USER";
    content?: string;
    isLoading?: boolean;
    src?: string;
}

const ChatMessage = ({ role, content, isLoading, src }: ChatMessageProps) => {
    const { toast } = useToast();
    const { theme } = useTheme();

    const onCopy = () => {
        if (!content) return;
        navigator.clipboard.writeText(content);
        toast({
            description: "message copied to clipboard!",
        });
    };

    return (
        <div
            className={cn(
                `group flex items-center justify-start gap-x-3 py-4 w-full`,
                role === "USER" && "justify-end"
            )}
        >
            {role !== "USER" && src && <BotAvatar src={src} />}
            <div className="rounded-md px-4 py-2 max-w-sm text-sm bg-primary/10">
                {isLoading ? <BeatLoader color={theme === "light" ? "black" : "white"} size={5} /> : content}
            </div>
            {role === "USER" && <UserAvatar />}
            {role !== "USER" && !isLoading && (
                <Button
                    onClick={onCopy}
                    size="icon"
                    variant="ghost"
                    className="opacity-0 group-hover:opacity-100 transition-all duration-1000"
                >
                    <Copy className="w-4 h-4" />
                </Button>
            )}
        </div>
    );
};

export default ChatMessage;
