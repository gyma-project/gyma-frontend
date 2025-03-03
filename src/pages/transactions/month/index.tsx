import PageTitle from "@/components/atoms/PageTitle";
import { getTransactions } from "@/service/api/transactions";
import { useEffect, useState } from "react";
import { transactionType } from "../history";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

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
    });
  }, []);

  const calculateBalanceOverTime = () => {
    let balance = 0;
    const balances: number[] = [];  
    const dates: string[] = [];     
    
    filteredTransactions.forEach((transaction) => {
      balance += transaction.price;
      const transactionDate = new Date(transaction.createdAt);
      const formattedDate = transactionDate.toLocaleDateString();
      dates.push(formattedDate);
      balances.push(balance);
    });

    return { dates, balances };
  };

  const { dates, balances } = calculateBalanceOverTime();

  const chartData = {
    labels: dates,
    datasets: [
      {
        label: "Saldo Acumulado",
        data: balances,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.2)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
      },
    ],
  };

  const entradas = filteredTransactions.filter((transaction) => transaction.price > 0).reduce((acc, curr) => acc + curr.price, 0);
  const saidas = filteredTransactions.filter((transaction) => transaction.price < 0).reduce((acc, curr) => acc + curr.price, 0);
  const saldo = entradas + saidas;

  return (
    <div>
      <PageTitle>Resumo do mês atual</PageTitle>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
            <div className="h-[200px] bg-red-50 rounded-xl flex-1 p-4 border border-lime-500 hover:bg-red-100">
                <p className="text-[26px]">Entradas</p>
                <p>R$ {entradas.toFixed(2)}</p>
            </div>
            <div className="h-[200px] bg-red-50 rounded-xl flex-1 p-4 border border-lime-500 hover:bg-red-100">
                <p>Saídas: R$ {saidas.toFixed(2)}</p>
            </div>
        </div>
        <div className="h-[200px] bg-red-50 rounded-xl flex-1 p-4 border border-lime-500 hover:bg-red-100">
            <p>Saldo Atual: R$ {saldo.toFixed(2)}</p>
        </div>
      </div>
      <div className="my-6 w-full flex flex-col justify-center items-center">
        <Line data={chartData} options={{ responsive: true }} />
        <p className="text-[12px] text-slate-500 mb-8 mt-3">Gráfico de variação de saldo durante entradas e saídas.</p>
      </div>
    </div>
  );
}
