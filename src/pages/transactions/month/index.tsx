import PageTitle from "@/components/atoms/PageTitle";
import { getTransactions } from "@/service/api/transactions";
import { useEffect, useState } from "react";
import { transactionType } from "../history";

export default function Month() {
    const [transactions, setTransactions] = useState<transactionType[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<transactionType[]>([]);

    useEffect(() => {
        getTransactions().then((data) => {
            const currentMonth = new Date().getMonth();
            const currentYear = new Date().getFullYear();

            const filtered = data.content.filter((transaction: transactionType) => {
                const transactionDate = new Date(transaction.createdAt);
                return transactionDate.getMonth() === currentMonth && transactionDate.getFullYear() === currentYear;
            });

            setTransactions(filtered);
            setFilteredTransactions(filtered);
            console.log(filtered);
        });
    }, []);

    const entradas = filteredTransactions.filter((transaction) => transaction.price > 0).reduce((acc, curr) => acc + curr.price, 0);
    const saidas = filteredTransactions.filter((transaction) => transaction.price < 0).reduce((acc, curr) => acc + curr.price, 0);
    const saldo = entradas + saidas;

    return (
        <div>
            <PageTitle>Resumo do mês atual</PageTitle>
            <p>Entradas: R$ {entradas.toFixed(2)}</p>
            <p>Saídas: R$ {saidas.toFixed(2)}</p>
            <p>Saldo Atual: R$ {saldo.toFixed(2)}</p>
        </div>
    );
}
