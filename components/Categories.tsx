import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";

const Categories = ({ data }: { data: Category[] }) => {
    return (
        <div className="w-full overflow-x-auto space-x-2 flex p-1">
            <button
                className={cn(
                    "flex items-center text-center text-xs md:text-sm p-2 md:px-4 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition"
                )}
            >
                Newest
            </button>
            {data.map((item) => (
                <button
                    key={item.id}
                    className={cn(
                        "flex items-center text-center text-xs md:text-sm p-2 md:px-4 md:py-3 rounded-md bg-primary/10 hover:opacity-75 transition duration-1000"
                    )}
                >
                    {item.name}
                </button>
            ))}
        </div>
    );
};

export default Categories;
