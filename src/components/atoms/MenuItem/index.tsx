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
