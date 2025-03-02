import axiosInstance from "@/service/axios";

interface Role {
    id: number;
    name: string;
}

interface Image {
    id: number;
    idObject: string;
    profile: string;
}

interface User {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    keycloakId: string;
    active: boolean;
    roles: Role[];
    image: Image;
}

interface Exercise {
    id: number;
    muscleGroup: string;
    name: string;
    amount: number;
    repetition: number;
}

interface TrainingSheet {
    id: number;
    name: string;
    student: User;
    trainer: User;
    exercises: Exercise[];
    description: string;
    createdAt: string;
    updatedAt: string;
    updatedBy: User;
}

// Função para garantir que a resposta da API seja válida
const validateResponse = (data: any): boolean => {
    return Array.isArray(data);
};

// Buscar todas as folhas de treinamento
export const getTrainingSheets = async (page: number = 0, size: number = 10): Promise<TrainingSheet[]> => {
    try {
        const response = await axiosInstance.get('/training-sheets', {
            params: { page, size }
        });

        // Validação da resposta antes de retornar os dados
        if (!validateResponse(response.data)) {
            throw new Error("Formato de resposta inválido.");
        }

        const exercises = await getExercises();

        if (exercises) {
            return response.data.map((sheet: TrainingSheet) => ({
                ...sheet,
                exercises: exercises
            }));
        }

        return response.data as TrainingSheet[];

    } catch (error) {
        console.error("Erro ao buscar folhas de treinamento:", error);
        throw error;
    }
};

// Buscar todos os exercícios
export const getExercises = async (): Promise<Exercise[] | null> => {
    try {
        const response = await axiosInstance.get('/exercises');

        // Validação da resposta antes de retornar os dados
        if (validateResponse(response.data)) {
            return response.data as Exercise[];
        } else {
            console.error("Formato de resposta inválido.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao buscar os exercícios:", error);
        return null;
    }
};

// Atualizar uma folha de treinamento específica
export const updateTrainingSheet = async (id: number, updatedData: Partial<TrainingSheet>): Promise<TrainingSheet | null> => {
    try {
        const response = await axiosInstance.put(`/training-sheets/${id}`, updatedData);

        // Verificando se a resposta é válida
        if (response.data) {
            return response.data as TrainingSheet;
        } else {
            console.error("Formato de resposta inválido.");
            return null;
        }
    } catch (error) {
        console.error("Erro ao atualizar folha de treinamento:", error);
        return null;
    }
};

// Deletar uma folha de treinamento específica
export const deleteTrainingSheet = async (id: number): Promise<boolean> => {
    try {
        await axiosInstance.delete(`/training-sheets/${id}`);
        return true;
    } catch (error) {
        console.error("Erro ao deletar folha de treinamento:", error);
        return false;
    }
};

// Tipagem dos tipos exportados
export type { TrainingSheet, User, Exercise, Image, Role };
