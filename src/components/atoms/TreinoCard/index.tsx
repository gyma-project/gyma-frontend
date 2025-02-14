import { useState } from "react";




const treinos = [
   {
       id: 1,
       titulo: "Treino de Costas",
       descricao: "Série de exercícios focados em fortalecer a musculatura das costas.",
   },
   {
       id: 2,
       titulo: "Treino de Pernas",
       descricao: "Exercícios para fortalecimento das pernas e glúteos.",
   },
   {
       id: 3,
       titulo: "Treino de Peito",
       descricao: "Rotina para desenvolver o peitoral com exercícios variados.",
   },
];


export default function Treinos() {
   const [search, setSearch] = useState("");


   // Filtro dos treinos com base na pesquisa
   const treinosFiltrados = treinos.filter((treino) =>
       treino.titulo.toLowerCase().includes(search.toLowerCase())
   );


   return (
       <div className="p-6 min-h-screen bg-gray-100">
           {/* Cabeçalho */}
           <h1 className="text-3xl font-bold text-gray-800 mb-4">Fichas de Treino</h1>


           {/* Barra de pesquisa */}
           <div className="mb-6">
               <input
                   type="text"
                   placeholder="🔍 Buscar Treino..."
                   className="w-full max-w-lg p-3 border border-red-400 rounded-full text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-300"
                   value={search}
                   onChange={(e) => setSearch(e.target.value)}
               />
           </div>


           {/* Lista de Treinos */}
           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
               {treinosFiltrados.map((treino) => (
                   <div key={treino.id} className="p-6 border border-gray-200 rounded-lg shadow-md bg-red-100 flex justify-between items-center">
                       {/* Ícone com inicial do treino */}
                       <div style={{
                           width: "40px", height: "40px", borderRadius: "50%", background: "#e74c3c",
                           color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                           fontWeight: "bold", marginRight: "10px"
                       }}>
                           {treino.titulo.charAt(0)}
                       </div>


                       {/* Informações do treino */}
                       <div className="flex-1">
                           <h2 className="text-xl font-semibold text-red-500">{treino.titulo}</h2>
                           <p className="text-sm text-gray-600">{treino.descricao}</p>
                       </div>


                       {/* Botões de ação */}
                       <div className="mt-4 flex flex-col space-y-10">
                           <img src="/icons/lapis.png" alt="Editar" style={{ width: 18, height: 18 }} />
                           <img src="/icons/lixeira.png" alt="Excluir" style={{ width: 18, height: 18 }} />
                       </div>
                      
                   </div>
               ))}
           </div>
       </div>
   );
}
