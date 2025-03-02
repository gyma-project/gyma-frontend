import axiosInstance from "@/service/axios";

export interface ExerciseData {
  muscleGroup: string;
  name: string;
  amount: number;
  repetition: number;
}

export interface Exercise {
  id: number;
  muscleGroup: string;
  name: string;
  amount: number;
  repetition: number;
}

export const createExercise = async (exerciseData: ExerciseData) => {
  try {
    const response = await axiosInstance.post("/exercises", exerciseData);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Erro ao cadastrar exercício");
    }

    return response.data;
  } catch (error) {
    console.error("Erro:", error);
    return null;
  }
};

export const getExercises = async (muscleGroup?: string, name?: string) => {
  try {
    const params: { muscleGroup?: string; name?: string } = {};
    
    if (muscleGroup) params.muscleGroup = muscleGroup;
    if (name) params.name = name;

    const response = await axiosInstance.get("/exercises", { params });

    if (response.status !== 200) {
      throw new Error("Erro ao obter exercícios");
    }

    return response.data;
  } catch (error) {
    console.error("Erro ao buscar exercícios:", error);
    return [];
  }
};
