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
