import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";

import { ClerkProvider } from "@clerk/nextjs";

import { ThemeProvider } from "@/components/themeProvider";

import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/toaster";

import ProModal from "@/components/ProModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Chat Companion",
    description: "The best AI Chat Companion Built with Nextjs And TailwindCSS",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <ClerkProvider>
            <html lang="en" suppressHydrationWarning>
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <body className={cn("bg-secondary/50", inter.className)}>
                    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                        <ProModal />
                        {children}
                        <Toaster />
                    </ThemeProvider>
                </body>
            </html>
        </ClerkProvider>
    );
}
