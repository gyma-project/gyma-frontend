import PageTitle from "@/components/atoms/PageTitle";
import SearchField from "@/components/atoms/SearchField";

export default function TransactionsHistory() {
  return (
    <div>
      <PageTitle>Histórico de transações</PageTitle>
      <SearchField placeholder="Buscar transações" />

    </div>
  );
}