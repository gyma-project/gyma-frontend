export default function UserListCard({ user }: any) {
  return (
    <div className="w-[49%] h-[175px] bg-red-50 rounded-xl shadow-md hover:bg-red-100 cursor-pointer flex items-center p-3">
      <div className="border-2 border-red-500/50 shadow-md rounded-full w-[75px] h-[75px] flex items-center justify-center overflow-hidden relative">
        <img
          className="w-full h-full object-cover z-10"
          src={`http://localhost:9000/images/${user.keycloakId}.jpg`}
        />
        <img
          className="w-full h-full object-cover absolute"
          src={`https://avatar.iran.liara.run/username?username=${encodeURIComponent(
            user?.name || "default"
          )}`}
        />
      </div>
      <div className="p-6">
        <p className="text-[22px] text-ellipsis overflow-hidden whitespace-nowrap capitalize text-red-500 w-[300px]">
          {user.firstName} {user.lastName}
        </p>
        <p className="text-red-500 text-ellipsis overflow-hidden whitespace-nowrap w-[300px]">
          <strong>Email: </strong>
          {user.email}
        </p>
      </div>
    </div>
  );
}
