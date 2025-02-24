import DropdownProfile from "@/components/atoms/DropdownProfile";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const session = useSession();

  return (
    <div className="h-[88px] w-full shadow-lg flex justify-center items-center">
      <h1 className="text-[26px] text-red-500 font-bold drop-shadow-lg">
        GYMA
      </h1>
      {session.status == "authenticated" ? (
        <DropdownProfile handleLogin={() => signOut()} session={session} />
      ) : (
        <button
          onClick={() => signIn("keycloak")}
          className="absolute right-6 bg-red-500 text-white px-4 py-2 rounded-lg ml-4"
        >
          Entrar
        </button>
      )}
    </div>
  );
}
