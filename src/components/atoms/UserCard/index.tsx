import Image from "next/image";

interface UserCardProps {
  userName: string
  userImage: string
}

export default function UserCard({userName, userImage}: UserCardProps) {
  return (
	<div className="h-[150px] rounded-2xl bg-gradient-to-r from-red-500 to-red-900 flex items-center p-5 gap-3 relative">
    <Image src={userImage} alt="" width={70} height={70} className="bg-red-950 w-[70px] h-[70px] rounded-full"  />
    <p className="text-[24px] text-white">{userName}</p>
    <Image src="images/bg_card-img.svg" alt="" width={378} height={230} className="absolute bottom-0 right-0"  />
	</div>
  );
}
