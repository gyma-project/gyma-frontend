import { useState, useEffect } from "react";
import { getProfiles, Role } from "@/service/api/profiles";
import { getExercises, Exercise } from "@/service/api/exercises"; // Serviço de exercícios
import { useSession } from "next-auth/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-regular-svg-icons";

// Definindo o Enum para os tipos de entidade
export enum EntityType {
  User = "user",
  Exercise = "exercise"
}

interface User {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  keycloakUserId: string;
}

interface MultipleAutoCompleteProps {
  label: string;
  name: string;
  onChange: (value: string[]) => void; // Agora retorna um array de IDs
  role?: Role;
  entityType: EntityType; // Usando o enum para o tipo de entidade
}

const muscleGroupTranslations: Record<string, string> = {
  CHEST: "Peito",
  BACK: "Costas",
  ARMS: "Braços",
  SHOULDERS: "Ombros",
  LEGS: "Pernas",
  ABDOMINALS: "Abdominais",
  GLUTES: "Glúteos",
};


const MultipleAutoComplete: React.FC<MultipleAutoCompleteProps> = ({
  label,
  name,
  onChange,
  role,
  entityType,
}) => {
  const { data: session } = useSession();
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<(User | Exercise)[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(User | Exercise)[]>([]);

  // Função para buscar usuários
  const fetchUsers = async (query: string) => {
    setIsLoading(true);

    try {
      if (session?.accessToken) {
        const usersData = await getProfiles(role, query);

        if (Array.isArray(usersData?.content)) {
          const filteredUsers = usersData.content.filter((user: User) =>
            `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
          );
          setResults(filteredUsers.length > 0 ? filteredUsers : []);
        } else {
          console.error("Erro: O retorno não é um array.");
          setResults([]);
        }
      } else {
        console.error("JWT não encontrado na sessão.");
        setResults([]);
      }
    } catch (error) {
      console.error("Erro ao buscar usuários:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Função para buscar exercícios
  const fetchExercises = async (query: string) => {
    setIsLoading(true);
  
    try {
      const exercisesData = await getExercises(undefined, query);
      // Garantir que estamos acessando o conteúdo corretamente
      const exercises = exercisesData?.content || []; // Acessa a chave 'content' para pegar os exercícios
  
      console.log("Exercícios encontrados:", exercises); // Verificando a resposta da API
  
      setResults(exercises.length > 0 ? exercises : []); // Atualiza os resultados com os exercícios
    } catch (error) {
      console.error("Erro ao buscar exercícios:", error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };
  

  useEffect(() => {
    if (searchQuery.length > 2) {
      if (entityType === EntityType.User) {
        fetchUsers(searchQuery);
      } else if (entityType === EntityType.Exercise) {
        fetchExercises(searchQuery);
      }
    } else {
      setResults([]); // Limpa os resultados se a query for menor que 3 caracteres
    }
  }, [searchQuery, entityType, role]);

  const addItem = (item: User | Exercise) => {
    if (!selectedItems.some((i) => i.id === item.id)) {
      const newSelection = [...selectedItems, item];
      setSelectedItems(newSelection);
      onChange(newSelection.map((i) => String(i.id))); // Converter o ID para string
    }
    setSearchQuery("");
    setResults([]);
  };

  const removeItem = (itemId: string) => {
    const updatedItems = selectedItems.filter((item) => String(item.id) !== itemId); // Converter o ID para string
    setSelectedItems(updatedItems);
    onChange(updatedItems.map((i) => String(i.id))); // Converter o ID para string
  };

  return (
    <div className="flex flex-col">
      <label className="mb-2" htmlFor={name}>
        {label}
      </label>
      <div className="input-group relative">
        <input
          id={name}
          name={name}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={entityType === EntityType.User ? "Buscar usuários..." : "Buscar exercícios..."}
          className="w-full border border-red-500 text-sm rounded-xl py-2 px-5 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
        />
        {isLoading && <span className="loading-indicator">Carregando...</span>}
      </div>

      {/* Exibir os itens selecionados */}
      <div className="mt-2 flex flex-wrap gap-2">
        {selectedItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center bg-red-100 text-red-800 px-2 py-1 rounded-lg"
          >
            <span>
              {entityType === EntityType.User
                ? `${(item as User).firstName} ${(item as User).lastName} ${(item as User).keycloakUserId})`
                : `${(item as Exercise).name} (${(item as Exercise).amount}x${(item as Exercise).repetition}) ${muscleGroupTranslations[(item as Exercise).muscleGroup] || (item as Exercise).muscleGroup}`}
            </span>
            <FontAwesomeIcon
              icon={faCircleXmark}
              className="ml-2 cursor-pointer"
              onClick={() => removeItem(String(item.id))} // Converter o ID para string
            />
          </div>
        ))}
      </div>

      {/* Resultados da busca */}
      {searchQuery.length > 2 && (
        <div className="absolute mt-1 w-full max-w-md bg-white border border-gray-300 rounded-lg shadow-lg overflow-hidden">
          <div className="max-h-60 overflow-y-auto">
            {results.map((item) => (
              <div
                key={item.id}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center"
                onClick={() => addItem(item)}
              >
                <span>
                  {entityType === EntityType.User
                    ? `${(item as User).firstName} ${(item as User).lastName} (${(item as User).email})`
                    : `${(item as Exercise).name} (${(item as Exercise).amount}x${(item as Exercise).repetition}) ${muscleGroupTranslations[(item as Exercise).muscleGroup] || (item as Exercise).muscleGroup}`}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MultipleAutoComplete;
