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
  const [filteredTransactions, setFilteredTransactions] = useState<
    transactionType[]
  >([]);

  useEffect(() => {
    getTransactions().then((data) => {
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();

      const filtered = data.content.filter((transaction: transactionType) => {
        const transactionDate = new Date(transaction.createdAt);
        return (
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear
        );
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

  const entradas = filteredTransactions
    .filter((transaction) => transaction.price > 0)
    .reduce((acc, curr) => acc + curr.price, 0);
  const saidas = filteredTransactions
    .filter((transaction) => transaction.price < 0)
    .reduce((acc, curr) => acc + curr.price, 0);
  const saldo = entradas + saidas;

  return (
    <div>
      <PageTitle>Resumo do mês atual</PageTitle>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div className="h-[200px] bg-red-50 rounded-xl flex-1 p-6 hover:bg-red-100 transition-all duration-300 shadow-md">
            <p className="text-[28px] font-semibold text-lime-500">Entradas</p>
            <p className="text-[20px] font-medium text-lime-500 mt-2">
              R$ {entradas.toFixed(2)}
            </p>
            <p className="mt-[40px] text-[14px] text-slate-500">
              Valores que entraram durante esse mês.
            </p>
          </div>

          <div className="h-[200px] bg-red-50 rounded-xl flex-1 p-6  hover:bg-red-100 transition-all duration-300 shadow-md">
            <p className="text-[28px] font-semibold text-red-500">Despesas</p>
            <p className="text-[20px] font-medium text-red-500 mt-2">
              R$ {saidas.toFixed(2)}
            </p>
            <p className="mt-[40px] text-[14px] text-slate-500">
              Valores que sairam durante esse mês.
            </p>
          </div>
        </div>

        <div className="h-[200px] bg-red-50 rounded-xl flex-1 p-6  hover:bg-red-100 transition-all duration-300 shadow-md">
          <p className="text-[28px] font-semibold text-slate-700">Saldo Atual</p>
          <p className="text-[20px] font-medium mt-2 text-slate-700">
            R$ {saldo.toFixed(2)}
          </p>
          <p className="mt-[40px] text-[14px] text-slate-500">
            Diferença entre entradas e saídas desse mês no dia atual.
          </p>
        </div>
      </div>
      <div className="my-6 w-full flex flex-col justify-center items-center">
        <Line data={chartData} options={{ responsive: true }} />
        <p className="text-[12px] text-slate-500 mb-8 mt-3">
          Gráfico de variação de saldo durante entradas e saídas.
        </p>
      </div>
    </div>
  );
}
