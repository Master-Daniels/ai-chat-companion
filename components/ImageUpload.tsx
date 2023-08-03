"use client";
import { useEffect, useState } from "react";
import { CldUploadButton } from "next-cloudinary";
import Image from "next/image";

interface IProps {
    value: string;
    onChange(src: string): void;
    disabled?: boolean;
}

const ImageUpload = ({ value, onChange, disabled }: IProps) => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="space-y-4 w-full flex flex-col justify-center items-center">
            <CldUploadButton
                onUpload={(result: any) => onChange(result.info.secure_url)}
                options={{
                    maxFiles: 1,
                }}
                uploadPreset="printjyq"
            >
                <div className="p-4 border-4 border-dashed border-primary/10 rounded-lg opacity-75 hover:opacity-100 transition-all flex flex-col space-y-2 items-center justify-center">
                    <div className="relative h-44 w-44 ">
                        <Image
                            src={value || "/../public/img/placeholder-image.png"}
                            alt="Upload"
                            className="object-cover rounded-lg"
                            fill
                        />
                    </div>
                </div>
            </CldUploadButton>
        </div>
    );
};

export default ImageUpload;
