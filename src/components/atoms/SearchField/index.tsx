import Image from "next/image";
import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement>{
  width?: string;
}

export default function SearchField({ width, ...otherInputProps }: InputProps) {
  return (
    <div
      className={`flex items-center gap-2 w-full ${width && `w-[${width}]`} border border-red-500 rounded-3xl py-2 px-5`}
    >
      <Image src="/icons/icon-search.svg" alt="search" width={16} height={16} />
      <input
        className="w-full text-[12px] outline-none"
        placeholder="Buscar..."
        {...otherInputProps}
        type="text"
      />
    </div>
  );
}
