import Image from "next/image";

interface UserCardProps {
  userName: string;
  userImage: string;
}

export default function UserCard({ userName, userImage }: UserCardProps) {
  return (
    <div className="h-[150px] shadow-lg rounded-2xl bg-gradient-to-r from-red-500 to-red-900 flex items-center p-5 gap-3 relative md:h-[278px] md:flex-col md:justify-center">
      <div className="relative w-20 h-20 md:w-32 md:h-32 z-10 bg-red-950 rounded-full overflow-hidden">
        <Image src={userImage} alt="" layout="fill" />
      </div>
      <p className="text-[24px] text-white z-10">{userName}</p>
      <div className="absolute bottom-0 right-0 md:-left-36 w-[378px] h-[180px] md:w-[655px] md:h-[325px]">
        <Image src="images/bg_card-img.svg" alt="" layout="fill" />
      </div>
      <div className="hidden absolute bottom-0 right-36 w-[378px] h-[230px] md:w-[655px] md:h-[270px] md:right-16 md:block">
        <Image src="images/bg_card-img2.svg" alt="" layout="fill" />
      </div>
    </div>
  );
}
