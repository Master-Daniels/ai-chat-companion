"use client";

import { Companion, Message } from "@prisma/client";

import { Button } from "./ui/button";
import { ChevronLeft, Edit, MessageSquare, MoreVertical, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import BotAvatar from "./BotAvatar";
import { useUser } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { useToast } from "./ui/use-toast";

interface IProps {
    companion: Companion & {
        messages: Message[];
        _count: {
            messages: number;
        };
    };
}

const ChatHeader = ({ companion }: IProps) => {
    const { user } = useUser();
    const router = useRouter();
    const { toast } = useToast();

    const onDelete = async () => {
        try {
            await fetch(`/api/companion/${companion.id}`, {
                method: "DELETE",
            });

            toast({
                description: "Success.",
            });
            router.refresh();
            router.push("/");
        } catch (error: any) {
            toast({
                description: "Something went wrong!",
                variant: "destructive",
            });
        }
    };

    return (
        <div className="flex w-full items-center justify-between border-b border-primary/10 pb-4">
            <div className="flex gap-2 items-center">
                <Button size="icon" variant="ghost" onClick={() => router.back()}>
                    <ChevronLeft className="h-8 w-8" />
                </Button>
                <BotAvatar src={companion.src} />
                <div className="flex flex-col gap-y-1">
                    <div className="flex-items-center gap-x-2">
                        <p className="font-bold">{companion.name}</p>
                        <div className="flex items-center text-sm text-muted-foreground">
                            <MessageSquare className="w-3 h-3 mr-1" />
                            {companion._count.messages}
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground">Created by {companion.userName}</p>
                </div>
            </div>
            {user?.id === companion.userId && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="secondary" size="icon">
                            <MoreVertical />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/companion/${companion.id}`)}>
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                            onClick={onDelete}
                            className="text-red-500 focus:bg-red-900/40 focus:text-red-500"
                        >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    );
};

export default ChatHeader;
