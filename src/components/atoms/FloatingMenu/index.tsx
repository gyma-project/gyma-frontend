import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";

export default function FloatingMenu() {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {!isOpen && (
        <div
          className="fixed left-[-8px] hover:left-0 transition-all top-[50%] translate-y-[-50%] bg-red-100 w-[40px] h-[100px] rounded-r-3xl flex items-center z-40 cursor-pointer max-md:hidden  active:shadow-md"
          onClick={() => setIsOpen(!isOpen)}
        >
          <Image
            src="/icons/icon-arrow.svg"
            alt="arrow"
            width={12}
            height={12}
            className="ml-3"
          />
        </div>
      )}
      <div
        className={`fixed ${
          isOpen ? "left-[8px]" : "left-[-100px]"
        } top-[50%] translate-y-[-50%] z-50 bg-red-100 w-[90px] h-[300px] rounded-2xl transition-all shadow-lg flex flex-col justify-evenly`}
      >
        <div onClick={() => router.push('/user/create')} className="w-full flex justify-center cursor-pointer hover:scale-105 transition-all">
            <Image src="/icons/icon-register-user.svg" alt="" width={60} height={60}/>
        </div>
        <div onClick={() => router.push('/transactions/create')} className="w-full flex justify-center cursor-pointer hover:scale-105 transition-all">
            <Image src="/icons/icon-register-transaction.svg" alt="" width={60} height={60}/>
        </div>
        <div onClick={() => router.push('/training/scheduler')} className="w-full flex justify-center cursor-pointer hover:scale-105 transition-all">
            <Image src="/icons/icon-scheduler-training.svg" alt="" width={60} height={60}/>
        </div>
        
      </div>
      {isOpen && (
        <div
          className="bg-black/30 fixed top-0 left-0 w-full h-full z-30"
          onClick={() => setIsOpen(!isOpen)}
        ></div>
      )}
    </>
  );
}
