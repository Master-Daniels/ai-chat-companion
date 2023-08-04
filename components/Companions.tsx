import { Companion } from "@prisma/client";
import Image from "next/image";
import { Card, CardFooter, CardHeader } from "./ui/card";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

interface IProps {
    data: (Companion & { _count: { messages: number } })[];
}

const Companions = ({ data }: IProps) => {
    if (!data.length) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center">
                <div className="relative w-60 h-60">
                    <Image fill alt="empty" src="/img/empty.png" />
                </div>
                <p className="text-sm text-muted-foreground">No companions found.</p>
            </div>
        );
    }
    return (
        <div className="grid drid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 pb-10">
            {data.map((item) => (
                <Card
                    key={item.id}
                    className="bg-primary/10 rounded-xl cursor-pointer opacity-75 hover:opacity-100 transition-all border-0 duration-1000"
                >
                    <Link href={`/chat/${item.id}`}>
                        <CardHeader className="flex items-center justify-center text-center text-muted-foreground">
                            <div className="relative w-32 h-32">
                                <Image src={item.src} alt="companion" fill className="rounded-xl object-cover" />
                                <p className="font-bold">{item.name}</p>
                                <p className="font-xs">{item.description}</p>
                            </div>
                        </CardHeader>
                        <CardFooter className="flex items-between justify-between text-xs text-muted-foreground">
                            <p className="lowercase">@{item.userName}</p>
                            <div className="flex items-center">
                                <MessageSquare className="h-3 w-3 mr-1">{item._count.messages}</MessageSquare>
                            </div>
                        </CardFooter>
                    </Link>
                </Card>
            ))}
        </div>
    );
};

export default Companions;
