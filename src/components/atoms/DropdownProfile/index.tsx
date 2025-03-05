import { Session } from "@auth/core/types";
import Image from "next/image";
import { useState, useEffect } from "react";

interface DropdownProfileProps {
  handleLogin: () => void;
  session: {
    data: Session;
  };
}

export default function DropdownProfile({
  handleLogin,
  session,
}: DropdownProfileProps) {
  const [isOpen, setOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>(
    `https://avatar.iran.liara.run/username?username=${session.data.user?.name}`
  );

  useEffect(() => {
    //@ts-ignore
    const minioImageUrl = `http://localhost:9000/images/${session.data.user?.uuid}.jpg`;
    fetch(minioImageUrl, { method: "HEAD" })
      .then((response) => response.ok && setProfileImage(minioImageUrl))
      .catch(() => {});
  }, [session.data.user?.id, session.data.user?.name]);

  return (
    <div className="absolute right-6 flex items-center">
      <p
        className="text-red-500 flex items-center gap-2 cursor-pointer"
        onClick={() => setOpen(!isOpen)}
      >
        <span>
          Olá, {session.data.user?.name ? session.data.user?.name.split(" ")[0] : "Usuário"}
        </span>
        <span className="text-2xl">👋</span>
      </p>
      {isOpen && (
        <>
          <div className="z-20 w-80 p-4 border border-red-500 shadow-lg rounded-lg absolute bg-white top-16 right-0">
            <div className="flex items-center gap-4">
              <div className="bg-red-400 rounded-full h-12 w-12 relative">
                <img
                  src={profileImage}
                  alt="Imagem de perfil"
                  className="rounded-full h-full w-full object-cover"
                />
              </div>
              <div>
                <p className="capitalize">{session.data.user?.name}</p>
                <p className="text-xs text-red-500 border border-red-500 px-2 py-[4px] w-max rounded-lg bg-red-100">
                  Treinador
                </p>
              </div>
            </div>
            <hr className="mt-5 mb-3 bg-red" />
            <div className="flex flex-col">
              <div className="py-3 px-1 flex items-center gap-2 cursor-pointer hover:bg-red-100 rounded-lg transition-all">
                <Image
                  src="/icons/icon-user.svg"
                  alt="Icone de usuário"
                  width={28}
                  height={28}
                />
                <p>Meu Perfil</p>
              </div>
              <div className="py-3 px-1 flex items-center gap-2 cursor-pointer hover:bg-red-100 rounded-lg transition-all">
                <Image
                  src="/icons/icon-help.svg"
                  alt="Icone de ajuda"
                  width={28}
                  height={28}
                />
                <p>Ajuda</p>
              </div>
              <button
                onClick={handleLogin}
                className="bg-red-500 text-white px-4 py-2 rounded-lg mt-3"
              >
                Encerrar Sessão
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}