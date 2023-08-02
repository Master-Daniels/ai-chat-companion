"use client";

import * as zod from "zod";
import { Category, Companion } from "@prisma/client";

interface IProps {
    initialData: Companion | null;
    categories: Category[];
}

const formSchema = zod.object({
    name: zod.string().min(1, {
        message: "Name is required.",
    }),
    description: zod.string().min(1, {
        message: "Description is required.",
    }),
    instructions: zod.string().min(200, {
        message: "Instructions require at least 200 characters/",
    }),
    seed: zod.string().min(1, {
        message: "Seed require at least 200 characters/",
    }),
    src: zod.string().min(1, {
        message: "Image is required.",
    }),
    categotyId: zod.string().min(1, {
        message: "Category is required.",
    }),
});

const CompanionForm = ({ initialData, categories }: IProps) => {
    return <div>CompanionForm</div>;
};

export default CompanionForm;
