import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import SearchField from "@/components/atoms/SearchField";
import UserListCard from "@/components/atoms/UserListCard";
import { getProfiles, Role } from "@/service/api/profiles";
import { useEffect, useState } from "react";

export default function ListStudents() {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProfiles(undefined, undefined, currentPage);
        setUsers(res.content);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalElements);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div>
      <PageTitle>Listagem de Alunos</PageTitle>
      <SearchField placeholder="Digite o nome do aluno..." />
      <div className="flex flex-wrap gap-4 mb-8 mt-4">
        {users.map((user: any) => (
          <UserListCard key={user.id} user={user} />
        ))}
      </div>

      <div className="flex justify-between items-center border-t pt-4">
        <div>
          Exibindo {(currentPage * pageSize) + 1} - {Math.min((currentPage + 1) * pageSize, totalItems)} de {totalItems} alunos
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={handlePreviousPage}
            disabled={currentPage === 0}
            className="px-4 py-2 bg-red-50 text-red-500 rounded-xl disabled:bg-gray-100"
          >
            Anterior
          </button>
          
          <span className="px-4 py-2">
            Página {currentPage + 1} de {totalPages}
          </span>
          
          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages - 1}
            className="px-4 py-2 bg-red-50 text-red-500 rounded-xl disabled:bg-gray-100"
          >
            Próximo
          </button>
        </div>
      </div>
    </div>
  );
}