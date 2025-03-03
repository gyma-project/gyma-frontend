import Image from "next/image";
import { useRouter } from "next/router";

export interface MenuItemProps {
  label: string;
  icon: string;
  onClickRedirectUrl: string;
}

export default function MenuItem({
  label,
  icon,
  onClickRedirectUrl,
}: MenuItemProps) {
  const router = useRouter();
  return (
    <div
      className="flex flex-col gap-3 w-[90px] cursor-pointer md:w-auto md:flex-1 md:bg-red-50 md:p-4 md:rounded-2xl md:drop-shadow-md md:hover:scale-105 transition-all md:h-[200px] md:items-center md:justify-center"
      onClick={() => router.push(onClickRedirectUrl)}
    >
      <div className="w-[90px] h-[90px] bg-red-50 rounded-2xl drop-shadow-lg flex items-center justify-center md:bg-white md:drop-shadow-md">
        <div className="relative w-[60px] h-[60px]">
          <Image src={icon} alt="" layout="fill" />
        </div>
      </div>
      <span className="text-center text-[12px] md:text-[16px]">{label}</span>
    </div>
  );
}
