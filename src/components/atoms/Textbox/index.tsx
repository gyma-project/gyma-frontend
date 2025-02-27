import { TextareaHTMLAttributes } from "react";

interface TextboxProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
  width?: string;
  height?: string;
}

export default function Textbox({
  label,
  width,
  height,
  ...otherTextboxProps
}: TextboxProps) {
  return (
    <div>
      <p className="mb-2">{label}:</p>
      <textarea
        {...otherTextboxProps}
        className={`w-full ${width && `w-[${width}]`} ${height && `h-[${height}]`}  border border-red-500 text-[12px] rounded-xl py-2 px-5 resize-none outline-none`}
      />
    </div>
  );
}
