import axiosInstance from "@/service/axios";

export interface TrainingData {
  name: string;
  student: string;
  trainer: string; 
  description: string;
  exerciseIds: number[];
  updateBy: string;
}

export const getAllTrainingSheets = async () => {
  try {
    const response = await axiosInstance.get("/training-sheets");

    if (response.status !== 200) {
      throw new Error("Erro ao buscar as fichas de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as fichas de treino:", error);
    throw error;
  }
};

export const createTrainingSheet = async (trainingData: TrainingData) => {
  try {
    const response = await axiosInstance.post("/training-sheets", trainingData);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Erro ao cadastrar a ficha de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao criar a ficha de treino:", error);
    throw error;
  }
};

export const getTrainingSheet = async (id: string) => {
  try {
    const response = await axiosInstance.get(`/training-sheets/${id}`);
    
    if (response.status !== 200) {
      throw new Error("Erro ao buscar a ficha de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar a ficha de treino:", error);
    throw error;
  }
};

export const updateTrainingSheet = async (id: string, trainingData: TrainingData) => {
  try {
    const response = await axiosInstance.put(`/training-sheets/${id}`, trainingData);

    if (response.status !== 200) {
      throw new Error("Erro ao atualizar a ficha de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar a ficha de treino:", error);
    throw error;
  }
};

export const deleteTrainingSheet = async (id: string) => {
  try {
    const response = await axiosInstance.delete(`/training-sheets/${id}`);

    if (response.status !== 200 && response.status !== 204) {
      throw new Error("Erro ao deletar a ficha de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao deletar a ficha de treino:", error);
    throw error;
  }
};

export const getTrainingSheetsByStudent = async (studentKeycloakId: string) => {
  try {
    const response = await axiosInstance.get(`/training-sheets?studentKeycloakId=${studentKeycloakId}`);

    if (response.status !== 200) {
      throw new Error("Erro ao buscar as fichas de treino para o estudante");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar as fichas de treino do estudante:", error);
    throw error;
  }
};

export const getTrainingRecords = async (date: Date) => {
  try {
    const formattedDate = date.toISOString().split("T")[0]; // Formata para YYYY-MM-DD
    const response = await axiosInstance.get(`/training-records?startDate=${formattedDate}&endDate=${formattedDate}`);

    if (response.status !== 200) {
      throw new Error("Erro ao buscar os registros de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os registros de treino:", error);
    throw error;
  }
};


export const postTrainingRecords = async (studentId: string, trainerId: string, trainingTimeId: number) => {
  try {

    const response = await axiosInstance.post(`/training-records`, {
      "trainingTimeId": trainingTimeId,
      "student": studentId,
      "trainer": trainerId,
    });

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Erro ao buscar os registros de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os registros de treino:", error);
    throw error;
  }
};


export const deleteTrainingRecords = async (id: number) => {
  try {

    const response = await axiosInstance.delete(`/training-records/${id}`); 

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os registros de treino:", error);
    throw error;
  }
};


export const getTrainingTimesByDay = async (dayName: string) => {
  try {
      const response = await axiosInstance.get(`/training-times`, {
          params: { dayName, size: 20 }
      });

      if (response.status !== 200) {
          throw new Error("Erro ao buscar os horários de treino");
      }

      return response.data;
  } catch (error) {
      console.error("Erro ao buscar os horários de treino:", error);
      throw error;
  }
};

// Training Records
export const getTrainingRecordsByTime = async (trainingTimeId: number, startDate: string, endDate: string) => {
  try {
    const response = await axiosInstance.get(`/training-records`, {
      params: { trainingTimeId, startDate, endDate, size: 20 }
    });

    if (response.status !== 200) {
      throw new Error("Erro ao buscar os registros de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar os registros de treino:", error);
    throw error;
  }
};

export const updateTrainingTime = async (id: string, trainingTimeData: { active: boolean, trainerId: string, studentsLimit: number, updateBy: string }) => {
  try {
    const response = await axiosInstance.put(`training-times/${id}`, trainingTimeData);

    if (response.status !== 200) {
      throw new Error("Erro ao atualizar o horário de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao atualizar o horário de treino:", error);
    throw error;
  }
};

export const toggleTrainingTimeActive = async (id: string) => {
  try {
    const response = await axiosInstance.post(`/training-times/${id}/toggle-active`);

    if (response.status !== 200) {
      throw new Error("Erro ao ativar/desativar o horário de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao ativar/desativar o horário de treino:", error);
    throw error;
  }
};

export const createTrainingRecord = async (
    trainingRecordData: { 
      trainingTimeId: string;
      studentKeycloakId: string;
      trainerKeycloakId: string;
      date: string;
      updateBy: string 
    }
  ) => {
  try {
    const response = await axiosInstance.post("training-records", trainingRecordData);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Erro ao criar o agendamento de treino");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao criar o agendamento de treino:", error);
    throw error;
  }
};

export const getTrainingRecordForToday = async (studentKeycloakId: string) => {
  try {
    const today = new Date().toISOString().split("T")[0]; // Data formatada para YYYY-MM-DD
    const response = await axiosInstance.get(`/training-records`, {
      params: { studentId: studentKeycloakId, startDate: today, endDate: today }
    });

    if (response.status !== 200) {
      throw new Error("Erro ao buscar o agendamento de treino para hoje");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar o agendamento de treino para hoje:", error);
    throw error;
  }
};
