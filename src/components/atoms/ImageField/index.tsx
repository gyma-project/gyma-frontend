import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";

interface ImageFieldProps {
  name?: string;
  accept?: string;
  onImageSelect?: (file: File | null) => void;
}

export default function ImageField({
  name,
  accept = "image/*",
  onImageSelect,
}: ImageFieldProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;
    
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setSelectedImage(imageUrl);
      onImageSelect?.(file);
    } else {
      setSelectedImage(null);
      onImageSelect?.(null);
    }
  };

  return (
    <div
      className="flex flex-col items-center justify-center w-full rounded-2xl bg-red-50 h-[133px] border border-red-500 cursor-pointer hover:scale-[1.02] hover:shadow-md transition-all"
      onClick={handleClick}
    >
      <div className="w-[70px] h-[70px] border border-red-500 rounded-full mb-[12px] flex items-center justify-center relative">
        {selectedImage ? (
          <Image
            src={selectedImage}
            alt="Imagem de perfil"
            fill
            className="rounded-full object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <Image src="/icons/icon-add-image.svg" alt="" width={26} height={23} />
        )}
      </div>
      <p className="font-[14px] text-zinc-600">Alterar imagem de perfil</p>

      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        onChange={handleImageChange}
        name={name}
      />
    </div>
  );
}