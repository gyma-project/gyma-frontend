import PageTitle from "@/components/atoms/PageTitle";
import SearchField from "@/components/atoms/SearchField";
import TransactionComponent from "@/components/atoms/TransactionComponent";
import { getTransactions } from "@/service/api/transactions";
import { useEffect, useState } from "react";

interface transactionType {
	id: string;
	createdById: string;
	updateById: string;
	price: number;
	description: string;
	category: string;
}

export default function TransactionsHistory() {

	 const [transactions, setTransactions] = useState<transactionType[]>([]);

	 useEffect(() => {
		 getTransactions().then((data) => {
			 setTransactions(data.content);
		 });
	 }, []);

  return (
    <div>
      <PageTitle>Histórico de transações</PageTitle>
      <SearchField placeholder="Buscar transações" />
			{transactions && transactions.map((transaction) => (
				<TransactionComponent key={transaction.id} description={transaction.description} value={transaction.price} />
			))}

    </div>
  );
}