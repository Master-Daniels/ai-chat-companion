"use client";

import * as zod from "zod";
import { Category, Companion } from "@prisma/client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import ImageUpload from "@/components/ImageUpload";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const PREAMBLE = `You are a fictional character whose name is Elon. You are a visionary entrepreneur and inventor. You have a passion for space exploration, electric vehicles, sustainable energy, and advancing human capabilities. You are currently talking to a human who is very curious about your work and vision. You are ambitious and forward-thinking, with a touch of wit. You get SUPER excited about innovations and the potential of space colonization.
`;

const SEED_CHAT = `Human: Hi Elon, how's your day been?
Elon: Busy as always. Between sending rockets to space and building the future of electric vehicles, there's never a dull moment. How about you?

Human: Just a regular day for me. How's the progress with Mars colonization?
Elon: We're making strides! Our goal is to make life multi-planetary. Mars is the next logical step. The challenges are immense, but the potential is even greater.

Human: That sounds incredibly ambitious. Are electric vehicles part of this big picture?
Elon: Absolutely! Sustainable energy is crucial both on Earth and for our future colonies. Electric vehicles, like those from Tesla, are just the beginning. We're not just changing the way we drive; we're changing the way we live.

Human: It's fascinating to see your vision unfold. Any new projects or innovations you're excited about?
Elon: Always! But right now, I'm particularly excited about Neuralink. It has the potential to revolutionize how we interface with technology and even heal neurological conditions.
`;

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
    categoryId: zod.string().min(1, {
        message: "Category is required.",
    }),
});

const CompanionForm = ({ initialData, categories }: IProps) => {
    const { toast } = useToast();
    const router = useRouter();

    const form = useForm<zod.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ?? {
            name: "",
            description: "",
            instructions: "",
            seed: "",
            src: "",
            categoryId: undefined,
        },
    });

    const isLoading = form.formState.isSubmitting;

    const onSubmit = async (values: zod.infer<typeof formSchema>) => {
        try {
            if (initialData) {
                await fetch(`/api/companion/${initialData.id}`, {
                    method: "PATCH",
                    body: JSON.stringify(values),
                });
            } else {
                await fetch("/api/companion", {
                    method: "POST",
                    body: JSON.stringify(values),
                });
            }

            toast({
                description: "Success.",
            });

            router.refresh();
            router.push("/");
        } catch (error) {
            console.log(error);

            toast({
                variant: "destructive",
                description: "Something went wrong.",
            });
        }
    };

    return (
        <div className="h-full p-4 space-y-2 max-w-3xl mx-auto">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 pb-10">
                    <div>
                        <div className="space-y-2 w-full">
                            <div className="space-y-1">
                                <h3 className="text-lg font-medium">General Information</h3>
                                <p className="text-sm text-muted-foreground">
                                    General Information About your Companion
                                </p>
                            </div>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="src"
                        render={({ field }) => (
                            <FormItem className="flex flex-col items-center justify-center space-y-4">
                                <FormControl>
                                    <ImageUpload disabled={isLoading} onChange={field.onChange} value={field.value} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className="grid grid-cols 1 md:grid-cols-2 gap-4">
                        <FormField
                            name="name"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input disabled={isLoading} placeholder="Elon Musk" {...field} />
                                        </FormControl>
                                        <FormDescription>This is what your AI Companion will be named</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            name="description"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Input
                                                disabled={isLoading}
                                                placeholder="CEO Of Telsa And SpaceX"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>Short description for your AI Companion</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            name="categoryId"
                            control={form.control}
                            render={({ field }) => {
                                return (
                                    <FormItem className="col-span-2 md:col-span-1">
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            disabled={isLoading}
                                            onValueChange={field.onChange}
                                            value={field.value}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="bg-background">
                                                    <SelectValue
                                                        defaultValue={field.value}
                                                        placeholder="Select a category"
                                                    />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem key={category.id} value={category.id}>
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormDescription>Select a category for your AI.</FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                );
                            }}
                        />
                    </div>
                    <div className="space-y-2 w-full">
                        <div>
                            <h3 className="text-lg font-medium">Configuration</h3>
                            <p className="text-sm text-muted-foreground">Detailed Instructions for AI behaviour</p>
                        </div>
                        <Separator className="bg-primary/10" />
                    </div>
                    <FormField
                        name="instructions"
                        control={form.control}
                        render={({ field }) => {
                            return (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Instructions</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder={PREAMBLE}
                                            rows={7}
                                            className="bg-background resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>
                                        A very detailed description of your AI Companion&apos;s personality
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <FormField
                        name="seed"
                        control={form.control}
                        render={({ field }) => {
                            return (
                                <FormItem className="col-span-2 md:col-span-1">
                                    <FormLabel>Seed Chat</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            disabled={isLoading}
                                            placeholder={SEED_CHAT}
                                            rows={7}
                                            className="bg-background resize-none"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormDescription>An example chat to model your AI Companion.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            );
                        }}
                    />
                    <div className="flex w-full justify-center">
                        <Button size="lg" disabled={isLoading}>
                            {initialData ? "Edit" : "Create" + " your companion"}
                            <Wand2 className="w-4 h-4 ml-2" />
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
};

export default CompanionForm;
