import { useState, useEffect } from "react";
import FiltroHorario from "../FiltroHorario";
import { TrainingTime } from "../../../service/api/appointments";
import List_scheduled_students from "@/pages/training/List_scheduled_students";

interface VagasCardProps {
    horario: string;
    alunosAtuais: number;
    capacidadeTotal: number;
}

export default function ListaVagas() {
    const [filtroHorario, setFiltroHorario] = useState<string>("");
    const [horarioSelecionado, setHorarioSelecionado] = useState<string | null>(null);
    const [vagas, setVagas] = useState<VagasCardProps[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchHorarios = async () => {
            try {
                const response = await fetch("/training-records");
                console.log("Response status:", response.status);
                
                if (!response.ok) {
                    throw new Error(`Erro ao carregar horários: ${response.statusText}`);
                }
        
                const data: TrainingTime[] = await response.json();
                console.log("Dados recebidos:", data);
        
                const vagasFormatadas = data.map((item) => ({
                    horario: `${item.startTime.hour}:${String(item.startTime.minute || 0).padStart(2, "0")}`,
                    //alunosAtuais: item.trainer?.students?.length || 0, 
                    capacidadeTotal: item.studentsLimit || 20,
                }));
        
                //setVagas(vagasFormatadas);
            } catch (err) {
                setError(`Falha ao buscar os horários: ${(err as Error).message}`);
            } finally {
                setLoading(false);
            }
        };
    
        fetchHorarios();
    }, []);
    

    const vagasFiltradas = filtroHorario
        ? vagas.filter((vaga) => vaga.horario === filtroHorario)
        : vagas;

    const handleCardClick = (horario: string) => {
        setHorarioSelecionado(horario);
    };

    if (loading) return <p>Carregando horários...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    return (
        <div className="flex flex-col space-y-4">
            {!horarioSelecionado ? (
                <>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <h2 className="text-1xl tracking-tight text-gray-900 mt-2">Para hoje:</h2>
                        <FiltroHorario
                            filtroHorario={filtroHorario}
                            setFiltroHorario={setFiltroHorario}
                            horariosDisponiveis={vagas.map((v) => v.horario)}
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
                <List_scheduled_students horario={horarioSelecionado} />
            )}
        </div>
    );
}

interface VagasCardWithClick extends VagasCardProps {
    onClick: () => void;
}

function VagasCard({ horario, alunosAtuais, capacidadeTotal, onClick }: VagasCardWithClick) {
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
                        className="cursor-pointer"
                        style={{ width: 18, height: 18 }}
                        onClick={onClick}
                    />
                    <img
                        src="/icons/lixeira.png"
                        alt="Excluir"
                        className="cursor-pointer"
                        style={{ width: 18, height: 18 }}
                    />
                </div>
            </div>
        </div>
    );
}
