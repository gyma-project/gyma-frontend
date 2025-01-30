import MenuItem, { MenuItemProps } from "@/components/atoms/MenuItem";
import UserCard from "@/components/atoms/UserCard";
import MenuList from "@/components/molecules/MenuList";
import {
  NAVLIST_financas,
  NAVLIST_treinos,
  NAVLIST_usuarios,
} from "@/data/menus";
import { signIn, useSession } from "next-auth/react";

export default function Home() {
  const session = useSession();

  return (
    <div className="flex flex-col gap-5">
      <UserCard
        userName={
          session.data?.user ? (session.data.user?.name as string) : "Bem vindo ao GYMA!"
        }
        userImage={
          session.data?.user
            ? "https://avatar.iran.liara.run/username?username=" +
              session.data.user?.name
            : "vercel.svg"
        }
      />
      {session.status == "authenticated" ? (
        <>
          <MenuList title="Gerência de usuários" list={NAVLIST_usuarios} />
          <MenuList title="Gerência de treinos" list={NAVLIST_treinos} />
          <MenuList title="Gerência de Finanças" list={NAVLIST_financas} />
        </>
      ) : (
        <div className="bg-slate-100 w-full rounded-lg p3 flex flex-col h-full">
          <p>Para continuar você deve iniciar uma sessão</p>
          <button onClick={() => signIn("keycloak")} className="bg-red-500 text-white px-4 py-2 rounded-lg">Entrar</button>
        </div>
      )}
    </div>
  );
}
