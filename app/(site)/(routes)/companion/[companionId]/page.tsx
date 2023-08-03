import prisma from "@/lib/prismadb";
import CompanionForm from "./components/Companion-form.";

interface IProps {
    params: {
        companionId: string;
    };
}

const CompanionIdPage = async ({ params }: IProps) => {
    const { companionId } = params;
    // TODO: check for subscription

    const companion = await prisma.companion.findUnique({
        where: {
            id: companionId,
        },
    });

    const categories = await prisma.category.findMany();

    return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
