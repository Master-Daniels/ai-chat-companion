"use client";

import { usePathname, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { Home, Plus, Settings } from "lucide-react";

const Sidebar = () => {
    const pathname = usePathname();
    const router = useRouter();

    const routes = [
        {
            icon: Home,
            href: "/",
            label: "Home",
            pro: false,
        },
        {
            icon: Plus,
            href: "/companion/new",
            label: "Create",
            pro: true,
        },
        {
            icon: Settings,
            href: "/settings",
            label: "Settings",
            pro: false,
        },
    ];

    const onNavigate = (url: string, pro: boolean) => {
        // TODO: check if PRO
        router.push(url);
    };

    return (
        <div className="flex flex-col h-full text-primary bg-secondary space-y-4">
            <div className="p-3 flex-1 justify-center flex">
                <div className="space-y-2">
                    {routes.map((route) => (
                        <div
                            key={route.label}
                            className={cn(
                                "text-muted-foreground flex text-xs p-3 w-full justify-start font-medium hover:text-primary hover:bg-primary/10 rounded-lg transition duration-1000 cursor-pointer",
                                pathname === route.href && "bg-primary/10 text-primary"
                            )}
                            onClick={() => onNavigate(route.href, route.pro)}
                        >
                            <div className="flex flex-col gap-y-2 flex-1 items-center">
                                <route.icon className="h-5 w-5" />
                                {route.label}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;
