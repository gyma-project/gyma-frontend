import { useEffect, useState } from "react";
import PageTitle from "@/components/atoms/PageTitle";
import {
  getTrainingTimesByDay,
  getTrainingRecordsByTime,
  toggleTrainingTimeActive,
  getTrainingRecordForToday,
  postTrainingRecords,
  deleteTrainingRecords,
} from "@/service/api/training";
import { useSession } from "next-auth/react";

interface TrainingTime {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
  studentsLimit: number;
  trainer?: {
    firstName: string;
    lastName: string;
    imageUrl: string | null;
    keycloakId: string;
  };
  trainingRecordsCount?: number;
  active: boolean;
}

export default function Scheduler() {
  const [trainingTimes, setTrainingTimes] = useState<TrainingTime[]>([]);
  const { data: session } = useSession();
  const [loading, setLoading] = useState(true);

  const userRoles = session?.user?.profile?.roles.map((role: { name: string }) => role.name) || [];
  const studentKeycloakId = session?.user?.profile?.keycloakId;

  const [userTrainingRecords, setUserTrainingRecords] = useState<number[]>([]);

  useEffect(() => {
    const fetchTrainingTimes = async () => {
      try {
        const todayEnum = new Date().toLocaleDateString("en-US", { weekday: "long" }).toUpperCase();
        const response = await getTrainingTimesByDay(todayEnum);

        // @ts-ignore
        const sortedTrainingTimes = response.content?.sort((a, b) => {
          return a.startTime.localeCompare(b.startTime);
        }) || [];

        for (let time of sortedTrainingTimes) {
          const startDate = new Date().toISOString().split("T")[0];
          const endDate = startDate;

          const recordsResponse = await getTrainingRecordsByTime(time.id, startDate, endDate);

          if (recordsResponse?.content) {
            time.trainingRecordsCount = recordsResponse.content.length;
          } else {
            time.trainingRecordsCount = 0;
          }
        }

        setTrainingTimes(sortedTrainingTimes);

        if (studentKeycloakId) {
          const userTraining = await getTrainingRecordForToday(studentKeycloakId);
          if (userTraining?.content?.length > 0) {
            const userTrainingIds = userTraining.content.map((record: any) => record.trainingTimeId);
            setUserTrainingRecords(userTrainingIds);
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

  const formatTime = (timeString: string) => {
    const [hour, minute] = timeString.split(":");
    return `${hour}:${minute}`;
  };

  const handleToggleActive = async (id: number) => {
    try {
      await toggleTrainingTimeActive(id.toString());

      setTrainingTimes((prevTimes) =>
        prevTimes.map((time) =>
          time.id === id ? { ...time, active: !time.active } : time
        )
      );
    } catch (error) {
      console.error("Erro ao alternar o status de ativo", error);
    }
  };

  const handleCancelTraining = async (trainingTimeId: number) => {
    try {
      await deleteTrainingRecords(trainingTimeId);

      const updatedTrainingTimes = trainingTimes.map((time) => {
        if (time.id === trainingTimeId) {
          return {
            ...time,
            trainingRecordsCount: Math.max((time.trainingRecordsCount ?? 0) - 1, 0),
          };
        }
        return time;
      });

      setTrainingTimes(updatedTrainingTimes);
      setUserTrainingRecords((prevRecords) => prevRecords.filter((id) => id !== trainingTimeId));

      alert("Treino cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar o agendamento de treino:", error);
      alert("Ocorreu um erro ao tentar cancelar o treino. Por favor, tente novamente.");
    }
  };

  const handleScheduleTraining = async (trainingTimeId: number, trainerId: string) => {
    if (!studentKeycloakId) {
      alert("Você precisa estar logado como aluno para agendar um treino.");
      return;
    }

    try {
      await postTrainingRecords(studentKeycloakId, trainerId, trainingTimeId);

      const updatedTrainingTimes = trainingTimes.map((time) => {
        if (time.id === trainingTimeId) {
          return {
            ...time,
            trainingRecordsCount: (time.trainingRecordsCount ?? 0) + 1,
          };
        }
        return time;
      });

      setTrainingTimes(updatedTrainingTimes);
      setUserTrainingRecords((prevRecords) => [...prevRecords, trainingTimeId]);

      alert("Treino agendado com sucesso!");
    } catch (error) {
      console.error("Erro ao agendar o treino:", error);
      alert("Ocorreu um erro ao tentar agendar o treino. Por favor, tente novamente.");
    }
  };

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
                  <img
                    src={time.active ? "/icons/icon-people.svg" : "/icons/icon-people-disable.svg"}
                    alt="Ícone de pessoas"
                    className="w-5 h-5 mr-2"
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
                    {userTrainingRecords.includes(time.id) ? (
                      <button
                        onClick={() => handleCancelTraining(time.id)}
                        className="mt-3 w-full py-2 rounded-lg text-sm bg-gray-500 text-white hover:bg-gray-700"
                      >
                        Cancelar Agendamento
                      </button>
                    ) : (
                      <button
                        className={`mt-3 w-full py-2 rounded-lg text-sm ${time.active ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-gray-500 text-gray-300 cursor-not-allowed'}`}
                        disabled={!time.active}
                        onClick={() => handleScheduleTraining(time.id, time.trainer?.keycloakId || "")}
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