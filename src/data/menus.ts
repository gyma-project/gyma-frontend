import { MenuItemProps } from "@/components/atoms/MenuItem"

const NAVLIST_usuarios: MenuItemProps[] = [
    {
      label:"Cadastrar usuário",
      icon:"icons/icon-register-user.svg",
      onClickRedirectUrl:"/user/create"
    },
    {
      label:"Listagem de alunos",
      icon:"icons/icon-list-students.svg",
      onClickRedirectUrl:"/user/list-students"
    },
    {
      label:"Listagem de treinadores",
      icon:"icons/icon-lists-trainers.svg",
      onClickRedirectUrl:"/user/list-trainers"
    },
]

export {NAVLIST_usuarios}