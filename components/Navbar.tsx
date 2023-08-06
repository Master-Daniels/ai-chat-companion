"use client";

import Link from "next/link";

import { Menu, Sparkles } from "lucide-react";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { ThemeToggle } from "./themeToggle";
import MobileSidebar from "./MobileSidebar";
import { useProModal } from "@/hooks/use-pro-modal";

const poppins = Poppins({ weight: "600", subsets: ["latin"] });

const Navbar = () => {
    const proModal = useProModal();
    return (
        <div className="fixed w-full z-50 flex justify-between items-center py-2 px-4 border-b border-primary/10 bg-secondary h-16">
            <div className="flex items-center">
                <MobileSidebar />
                <Link href="/">
                    <h1
                        className={cn(
                            `hidden md:block text-xl md:text-3xl font-semibold text-primary`,
                            poppins.className
                        )}
                    >
                        chat-companion.ai
                    </h1>
                </Link>
            </div>
            <div className="flex items-center gap-x-3">
                <Button
                    size="sm"
                    variant="premium"
                    className="hover:ring-2 ring-white transition-all duration-1000"
                    onClick={proModal.onOpen}
                >
                    Upgrade
                    <Sparkles className="h-4 w-4 fill-white text-white ml-2" />
                </Button>
                <ThemeToggle />
                <UserButton afterSignOutUrl="/" />
            </div>
        </div>
    );
};

export default Navbar;
