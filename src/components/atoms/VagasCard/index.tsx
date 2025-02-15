import { useState } from "react";
import FiltroHorario from "../FiltroHorario";

interface VagasCardProps {
    horario: string;
    alunosAtuais: number;
    capacidadeTotal: number;
}

const horariosDisponiveis = ["08:00", "10:00", "14:00"];

const vagas: VagasCardProps[] = [
    { horario: "08:00", alunosAtuais: 5, capacidadeTotal: 10 },
    { horario: "10:00", alunosAtuais: 7, capacidadeTotal: 10 },
    { horario: "14:00", alunosAtuais: 3, capacidadeTotal: 8 },
];

export default function ListaVagas() {
    const [filtroHorario, setFiltroHorario] = useState<string>("");

    // Simulação de controle de acesso
    const usuarioEhAdministrador = true;
    const usuarioEhAluno = false;

    const vagasFiltradas = filtroHorario
        ? vagas.filter((vaga) => vaga.horario === filtroHorario)
        : vagas;

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-1xl tracking-tight text-gray-900 mt-2">Para hoje:</h2>

                    {usuarioEhAdministrador && (
                        <button className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition w-full md:w-auto mt-2">
                            Editar Horário
                        </button>
                    )}
                </div>
                <FiltroHorario
                    filtroHorario={filtroHorario}
                    setFiltroHorario={setFiltroHorario}
                    horariosDisponiveis={horariosDisponiveis}
                />
            </div>

            {/* Grid de Cards Responsivo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vagasFiltradas.map((vaga, index) => (
                    <VagasCard key={index} {...vaga} usuarioEhAluno={usuarioEhAluno} />
                ))}
            </div>
        </div>
    );
}

interface VagasCardPropsWithAluno extends VagasCardProps {
    usuarioEhAluno: boolean;
}

function VagasCard({ horario, alunosAtuais, capacidadeTotal, usuarioEhAluno }: VagasCardPropsWithAluno) {
    return (
        <div className="bg-red-50 rounded-xl shadow-md w-full border-red-400 p-3">
            <div className="flex justify-between p-4 w-full">
                <div>
                    <h2 className="text-lg font-semibold text-red-500">{horario}</h2>
                    <p className="text-sm mt-1">
                        Quantidade de Alunos:{" "}
                        <span className="text-black">
                            {alunosAtuais}/{capacidadeTotal}
                        </span>
                    </p>
                </div>

                <div className="flex flex-col items-center space-y-3 text-red-500">
                    <img src="/icons/olho.png" alt="Visualizar" style={{ width: 18, height: 18 }} />
                    <img src="/icons/lixeira.png" alt="Excluir" style={{ width: 18, height: 18 }} />
                </div>
            </div>

            {usuarioEhAluno && (
                <button className="bg-red-500 text-white py-2 mt-2 hover:bg-red-600 rounded-xl transition w-full">
                    Agendar
                </button>
            )}
        </div>
    );
}
