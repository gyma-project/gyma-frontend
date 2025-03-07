import { MenuItemProps } from "@/components/atoms/MenuItem";

const NAVLIST_usuarios: MenuItemProps[] = [
  {
    label: "Cadastrar usuário",
    icon: "icons/icon-register-user.svg",
    onClickRedirectUrl: "/user/create",
  },
  {
    label: "Listagem de alunos",
    icon: "icons/icon-list-students.svg",
    onClickRedirectUrl: "/user/list-students",
  },
  {
    label: "Listagem de treinadores",
    icon: "icons/icon-lists-trainers.svg",
    onClickRedirectUrl: "/user/list-trainers",
  },
];

const NAVLIST_treinos: MenuItemProps[] = [
  {
    label: "Cadastrar treino",
    icon: "icons/icon-register-training.svg",
    onClickRedirectUrl: "/training/create",
  },
  {
    label: "Agendamento de alunos",
    icon: "icons/icon-scheduler-training.svg",
    onClickRedirectUrl: "/training/scheduler",
  },
  {
    label: "Listagem de treinos",
    icon: "icons/icon-list-training.svg",
    onClickRedirectUrl: "/training/list",
  },
];

const NAVLIST_financas: MenuItemProps[] = [
  {
    label: "Cadastrar Transação",
    icon: "icons/icon-register-transaction.svg",
    onClickRedirectUrl: "/transactions/create",
  },
  {
    label: "Resumo do mês atual",
    icon: "icons/icon-month-transactions.svg",
    onClickRedirectUrl: "/transactions/month",
  },
  {
    label: "Histórico das Transações",
    icon: "icons/icon-history-transactions.svg",
    onClickRedirectUrl: "/transactions/history",
  },
];

export { NAVLIST_usuarios, NAVLIST_treinos, NAVLIST_financas };
