import { ReactNode, ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export default function Button({ children, ...otherButtonProps }: ButtonProps) {
  return (
    <button
      className="bg-red-500 text-white px-4 py-2 rounded-full w-full md:w-72 hover:scale-[1.02] hover:shadow-lg active:scale-110 transition-all"
      {...otherButtonProps}
    >
      {children}
    </button>
  );
}
