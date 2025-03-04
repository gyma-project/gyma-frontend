import { useState } from "react";
import FiltrarPorNome from "../FiltrarPorNome";


export default function TreinoCard() {
    const [search, setSearch] = useState("");

    const treinosFiltrados = treinos.filter((treino) =>
        treino.titulo
            .normalize("NFD") // Normaliza o nome do aluno
            .replace(/[\u0300-\u036f]/g, "")
            .toLowerCase()
            .includes(search.toLowerCase())
    );

    return (
        <div className="p-6 min-h-screen">
            <div className="mb-6">
                <FiltrarPorNome search={search} setSearch={setSearch} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {treinosFiltrados.map((treino) => (
                    <div key={treino.id} className="p-4 border border-gray-200 rounded-lg shadow-md bg-red-100 flex justify-between items-center">
                        <div
                            style={{
                                width: "40px", height: "40px", borderRadius: "50%", background: "#e74c3c", color: "#fff", display: "flex",
                                alignItems: "center", justifyContent: "center", fontWeight: "bold", marginRight: "10px",
                            }}
                        >
                            {treino.titulo.charAt(0)}
                        </div>

                        <div className="flex-1 max-w-[240px]">
                            <h2 className="text-lg font-semibold text-red-500">{treino.titulo}</h2>
                            <p className="text-sm text-gray-600">{treino.descricao}</p>
                        </div>


                        <div className="mt-4 flex flex-col space-y-5">
                            <img src="/icons/olho.png" alt="Visualizar" className="w-5 h-5" />
                            <img src="/icons/lapis.png" alt="Editar" className="w-5 h-5" />
                            <img src="/icons/lixeira.png" alt="Excluir" className="w-5 h-5" />
                        </div>
                    </div>
                ))}
            </div>


        </div >
    );
}
