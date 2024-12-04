import MenuItem, { MenuItemProps } from "@/components/atoms/MenuItem";
import UserCard from "@/components/atoms/UserCard";
import MenuList from "@/components/molecules/MenuList";
import { NAVLIST_financas, NAVLIST_treinos, NAVLIST_usuarios } from "@/data/menus";


export default function Home() {
  return (
    <div className="flex flex-col gap-5">
      <UserCard userName="Usuário" userImage="vercel.svg"/>
      <MenuList title="Gerência de usuários" list={NAVLIST_usuarios}/>
      <MenuList title="Gerência de treinos" list={NAVLIST_treinos}/>
      <MenuList title="Gerência de Finanças" list={NAVLIST_financas}/>
    </div>
  );
}
