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

  console.log(session);

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
            : "https://avatar.iran.liara.run/public"
        }
      />
      {session.status == "authenticated" ? (
        <>
          <MenuList title="Gerência de usuários" list={NAVLIST_usuarios} />
          <MenuList title="Gerência de treinos" list={NAVLIST_treinos} />
          <MenuList title="Gerência de Finanças" list={NAVLIST_financas} />
        </>
      ) : (
        <div className="bg-slate-50 w-full rounded-lg p-3 flex flex-col items-center gap-5 py-6" >
          <p className="mb-5 text-center">Para continuar você deve iniciar uma sessão</p>
          <button onClick={() => signIn("keycloak")} className="bg-red-500 text-white px-4 py-2 rounded-lg  w-full md:w-72">Fazer login</button>
        </div>
      )}
    </div>
  );
}
