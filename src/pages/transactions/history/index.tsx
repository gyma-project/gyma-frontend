import PageTitle from "@/components/atoms/PageTitle";
import SearchField from "@/components/atoms/SearchField";
import TransactionComponent, { categoriesConversion } from "@/components/atoms/TransactionComponent";
import { getTransactions } from "@/service/api/transactions";
import { useEffect, useState } from "react";

interface transactionType {
  id: string;
  createdById: string;
  updateById: string;
  price: number;
  description: string;
  category: string;
  createdAt: string;
}

export default function TransactionsHistory() {
  const [transactions, setTransactions] = useState<transactionType[]>([]);

  useEffect(() => {
    getTransactions().then((data) => {
      setTransactions(data.content);
      console.log(data.content);
    });
  }, []);

  return (
    <div>
      <PageTitle>Histórico de transações</PageTitle>
      <SearchField placeholder="Buscar transações" />
      <div className="flex flex-col gap-5 my-3">
        {transactions &&
          transactions.map((transaction) => (
            <TransactionComponent
              key={transaction.id}
              description={transaction.description}
              value={transaction.price}
							category={transaction.category as keyof typeof categoriesConversion}
              createdAt={transaction.createdAt}
            />
          ))}
      </div>
    </div>
  );
}
