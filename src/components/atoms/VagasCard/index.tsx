import { useState } from "react";
import FiltroHorario from "../FiltroHorario";
import List_scheduled_students from "@/pages/training/List_scheduled_students";

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
    const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);

    const vagasFiltradas = filtroHorario
        ? vagas.filter((vaga) => vaga.horario === filtroHorario)
        : vagas;

    const handleCardClick = (horario: string) => {
        setHorarioSelecionado(horario);
    };

    return (
        <div className="flex flex-col space-y-4">
            {!horarioSelecionado ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h2 className="text-1xl tracking-tight text-gray-900 mt-2">Para hoje:</h2>
                        </div>
                        <FiltroHorario
                            filtroHorario={filtroHorario}
                            setFiltroHorario={setFiltroHorario}
                            horariosDisponiveis={horariosDisponiveis}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {vagasFiltradas.map((vaga, index) => (
                            <VagasCard
                                key={index}
                                {...vaga}
                                onClick={() => handleCardClick(vaga.horario)}
                            />
                        ))}
                    </div>
                </>
            ) : (
                // Exibe a tela de detalhes
                <List_scheduled_students horario={horarioSelecionado}/>
            )}
        </div>
    );
}

interface VagasCardPropsWithAluno extends VagasCardProps {
    onClick: () => void; // Função para lidar com o clique
}

function VagasCard({horario,alunosAtuais,capacidadeTotal,onClick}: VagasCardPropsWithAluno) {
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
                    <img
                        src="/icons/olho.png"
                        alt="Visualizar"
                        style={{ width: 18, height: 18 }}
                        onClick={onClick}
                    />
                    <img src="/icons/lixeira.png" alt="Excluir" style={{ width: 18, height: 18 }} />
                </div>
            </div>
        </div>
    );
}
