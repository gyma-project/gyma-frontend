import PageTitle from "@/components/atoms/PageTitle";
import { getTransactions } from "@/service/api/transactions";
import { useEffect, useState } from "react";
import { transactionType } from "../history";

export default function Month() {

    const [transactions, setTransactions] = useState<transactionType[]>([]);

    useEffect(() => {
        getTransactions().then((data) => {
        setTransactions(data.content);
        console.log(data.content);
        });
    }, []);

    return (
        <div>
            <PageTitle>Resumo do mês atual</PageTitle>
            <p>Entradas:</p>
            <p>Saidas:</p>
            <p>Saldo Atual:</p>
        </div>
    )
}