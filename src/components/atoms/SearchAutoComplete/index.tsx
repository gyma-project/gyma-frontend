import { useState, useEffect } from "react";
import { getProfiles, Role } from "@/service/api/profiles";
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleXmark } from '@fortawesome/free-regular-svg-icons';



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
  role?: Role;
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
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const fetchUsers = async (query: string) => {
    setIsLoading(true);

    try {
      if (session?.accessToken) {
        const usersData = await getProfiles(role, query);
        console.log('usersData:', usersData);

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

  useEffect(() => {
    if (searchQuery.length > 2) {
      fetchUsers(searchQuery);
    } else {
      setUsers([]);
    }
  }, [searchQuery, role]);

  const clearSelection = () => {
    setSelectedUser(null);
    setSearchQuery(""); 
    setUsers([]); 
    onChange(""); 
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
          className="w-full border border-red-500 text-sm rounded-xl py-2 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" 
        />
        {isLoading && <span className="loading-indicator">Carregando...</span>}

        {selectedUser && (
          <span
            className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
            onClick={clearSelection}
          >
            <FontAwesomeIcon icon={faCircleXmark} />
          </span>
        )}
      </div>

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
                  setSelectedUser(user); 
                  onChange(user.keycloakUserId);
                }}
              >
                <div className="br-radio flex items-center gap-2">
                  <input
                    id={`user-${user.id}`}
                    type="radio"
                    name="user"
                    value={user.keycloakUserId} 
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
