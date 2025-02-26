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
    student: User;
    trainer: User;
    exercises: Exercise[];
    description: string;
    createdAt: string;
    updatedAt: string;
    updateBy: User;
}

// Buscar todas as folhas de treinamento
export const getTrainingSheets = async (page: number = 0, size: number = 10) => {
    try {
        const response = await axiosInstance.get(`/training-sheets`, {
            params: { page, size }
        });
        return response.data;
    } catch (error) {
        console.error("Erro ao buscar folhas de treinamento:", error);
        return null;
    }
};

// Atualizar uma folha de treinamento específica
export const updateTrainingSheet = async (id: number, updatedData: Partial<TrainingSheet>) => {
    try {
        const response = await axiosInstance.put(`/training-sheets/${id}`, updatedData);
        return response.data;
    } catch (error) {
        console.error("Erro ao atualizar folha de treinamento:", error);
        return null;
    }
};

// Deletar uma folha de treinamento específica
export const deleteTrainingSheet = async (id: number) => {
    try {
        await axiosInstance.delete(`/training-sheets/${id}`);
        return true;
    } catch (error) {
        console.error("Erro ao deletar folha de treinamento:", error);
        return false;
    }
};
