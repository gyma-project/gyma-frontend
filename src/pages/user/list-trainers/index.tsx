import Input from "@/components/atoms/Input";
import PageTitle from "@/components/atoms/PageTitle";
import SearchField from "@/components/atoms/SearchField";
import UserListCard from "@/components/atoms/UserListCard";
import { getProfiles, Role } from "@/service/api/profiles";
import { useEffect, useState } from "react";

export default function ListStudents() {
  const [users, setUsers] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getProfiles(Role.TRAINER, searchQuery, currentPage);

        const res2 = await getProfiles(Role.ADMIN, searchQuery, currentPage);

        const result = res.content.concat(res2.content);

        setUsers(result);
        setTotalPages(res.totalPages);
        setTotalItems(res.totalElements);
      } catch (error) {
        console.error("Erro ao buscar alunos:", error);
      }
    };

    fetchData();
  }, [currentPage, pageSize, searchQuery]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
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
      <PageTitle>Listagem de Treinadores</PageTitle>
      <SearchField
        placeholder="Digite o nome do treinador..."
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          setCurrentPage(0);
        }}
      />
      <div className="flex flex-wrap gap-4 mb-8 mt-4">
        {users.length > 0 ? (
          users.map((user: any) => <UserListCard key={user.id} user={user} />)
        ) : (
          <div className="w-full text-center mt-10">Nenhum treinador encontrado.</div>
        )}
      </div>

      {users.length > 0 && (
        <div className="flex justify-between items-center border-t pt-4">
          <div>
            Exibindo {currentPage * pageSize + 1} -{" "}
            {Math.min((currentPage + 1) * pageSize, totalItems)} de {totalItems}{" "}
            treinadores
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
      )}
    </div>
  );
}
