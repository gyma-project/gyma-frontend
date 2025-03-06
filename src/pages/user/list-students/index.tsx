import PageTitle from "@/components/atoms/PageTitle";
import UserListCard from "@/components/atoms/UserListCard";
import { getProfiles, Role } from "@/service/api/profiles";
import { useEffect, useState } from "react";


export default function ListStudents() {

  const [users, setUsers] = useState([])

  useEffect(() => {
    getProfiles().then((res) => {
    // getProfiles(Role.STUDENT).then((res) => {
      setUsers(res.content);
    });
  }, [])

  return (
    <div>
      <PageTitle>Listagem de Alunos</PageTitle>
      <div className="flex flex-wrap gap-4">
        {users.map((user: any) => (
          <UserListCard user={user} />
        ))}
      </div>
    </div>
  )
}
