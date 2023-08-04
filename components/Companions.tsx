import { Companion } from "@prisma/client";
import Image from "next/image";

interface IProps {
    data: (Companion & { _count: { messages: number } })[];
}

const Companions = ({ data }: IProps) => {
    if (!data.length) {
        return (
            <div className="pt-10 flex flex-col items-center justify-center">
                <div className="relative w-60 h-60">
                    <Image fill className="grayscale" alt="empty" src="/empty.png" />
                </div>
            </div>
        );
    }
    return <div>Companions</div>;
};

export default Companions;
