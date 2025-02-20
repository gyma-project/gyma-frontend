import { SelectHTMLAttributes } from "react";

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  width?: string;
}

export default function Select({
  label,
  width,
  children,
  ...otherSelectProps
}: SelectProps) {
  return (
    <div>
      <p className="mb-2">{label}:</p>
      <select
        {...otherSelectProps}
        className={`w-full ${
          width && `w-[${width}]`
        } border border-red-500 text-[12px] rounded-3xl py-2 px-5 outline-none bg-white cursor-pointer`}
      >
        {children}
      </select>
    </div>
  );
}
