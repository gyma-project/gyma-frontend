import axiosInstance from "../axios";

export interface Role {
  id: number;
  name: string;
}

export interface Image {
  id: number;
  idObject: string;
  profile: string;
}

export interface User {
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

export interface Time {
  hour: number;
  minute: number;
  second: number;
  nano: number;
}

export interface Trainer extends User {}

export interface Student extends User {}

export interface TrainingTime {
  id: number;
  day: string; // Example: "SUNDAY", "MONDAY"
  startTime: Time;
  endTime: Time;
  studentsLimit: number;
  trainer: Trainer;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  updateBy: User;
}

export interface Appointment {
  id: number;
  trainingTime: TrainingTime;
  student: Student;
  trainer: Trainer;
  createdAt: string;
  updatedAt: string; 
}

export interface AppointmentResponse {
  totalElements: number;
  totalPages: number;
  pageable: {
    paged: boolean;
    pageNumber: number;
    pageSize: number;
    offset: number;
    sort: {
      direction: string;
      nullHandling: string;
      ascending: boolean;
      property: string;
      ignoreCase: boolean;
    }[];
    unpaged: boolean;
  };
  size: number;
  content: Appointment[];
  number: number;
  sort: {
    direction: string;
    nullHandling: string;
    ascending: boolean;
    property: string;
    ignoreCase: boolean;
  }[];
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}

export const getAppointments = async (
  page: number = 0,
  size: number = 10
): Promise<AppointmentResponse> => {
  try {
    const response = await axiosInstance.get("/training-records", {
      params: { page, size }
    });

    // Validação da resposta antes de retornar os dados
    if (!validateResponse(response.data)) {
      throw new Error("Formato de resposta inválido.");
    }

    return response.data as AppointmentResponse;
  } catch (error) {
    console.error("Erro ao buscar compromissos:", error);
    throw error;
  }
};

// Função para validar a resposta antes de processá-la
const validateResponse = (data: any): boolean => {
  return (
    data &&
    typeof data.totalElements === "number" &&
    Array.isArray(data.content)
  );
};

export const getTrainingTimes = async (): Promise<TrainingTime[]> => {
  try {
    const response = await axiosInstance.get("/training-times");
    return response.data;
  } catch (error) {
    console.error("Erro ao buscar horários de treinamento:", error);
    throw error;
  }
};

{/* export const getAppointmentsByTrainingTime = async (
  trainingTimeId: number,
  page: number = 0,
  size: number = 10
): Promise<AppointmentResponse> => {
  try {
    const response = await axiosInstance.get(`/training-records/by-training-time/${trainingTimeId}`, {
      params: { page, size }
    });

    if (!validateResponse(response.data)) {
      throw new Error("Formato de resposta inválido.");
    }

    return response.data as AppointmentResponse;
  } catch (error) {
    console.error("Erro ao buscar compromissos por horário:", error);
    throw error;
  }
};*/}