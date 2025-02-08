import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

export interface MenuItemProps {
    label: string;
    icon: string;
    onClickRedirectUrl: string;
}

export default function MenuItem({ label, icon, onClickRedirectUrl }: MenuItemProps) {
    const router = useRouter();
    return (
        <div className="relative w-[394px] h-[209px] border-none rounded-lg overflow-hidden shadow-lg">
        <img
            alt="Mulher na academia"
            className="object-cover w-full h-full opacity-70" // Aplica opacidade à imagem
            src="https://s3-alpha-sig.figma.com/img/5825/9a08/32a3618f1af3e375530f9ae7b0e7ae88?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Mhjbixya7Hcujpc4czKGsDGu5OXCGuWG8hSCfPO0BJuPavP3U3ctRRadBzTU5XEBlvxIWeTF5tPQd4THANdN3kVLRxVfCa3fg1Uia-83lI~HGwSWyWmhIBkzRWBERJFe4RbApe4B-VqJy0vPOLEen6vErwZjqfbi3nQQ4cZrusFWYfyxazU1xp~Yw-5cDRE-JpYAI33TEfaSN~gytHZSZfIsMhHmbr0qpmXD5niyZdOzx1FzB3ozkgjJnnjhCDESGe0lMixlt~17D6ImZS~nDIy~nkgw9plz8nlNUwv898uAA066mVfSnPUuy0efd2d2oU98UHXR9D5lRG5Y8dWzYQ__"
        />
        <div className="absolute bottom-1 left-1 right-1 flex justify-between items-center bg-gradient-to-r from-[#ef4444] via-[#ef4444] to-[#892727] bg-opacity-50 backdrop-blur border border-white/20 rounded-lg p-2 shadow-sm">
            <div
                className="flex flex-row gap-3 w-[394px] cursor-pointer hover:animate-pulse items-center"
                onClick={() => router.push(onClickRedirectUrl)}
            >
                <div className="w-[80px] h-[80px] bg-red-50 rounded-2xl drop-shadow-lg flex items-center justify-center">
                    <div className="relative w-[60px] h-[60px]">
                        <Image src={icon} alt="" layout="fill" />
                    </div>
                </div>
                <p className="text-center text-[15px] text-white">{label}</p>
            </div>
        </div>
    </div>
    
    );
}

