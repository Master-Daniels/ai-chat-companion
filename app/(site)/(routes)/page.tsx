import prisma from "@/lib/prismadb";

import Categories from "@/components/Categories";
import SearchInput from "@/components/SearchInput";
import Companions from "@/components/Companions";

interface IProps {
    searchParams: {
        categoryId: string;
        name: string;
    };
}

const Home = async ({ searchParams }: IProps) => {
    const categories = await prisma.category.findMany();
    const data = await prisma.companion.findMany({
        where: {
            id: searchParams.categoryId,
            name: {
                search: searchParams.name,
            },
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            _count: {
                select: {
                    messages: true,
                },
            },
        },
    });
    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
            <Companions data={data} />
        </div>
    );
};

export default Home;
