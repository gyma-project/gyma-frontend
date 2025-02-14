import { Dispatch, InputHTMLAttributes, SetStateAction } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  width?: string;
}

export default function Input({ label, width, ...otherInputProps }: InputProps) {
  return (
    <div>
      <p className="mb-2">{label}:</p>
      <input
        {...otherInputProps}
        className={`w-full ${
          width && `w-[${width}]`
        } border border-red-500 text-[12px] rounded-3xl py-2 px-5 outline-none`}
        type="text"
      />
    </div>
  );
}
