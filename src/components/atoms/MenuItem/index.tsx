import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export interface MenuItemProps {
  label: string;
  icon: string;
  onClickRedirectUrl: string;
}

export default function MenuItem({ label, icon, onClickRedirectUrl }: MenuItemProps) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Função para atualizar o estado com base no tamanho da tela
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    // Verifica o tamanho inicial da tela
    handleResize();

    // Adiciona um event listener para atualizar o estado ao redimensionar a janela
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (isMobile) {
    // Versão MOBILE
    return (
      <div
        className="flex flex-col gap-3 w-[90px] cursor-pointer hover:animate-pulse"
        onClick={() => router.push(onClickRedirectUrl)}
      >
        <div className="w-[90px] h-[90px] bg-red-50 rounded-2xl drop-shadow-lg flex items-center justify-center">
          <div className="relative w-[60px] h-[60px]">
            <Image src={icon} alt="" layout="fill" />
          </div>
        </div>
        <span className="text-center text-[12px]">{label}</span>
      </div>
    );
  }

  // Versão DESKTOP
  return (
    <div className="relative w-full max-w-[394px] h-auto border-none rounded-lg overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
      <img
        alt="Mulher na academia"
        className="object-cover w-full h-full opacity-85"
        src="https://s3-alpha-sig.figma.com/img/5825/9a08/32a3618f1af3e375530f9ae7b0e7ae88?Expires=1739750400&Key-Pair-Id=APKAQ4GOSFWCW27IBOMQ&Signature=Mhjbixya7Hcujpc4czKGsDGu5OXCGuWG8hSCfPO0BJuPavP3U3ctRRadBzTU5XEBlvxIWeTF5tPQd4THANdN3kVLRxVfCa3fg1Uia-83lI~HGwSWyWmhIBkzRWBERJFe4RbApe4B-VqJy0vPOLEen6vErwZjqfbi3nQQ4cZrusFWYfyxazU1xp~Yw-5cDRE-JpYAI33TEfaSN~gytHZSZfIsMhHmbr0qpmXD5niyZdOzx1FzB3ozkgjJnnjhCDESGe0lMixlt~17D6ImZS~nDIy~nkgw9plz8nlNUwv898uAA066mVfSnPUuy0efd2d2oU98UHXR9D5lRG5Y8dWzYQ__"
      />
      <div className="absolute bottom-0 left-0 right-0 w-full flex flex-col md:flex-row justify-between items-center bg-gradient-to-r from-[#ef4444] via-[#ef4444] to-[#892727] bg-opacity-50 backdrop-blur md:p-4 shadow-sm animate-fadeInUp">
        <div
          className="flex flex-row gap-3 w-full cursor-pointer hover:animate-pulse items-center active:scale-95 transition-transform"
          onClick={() => router.push(onClickRedirectUrl)}
        >
          <div className="w-[60px] md:w-[80px] h-[60px] md:h-[80px] bg-red-50 rounded-2xl drop-shadow-lg flex items-center justify-center hover:brightness-125 transition-all">
            <div className="relative w-[40px] md:w-[60px] h-[40px] md:h-[60px]">
              <Image src={icon} alt="" layout="fill" />
            </div>
          </div>
          <p className="text-center text-sm md:text-[15px] text-white break-words">{label}</p>
        </div>
      </div>
    </div>
  );
}
