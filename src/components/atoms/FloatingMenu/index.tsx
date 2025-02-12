import Image from "next/image";
import { useState } from "react";

export default function FloatingMenu() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        className="fixed left-[-8px] hover:left-0 transition-all top-[50%] bg-red-100 w-[40px] h-[100px] rounded-r-3xl flex items-center z-40 cursor-pointer max-md:hidden  active:shadow-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Image
          src="/icons/icon-arrow.svg"
          alt="arrow"
          width={12}
          height={12}
          className="ml-3"
        />
      </div>
    </>
  );
}
