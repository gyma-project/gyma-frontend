import Image from "next/image";

interface TransactionComponentProps {
  value: number;
  description: string;
}

export default function TransactionComponent({
  value,
  description,
}: TransactionComponentProps) {
  return (
    <div className="h-[119px] py-[30px] px-[20px] bg-red-50 flex gap-4 rounded-xl shadow-md">
      <div className="h-[60px] w-[60px] flex items-center justify-center bg-lime-500 rounded-xl">
        <Image src={"/icons/icon-transaction-increment.svg"} alt="money" width={30} height={30} />
      </div>
      <div>
        <p className="text-[22px] font-bold text-lime-500">R$ {value}</p>
        <p className="text-lime-500">{description}</p>
      </div>
    </div>
  );
}
