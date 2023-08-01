import prisma from "@/lib/prismadb";

import Categories from "@/components/Categories";
import SearchInput from "@/components/SearchInput";

const Home = async () => {
    const categories = await prisma.category.findMany();
    return (
        <div className="h-full p-4 space-y-2">
            <SearchInput />
            <Categories data={categories} />
        </div>
    );
};

export default Home;
