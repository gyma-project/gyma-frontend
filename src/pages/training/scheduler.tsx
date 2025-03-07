import { useEffect, useState } from "react";
import PageTitle from "@/components/atoms/PageTitle";
import { getTrainingTimesByDay, getTrainingRecordsByTime, toggleTrainingTimeActive, getTrainingRecordForToday } from "@/service/api/training";
import { useSession } from "next-auth/react";

interface TrainingTime {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  studentsLimit: number;
  trainer?: { firstName: string; lastName: string; imageUrl: string | null, keycloakId: string};
  trainingRecordsCount?: number; // Adiciona a contagem de registros
  active: boolean;
}


export default function Scheduler() {
  const [trainingTimes, setTrainingTimes] = useState<TrainingTime[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const userRoles = session?.user?.profile?.roles.map((role: { name: string }) => role.name) || [];
  const [userTrainingRecord, setUserTrainingRecord] = useState<TrainingTime | null>(null);
  const studentKeycloakId = session?.user?.profile?.keycloakId;

  useEffect(() => {
    const fetchTrainingTimes = async () => {
      try {
        const todayEnum = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
        const response = await getTrainingTimesByDay(todayEnum);

        // Ordena os horários de treino pelo horário de início (startTime)
        const sortedTrainingTimes = response.content?.sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
        }) || [];

        // Buscar os registros de treino para cada horário
        for (let time of sortedTrainingTimes) {
          const startDate = new Date().toISOString().split("T")[0]; // Data atual no formato "YYYY-MM-DD"
          const endDate = startDate; // Considerando o mesmo dia para o intervalo

          // Faz a requisição para obter os registros de treino para cada horário
          const recordsResponse = await getTrainingRecordsByTime(time.id, startDate, endDate);
          
          // Verifica se os registros foram recebidos e calcula a quantidade de registros
          if (recordsResponse?.content) {
            time.trainingRecordsCount = recordsResponse.content.length;
          } else {
            time.trainingRecordsCount = 0;
          }
        }

        setTrainingTimes(sortedTrainingTimes); // Atualiza o estado após as requisições

        // Verifica se o usuário tem um agendamento para hoje
        if (studentKeycloakId) {
          const userTraining = await getTrainingRecordForToday(studentKeycloakId);
          if (userTraining?.content?.length > 0) {
            const userTrainingTime = userTraining.content[0]; // Assume que o usuário tem apenas um treino agendado para hoje
            setUserTrainingRecord(userTrainingTime);
          }
        }

      } catch (error) {
        console.error("Erro ao buscar os horários de treino", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingTimes();
  }, [studentKeycloakId]);

  // Função para formatar os horários (de "06:00:00" para "06:00")
  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":");
    return `${hour}:${minute}`;
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleTrainingTimeActive(id.toString());

      // Atualiza o estado para refletir a mudança de "active"
      setTrainingTimes((prevTimes) =>
        prevTimes.map((time) =>
          time.id === id ? { ...time, active: !time.active } : time
        )
      );
    } catch (error) {
      console.error("Erro ao alternar o status de ativo", error);
    }
  };

  const handleCancelTraining = async () => {
    if (!userTrainingRecord) return;
    try {
      // Chamar o API para cancelar o treino do usuário
      // Supondo que exista uma função para isso: cancelTrainingRecord
      // await cancelTrainingRecord(userTrainingRecord.id);

      // Remove o treino do estado
      setUserTrainingRecord(null);
      alert("Treino cancelado com sucesso");
    } catch (error) {
      console.error("Erro ao cancelar o agendamento de treino", error);
    }
  };

  console.log(trainingTimes); // Para debugar o estado final
  console.log(userTrainingRecord);

  return (
     <div className="min-h-screen">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:max-w-7xl lg:px-8">
        <PageTitle>Agendamento</PageTitle>

        {loading ? (
          <p>Carregando...</p>
        ) : trainingTimes.length === 0 ? (
          <p>Nenhum horário de treino disponível para hoje.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {trainingTimes.map((time) => (
              <div key={time.id} className={`p-4 border rounded-lg shadow-md ${time.active ? 'bg-red-50' : 'bg-gray-300'}`}>
                <h3 className={`text-lg font-semibold ${time.active ? 'text-red-600' : 'text-gray-600'}`}>
                  {formatTime(time.startTime)} às {formatTime(time.endTime)}
                </h3>
                <div className={`flex items-center ${time.active ? 'text-red-600' : 'text-gray-500'}`}>
                  {/* Ícone de pessoas ao lado da quantidade de vagas */}
                  <img
                    src={time.active ? "/icons/icon-people.svg" : "/icons/icon-people-disable.svg"} // Caminho para o arquivo SVG
                    alt="Ícone de pessoas"
                    className="w-5 h-5 mr-2" // Ajuste o tamanho conforme necessário
                  />
                  <p className="text-sm">
                    {time.trainingRecordsCount ?? 0} / {time.studentsLimit}
                  </p>
                </div>


                {time.trainer && (
                  <div className={`flex items-center mt-2 ${time.active ? 'text-gray-700' : 'text-gray-400'}`}>
                    <img
                      src={time.active ? "/icons/icon-gym.svg" : "/icons/icon-gym-disable.svg"}
                      alt="Ícone de academia"
                      className="w-5 h-5 mr-2"
                    />
                    <span className="text-sm font-medium">
                      {time.trainer.firstName} {time.trainer.lastName}
                    </span>
                  </div>
                )}

                <div className="relative mt-4 flex flex-col items-end space-y-2">
                  <button className="flex items-center">
                    <img src={time.active ? "/icons/icon-eye.svg" : "/icons/icon-eye-disable.svg"} alt="Visualizar" className="w-6 h-6 hover:opacity-80" />
                  </button>

                    {(userRoles.includes("ADMIN") || userRoles.includes("TRAINER")) && (
                      <>
                        <button className="flex items-center">
                          <img src={time.active ? "/icons/icon-edit.svg" : "/icons/icon-edit-disable.svg"} alt="Editar" className="w-6 h-6 hover:opacity-80" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(time.id)}
                          className="flex items-center"
                        >
                          <img src={time.active ? "/icons/icon-disable.svg" : "/icons/icon-disable-training.svg"} alt="Desativar" className="w-6 h-6 hover:opacity-80" />
                        </button>
                      </>
                    )}
                  </div>

                  {userRoles.includes("STUDENT") && (
                    <>
                      {/* Verifica se o usuário já tem um agendamento para o horário e exibe o botão de cancelamento */}
                      {userTrainingRecord && userTrainingRecord.id === time.id ? (
                        <button
                          onClick={handleCancelTraining}
                          className="mt-3 w-full py-2 rounded-lg text-sm bg-gray-500 text-white hover:bg-gray-700"
                        >
                          Cancelar Agendamento
                        </button>
                      ) : (
                        <button
                          className={`mt-3 w-full py-2 rounded-lg text-sm ${time.active ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                          disabled={!time.active}
                        >
                          Agendar
                        </button>
                      )}
                    </>
                  )}

              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
