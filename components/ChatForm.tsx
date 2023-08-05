"use client";

import { ChangeEvent, FormEvent } from "react";
import { ChatRequestOptions } from "ai";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SendHorizonal } from "lucide-react";

interface IProps {
    input: string;
    isLoading: boolean;
    handleInputChange: (e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => void;
    onSubmit(e: FormEvent<HTMLFormElement>, chatRequestOptions?: ChatRequestOptions): void;
}

const ChatForm = ({ isLoading, input, handleInputChange, onSubmit }: IProps) => {
    return (
        <form className="border-t border-primary/10 py-4 flex items-center gap-x-2" onSubmit={onSubmit}>
            <Input
                disabled={isLoading}
                value={input}
                onChange={handleInputChange}
                placeholder="Type a message"
                className="rounded-lg bg-primary/10"
            />
            <Button disabled={isLoading} variant="ghost">
                <SendHorizonal className="w-6 h-6" />
            </Button>
        </form>
    );
};

export default ChatForm;
