"use client";
import { useState } from "react";

import { Sparkles } from "lucide-react";
import { Button } from "./ui/button";

import { useProModal } from "@/hooks/use-pro-modal";
import { useToast } from "./ui/use-toast";

interface IProps {
    isPro: boolean;
}

const SubscriptionButton = ({ isPro = false }: IProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const { toast } = useToast();

    const proModal = useProModal();
    const onClick = async () => {
        try {
            setIsLoading(true);
            const response = await (await fetch("/api/stripe")).json();
            window.location.href = response.url;
        } catch (error) {
            toast({
                variant: "destructive",
                description: "Something went wrong",
            });
        } finally {
            setIsLoading(false);
        }
    };
    return (
        <Button
            disabled={isLoading}
            size="sm"
            variant={isPro ? "default" : "premium"}
            onClick={onClick}
            className="disabled:cursor-none"
        >
            {isPro ? "Manage Subscription" : "Upgrade"}
            {!isPro && <Sparkles className="h-4 w-4 ml-2 fill-white" />}
        </Button>
    );
};

export default SubscriptionButton;
