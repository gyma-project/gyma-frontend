import { useState, useEffect } from "react";
import FiltroHorario from "../FiltroHorario";
import { 
    getTrainingTimesByDay, 
    getTrainingRecordsByTime, 
    updateTrainingTime, 
    toggleTrainingTimeActive, 
    createTrainingRecord 
} from "@/service/api/training";
import SearchAutoComplete from "../SearchAutoComplete";
import { Role } from "@/service/api/profiles";
import { useSession } from "next-auth/react";

interface VagasCardProps {
    horario: string;
    capacidadeTotal: number;
    id: string;
    active: boolean;
    trainerId: string;
    studentsLimit: number;
    vagasRestantes: number;
}

export default function ListaVagas() {
    const [filtroHorario, setFiltroHorario] = useState<string>("");
    const [vagas, setVagas] = useState<VagasCardProps[]>([]);
    const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedHorario, setSelectedHorario] = useState<VagasCardProps | null>(null);
    const { data: session } = useSession();

    const roles = session?.user?.profile?.roles.map((role) => role.name) || [];
    const usuarioEhAdministrador = roles.includes("ADMIN");
    const usuarioEhTrainer = roles.includes("TRAINER");
    const usuarioEhAluno = roles.includes("STUDENT");


    useEffect(() => {
        const fetchVagas = async () => {
            try {
                const today = new Date();
                const dayName = today.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
    
                const response = await getTrainingTimesByDay(dayName);
    
                if (!response || !Array.isArray(response.content)) {
                    console.error("Resposta inesperada da API:", response);
                    return;
                }

                console.log("ui")
                console.log(response)
                console.log("ui")

    
                const formattedVagas = await Promise.all(response.content.map(async (record: any) => {
                    const startTime = record.startTime.substring(0, 5); // Pega a parte do horário
                    const endTime = record.endTime.substring(0, 5);
    
                    const todayFormatted = today.toISOString().split("T")[0];
                    const trainingRecords = await getTrainingRecordsByTime(record.id, todayFormatted, todayFormatted);
    
                    const quantidadeAgendamentos = trainingRecords.content.length;
                    const vagasRestantes = record.studentsLimit - quantidadeAgendamentos;
    
                    return {
                        horario: `${startTime} às ${endTime}`,
                        capacidadeTotal: record.studentsLimit,
                        vagasRestantes,
                        id: record.id,
                        active: record.active,
                        trainerId: record.trainer.keycloakId,
                        studentsLimit: record.studentsLimit,
                        startTime, // Adiciona o startTime para facilitar a ordenação
                    };
                }));
    
                // Ordena as vagas pela hora de início (startTime)
                const sortedVagas = formattedVagas.sort((a, b) => {
                    if (a.startTime < b.startTime) return -1;
                    if (a.startTime > b.startTime) return 1;
                    return 0;
                });
    
                setVagas(sortedVagas); // Atualiza o estado com a lista ordenada
                setHorariosDisponiveis(sortedVagas.map((vaga) => vaga.horario));
            } catch (error) {
                console.error("Erro ao buscar horários disponíveis:", error);
            }
        };
    
        fetchVagas();
    }, []);
    

    const vagasFiltradas = filtroHorario
        ? vagas.filter((vaga) => vaga.horario === filtroHorario)
        : vagas;

    const openModal = (vaga: VagasCardProps) => {
        setSelectedHorario(vaga);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedHorario(null);
    };

    const handleUpdate = async () => {
        if (selectedHorario) {
            const { trainerId, studentsLimit, id } = selectedHorario;

            if (!trainerId || studentsLimit <= 0) {
                console.error("Dados inválidos para atualização");
                return;
            }

            try {
                // Chama o serviço de atualização
                const updatedHorario = {
                    ...selectedHorario,
                    trainerId,
                    studentsLimit,
                };
                await updateTrainingTime(id, updatedHorario);
                // Atualiza a lista de vagas
                setVagas((prevVagas) => prevVagas.map((vaga) => vaga.id === id ? updatedHorario : vaga));
                closeModal(); // Fechar o modal após a atualização
            } catch (error) {
                console.error("Erro ao atualizar o horário:", error);
            }
        }
    };

    const handleAgendar = async (vaga: VagasCardProps) => {
        if (!session || !session.user) {
            console.error("Usuário não autenticado");
            return;
        }
    
        const studentKeycloakId = session.user.uuid; // Ou use o ID correto do aluno no contexto de sessão
        const { trainerId, id: trainingTimeId } = vaga;  // trainerId agora é o keycloakId do treinador
        const updateBy = studentKeycloakId; // Ou pode ser um valor diferente, dependendo de como você deseja rastrear quem está agendando
    
        console.log(studentKeycloakId);
        console.log(trainerId);
        console.log(updateBy);


        const trainingRecordData = {
            trainingTimeId,         // ID do horário de treino
            student: studentKeycloakId,  // ID do aluno
            trainer: trainerId,     // keycloakId do treinador
        };
    
        try {
            const response = await createTrainingRecord(trainingRecordData);
            console.log("Agendamento criado com sucesso:", response);
    
            // Atualize as vagas restantes
            setVagas((prevVagas) => prevVagas.map((vaga) => {
                if (vaga.id === trainingTimeId) {
                    return { ...vaga, vagasRestantes: vaga.vagasRestantes - 1 };
                }
                return vaga;
            }));
        } catch (error) {
            console.error("Erro ao agendar o treino:", error);
        }
    };
    
      

    return (
        <div className="flex flex-col space-y-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 className="text-1xl tracking-tight text-gray-900 mt-2">Horários Disponíveis:</h2>

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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {vagasFiltradas.map((vaga, index) => (
                    <VagasCard 
                        key={index} 
                        {...vaga} 
                        usuarioEhAluno={usuarioEhAluno} 
                        usuarioEhAdministrador={usuarioEhAdministrador} 
                        usuarioEhTrainer={usuarioEhTrainer} 
                        openModal={openModal} 
                        setVagas={setVagas} 
                        handleAgendar={handleAgendar} // Aqui está passando handleAgendar
                    />
                ))}
            </div>

           {/* Modal */}
            {modalVisible && selectedHorario && (
            <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
                <div className="bg-white p-6 rounded-lg w-96">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Editar Horário</h3>

                {/* Substituindo o campo de texto do trainerId por SearchAutoComplete */}
                <div className="mb-4">
                    <SearchAutoComplete
                    label="Selecione o Treinador"
                    name="trainerId"
                    onChange={(trainerId) => setSelectedHorario({ ...selectedHorario, trainerId })}
                    role={Role.TRAINER}
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm text-gray-700">Limite de Estudantes</label>
                    <input
                    type="number"
                    className="w-full p-2 border border-gray-300 rounded-md"
                    value={selectedHorario.studentsLimit}
                    onChange={(e) => setSelectedHorario({ ...selectedHorario, studentsLimit: +e.target.value })}
                    />
                </div>

                <div className="flex justify-between">
                    <button
                    onClick={closeModal}
                    className="bg-gray-300 text-black py-2 px-4 rounded-md"
                    >
                    Cancelar
                    </button>
                    <button
                    onClick={handleUpdate}
                    className="bg-red-500 text-white py-2 px-4 rounded-md"
                    >
                    Atualizar
                    </button>
                </div>
                </div>
            </div>
            )}

        </div>
    );
}

interface VagasCardPropsWithAluno extends VagasCardProps {
    usuarioEhAluno: boolean;
    usuarioEhAdministrador: boolean;
    usuarioEhTrainer: boolean;
    openModal: (vaga: VagasCardProps) => void;
    setVagas: React.Dispatch<React.SetStateAction<VagasCardProps[]>>;
    handleAgendar: (vaga: VagasCardProps) => void; // Certifique-se de que a função está aqui
}

function VagasCard({
    horario,
    capacidadeTotal,
    vagasRestantes,
    usuarioEhAluno,
    openModal,
    id,
    active,
    trainerId,
    studentsLimit,
    setVagas,
    usuarioEhAdministrador,
    usuarioEhTrainer,
    handleAgendar
}: VagasCardPropsWithAluno) {
    return (
        <div
            className={`bg-${active ? 'red-50' : 'gray-200'} rounded-xl shadow-lg w-full border-${active ? 'red-400' : 'gray-400'} p-3`}
        >
            <div className="flex justify-between p-4 w-full">
                <div>
                    <h2 className={`text-lg font-semibold ${active ? 'text-red-500' : 'text-gray-500'}`}>{horario}</h2>
                    {vagasRestantes === 0 ? (
                        <button className="bg-red-500 text-white py-2 mt-2 hover:bg-gray-600 rounded-xl transition w-full cursor-not-allowed" disabled>
                            Lotado
                        </button>
                    ) : active ? (
                        <p className="text-sm mt-1 flex items-center">
                            <img
                                src="/icons/icon-people.svg"
                                alt="Ícone"
                                className="mr-2 w-4 h-4"
                            />
                            <span>{vagasRestantes} / {capacidadeTotal} pessoas</span>
                        </p>
                    ) : (
                        <p className="text-sm mt-1 text-gray-500">Não disponível</p>
                    )}
                </div>

                <div className="flex flex-col items-center space-y-3 text-red-500">
                    <img
                        src="/icons/icon-eye.svg"
                        alt="Visualizar"
                        style={{ width: 18, height: 18 }}
                    />
                    {(usuarioEhAdministrador || usuarioEhTrainer) && (
                        <>
                            {/* Icone de Editar para administradores e treinadores */}
                            <img
                                src="/icons/icon-edit.svg"
                                alt="Editar"
                                style={{ width: 18, height: 18 }}
                                className="cursor-pointer"
                                onClick={() => openModal({ horario, capacidadeTotal, vagasRestantes, id, active, trainerId, studentsLimit })}
                            />
                            {/* Icone de Desativar Horário para administradores ou treinadores */}
                            <img
                                src="/icons/icon-disable.svg"
                                alt="Desativar Horário"
                                title="Desativar Horário"
                                style={{ width: 20, height: 20 }}
                                className="cursor-pointer"
                                onClick={async () => {
                                    try {
                                        await toggleTrainingTimeActive(id);
                                        // Atualiza o estado local para refletir a mudança de ativo/inativo
                                        setVagas((prevVagas) => prevVagas.map((vaga) =>
                                            vaga.id === id ? { ...vaga, active: !vaga.active } : vaga
                                        ));
                                    } catch (error) {
                                        console.error("Erro ao ativar/desativar o horário:", error);
                                    }
                                }}
                            />
                        </>
                    )}
                </div>
            </div>

            {vagasRestantes > 0 && usuarioEhAluno && active && (
                <button
                onClick={() => handleAgendar({ 
                    horario, 
                    capacidadeTotal, 
                    vagasRestantes, 
                    id, 
                    active, 
                    trainerId,   // Certifique-se de que o trainerId está sendo passado aqui corretamente
                    studentsLimit 
                })} 
                className="bg-red-500 text-white py-2 mt-2 hover:bg-red-600 rounded-xl transition w-full"
                >
                    Agendar
                </button>
            )}

        </div>
    );
}

