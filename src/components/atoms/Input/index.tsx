import { InputHTMLAttributes } from "react";
import { FieldError } from "react-hook-form"; // Importando FieldError

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  width?: string;
  error?: string | FieldError;
}

export default function Input({
  label,
  width,
  error,
  ...otherInputProps
}: InputProps) {
  const getErrorMessage = (
    error: string | FieldError | undefined
  ): string | undefined => {
    if (typeof error === "string") {
      return error;
    }
    if (error && typeof error === "object" && "message" in error) {
      return error.message;
    }
    return undefined;
  };

  const errorMessage = getErrorMessage(error);

  return (
    <div>
      <p className="mb-2">{label}:</p>
      <input
        type="text"
        {...otherInputProps}
        className={`w-full ${
          width && `w-[${width}]`
        } border border-red-500 text-[12px] rounded-3xl py-2 px-5 outline-none`}
      />
      {errorMessage && (
        <span className="text-red-500 text-xs mt-1">{errorMessage}</span>
      )}
    </div>
  );
}
