import { useState, useEffect } from "react";
import Image from "next/image";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    isVisible && (
      <div
        className="w-[60px] h-[60px] rounded-full fixed bottom-4 right-4 bg-red-500 cursor-pointer flex items-center justify-center drop-shadow-xl"
        onClick={scrollToTop}
      >
        <Image
          src="/icons/icon-backtotop-arrow.svg"
          alt="Voltar ao topo"
          width={32}
          height={32}
        />
      </div>
    )
  );
}
