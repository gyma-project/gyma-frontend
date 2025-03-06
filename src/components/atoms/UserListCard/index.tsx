import Image from "next/image"

export default function UserListCard({user}: any) {
  return(
    <div className="w-[350px] h-[175px] bg-red-50 rounded-xl shadow-md hover:bg-red-100 cursor-pointer flex items-center p-3">
      <div className="border rounded-full border-red-500/50">
        <img src={`http://localhost:9000/images/${user.keycloakId}.jpg`} alt={user.firstName} width={100} height={100} />
      </div>
      <div className="p-6">
        <p className="text-[22px] text-ellipsis overflow-hidden whitespace-nowrap capitalize text-red-500 w-[200px]">{user.firstName} {user.lastName}</p>
        <p className="text-red-500 text-ellipsis overflow-hidden whitespace-nowrap w-[200px]"><strong>Email: </strong>{user.email}</p>
      </div>
    </div>
  )
}