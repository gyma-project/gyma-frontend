import DropdownProfile from "@/components/atoms/DropdownProfile";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Cookies from 'js-cookie';

export default function Header() {
  const session = useSession();
  const router = useRouter();


  const deleteAllCookies = () => {
    const allCookies = Cookies.get();
  
    for (let cookie in allCookies) {
      Cookies.remove(cookie, { path: '/realms/gyma/', domain: window.location.hostname });
      Cookies.remove(cookie, { path: '/', domain: window.location.hostname });
    }
  };

  const logout = () => {
    signOut();
    deleteAllCookies();
    
    router.push("/");
  }

  return (
    <div className="h-[88px] w-full shadow-lg flex justify-center items-center">
      <h1 className="text-[26px] text-red-500 font-bold drop-shadow-lg cursor-pointer" onClick={() => router.push("/")}>
        GYMA
      </h1>
      {session.status == "authenticated" ? (
        <DropdownProfile handleLogin={() => logout()} session={session} />
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
