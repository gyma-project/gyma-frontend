import axiosInstance from "@/service/axios";

export interface TrainingData {
  name: string;
  student: string;
  trainer: string; 
  description: string;
  exerciseIds: number[];
  updateBy: string;
}

export const createTrainingSession = async (trainingData: TrainingData) => {
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

export const getTrainingSession = async (id: string) => {
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
  
export const updateTrainingSession = async (id: string, trainingData: TrainingData) => {
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
  
