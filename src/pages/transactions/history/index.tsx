import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import TransactionComponent, { categoriesConversion } from "@/components/atoms/TransactionComponent";
import { getTransactions } from "@/service/api/transactions";
import { useEffect, useState } from "react";

export interface transactionType {
  id: string;
  createdById: string;
  updateById: string;
  price: number;
  description: string;
  category: string;
  createdAt: string; // A data estará nesse formato: "YYYY-MM-DD"
}

export default function TransactionsHistory() {
  const [transactions, setTransactions] = useState<transactionType[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<transactionType[]>([]);

  const [selectedDate, setSelectedDate] = useState<string>("");

  useEffect(() => {
    getTransactions().then((data) => {
      setTransactions(data.content);
      setFilteredTransactions(data.content);
      console.log(data.content);
    });
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = e.target.value;
    setSelectedDate(date);

    if (date) {
      const filtered = transactions.filter((transaction) =>
        transaction.createdAt === date 
      );
      setFilteredTransactions(filtered);
    } else {
      setFilteredTransactions(transactions);
    }
  };

  return (
    <div>
      <PageTitle>Histórico de transações</PageTitle>
      <Input label="Buscar por data" type="date" value={selectedDate} onChange={handleDateChange} />
      <div className="flex flex-col gap-5 my-3">
        {filteredTransactions &&
          filteredTransactions.map((transaction) => (
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
