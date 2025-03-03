import Image from "next/image";

interface TransactionComponentProps {
  value: number;
  description: string;
}

export default function TransactionComponent({
  value,
  description,
}: TransactionComponentProps) {

  const isDebit = value < 0;

  return (
    <div className="h-[119px] py-[30px] px-[20px] bg-red-50 hover:bg-red-100 transition-all flex gap-4 rounded-xl shadow-md">
      <div className={`h-[60px] w-[60px] flex items-center justify-center ${isDebit ? 'bg-red-500' : 'bg-lime-500'}  rounded-xl`}>
        <Image src={`/icons/icon-transaction-${isDebit ? "debit" : "increment"}.svg`} alt="money" width={30} height={30} />
      </div>
      <div>
        <p className={`text-[22px] font-bold ${isDebit ? 'text-red-500' : 'text-lime-500'}`}>R$ {isDebit ? value * -1 : value}</p>
        <p className={isDebit ? 'text-red-500' : 'text-lime-500'}><strong>{isDebit ? 'Despesa: ' : 'Receita: '}</strong>{description}</p>
      </div>
    </div>
  );
}
