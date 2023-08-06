"use client";
import { useState } from "react";

import { useProModal } from "@/hooks/use-pro-modal";

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "./ui/dialog";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { useToast } from "./ui/use-toast";

const ProModal = () => {
    const [isLoading, setIsLoading] = useState(false);

    const proModal = useProModal();
    const { toast } = useToast();

    const onSubscribe = async () => {
        try {
            setIsLoading(true);
            const res = await (await fetch("/api/stripe")).json();
            console.log(res);

            setIsLoading(false);
            window.location.href = res.url;
        } catch (error) {
            setIsLoading(false);
            toast({
                variant: "destructive",
                description: "Something went wrong!",
            });
        }
    };
    return (
        <Dialog open={proModal.isOpen} onOpenChange={proModal.onClose}>
            <DialogContent>
                <DialogHeader className="space-y-4">
                    <DialogTitle className="text-center">Upgrade To Pro</DialogTitle>
                    <DialogDescription className="text-center space-y-2">
                        Create <span className="text-sky-500 mx-1 font-medium">Custom AI</span> Companions
                    </DialogDescription>
                </DialogHeader>
                <Separator />
                <div className="flex justify-between">
                    <p className="text-2xl font-medium">
                        $9
                        <span className="text-sm font-normal">.99 / mo</span>
                    </p>
                    <Button
                        variant="premium"
                        className="hover:ring-2 ring-white transition-all duration-1000"
                        disabled={isLoading}
                        onClick={onSubscribe}
                    >
                        Subscribe
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ProModal;
