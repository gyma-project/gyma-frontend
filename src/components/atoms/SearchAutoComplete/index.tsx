import { useState, useEffect } from "react";
import { getProfiles, Role } from "@/service/api/profiles"; // Serviço de perfis
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';
import { getExercises, Exercise } from "@/service/api/exercises";



interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  keycloakUserId: string;
}

interface SearchAutoCompleteProps {
  label: string;
  name: string;
  onChange: (value: string) => void;
  role?: Role; // Role pode ser passado como parâmetro opcional
}

const SearchAutoComplete: React.FC<SearchAutoCompleteProps> = ({
  label,
  name,
  onChange,
  role,
}) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null); // Estado para o usuário selecionado

  // Função para buscar os usuários no backend
  const fetchUsers = async (query: string) => {
    setIsLoading(true);

    try {
      if (session?.accessToken) {
        // Agora passamos `query` como `username`
        const usersData = await getProfiles(role, query);
        console.log('usersData:', usersData);

        // Verifica se o resultado é um array
        if (Array.isArray(usersData?.content)) {
          const filteredUsers = usersData.content.map((user: any) => ({
            id: user.id.toString(),
            username: user.username,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            keycloakUserId: user.keycloakId,
          }));
  
          console.log("Usuários filtrados:", filteredUsers);
          setUsers(filteredUsers.length > 0 ? filteredUsers : []);
        }  else {
          console.error("Erro: O retorno não é um array.");
          setUsers([]);
        }
      } else {
        console.error("JWT não encontrado na sessão.");
        setUsers([]);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setUsers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Efeito para buscar os usuários conforme a query de pesquisa
  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchUsers(searchQuery);
    } else {
      setUsers([]); // Limpa a lista se a query for menor que 3 caracteres
    }
  }, [searchQuery, role]);

  // Função para limpar a seleção
  const clearSelection = () => {
    setSelectedUser(null);
    setSearchQuery(""); // Limpa o input
    setUsers([]); // Limpa os usuários
    onChange(""); // Informa o componente pai que não há mais seleção
  };

  return (
    <div className="flex flex-col">
      <label className="mb-4" htmlFor={name}>{label}</label>
      <div className="input-group relative">
        <input
          id={name}
          name={name}
          type="text"
          value={selectedUser ? `${selectedUser.firstName} ${selectedUser.lastName}` : searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar usuário..."
          className="w-full border border-red-500 text-sm rounded-xl py-2 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" // Estilo adaptado
        />
        {isLoading && <span className="loading-indicator">Carregando...</span>}

        {/* Exibe o "X" para limpar o campo */}
        {selectedUser && (
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={clearSelection}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </span>
        )}
      </div>

      {/* Exibe os resultados de busca abaixo do input */}
      {searchQuery.length > 2 && !selectedUser && (
        <div
          id="unit-complete-results"
          className="br-list absolute mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden"
        >
          <div className="max-h-60 overflow-y-auto">
            {users.map((user) => (
                <div
                key={user.id}
                className="br-item px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => {
                  setSelectedUser(user); // Define o usuário selecionado
                  onChange(user.keycloakUserId); // Passa o keycloakUserId para o componente pai
                }}
              >
                <div className="br-radio flex items-center gap-2">
                  <input
                    id={`user-${user.id}`}
                    type="radio"
                    name="user"
                    value={user.keycloakUserId} // Agora armazena o keycloakUserId
                    className="hidden"
                  />
                  <label htmlFor={`user-${user.id}`} className="cursor-pointer">
                    {user.firstName} {user.lastName} ({user.email})
                  </label>
                </div>
              </div>
            
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchAutoComplete;
