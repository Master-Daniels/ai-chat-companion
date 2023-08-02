"use client";

import { useRouter, useSearchParams } from "next/navigation";

import { cn } from "@/lib/utils";
import qs from "query-string";

import { Category } from "@prisma/client";

const Categories = ({ data }: { data: Category[] }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const categoryId = searchParams.get("categoryId");

    const onClick = (id?: string) => {
        const query = { categoryId: id };
        const url = qs.stringifyUrl(
            {
                url: window.location.href,
                query,
            },
            { skipNull: true }
        );

        router.push(url);
    };

    return (
        <div className="w-full overflow-x-auto space-x-2 flex p-1">
            <button
                onClick={() => onClick()}
                className={cn(
                    "flex items-center text-center text-xs md:text-sm p-2 md:px-4 md:py-3 rounded-md bg-primary/10 hover:scale-110 transition",
                    !categoryId && "bg-primary/25"
                )}
            >
                Newest
            </button>
            {data.map((item) => (
                <button
                    onClick={() => onClick(item.id)}
                    key={item.id}
                    className={cn(
                        "flex items-center text-center text-xs md:text-sm p-2 md:px-4 md:py-3 rounded-md bg-primary/10 hover:scale-110 transition duration-1000",
                        item.id === categoryId && "bg-primary/25"
                    )}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
};

export default Categories;
