import prisma from "@/lib/prismadb";
import CompanionForm from "./components/Companion-form.";
import { auth, redirectToSignIn } from "@clerk/nextjs";

interface IProps {
    params: {
        companionId: string;
    };
}

const CompanionIdPage = async ({ params }: IProps) => {
    const { userId } = auth();
    const { companionId } = params;

    // TODO: check for subscription

    if (!userId) return redirectToSignIn();

    let companion = null;

    if (companionId !== "new") {
        companion = await prisma.companion.findUnique({
            where: {
                id: companionId,
                userId,
            },
        });
    }

    const categories = await prisma.category.findMany();

    return <CompanionForm initialData={companion} categories={categories} />;
};

export default CompanionIdPage;
