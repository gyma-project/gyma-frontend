import axiosInstance from "@/service/axios";

export interface ProfileData {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  keycloakUserId: string;
  imageUrl: string;
  roleIds: number[];
}

export enum Role {
  STUDENT = "STUDENT",
  TRAINER = "TRAINER",
  ADMIN = "ADMIN",
}

export interface Profile {
  id: string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  keycloakUserId: string;
  imageUrl: string;
  roles: Role[];
}

export const createProfile = async (profileData: ProfileData) => {
  try {
    const response = await axiosInstance.post("/profiles", profileData);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Erro ao cadastrar perfil");
    }

    return response.data;
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};


export const getProfiles = async (role?: Role, username?: string) => {
  try {
    // Definindo os parâmetros corretamente antes da requisição
    const params: { roles?: string; username?: string } = {};
    
    if (role) params.roles = role;
    if (username) params.username = username;

    // Agora chamamos a API com os parâmetros definidos
    const response = await axiosInstance.get("/profiles", { params });

    if (response.status !== 200) {
      throw new Error("Erro ao obter perfis");
    }

    return response.data; // Retorna os perfis filtrados
  } catch (error) {
    console.error("Erro ao buscar perfis:", error);
    return [];
  }
};

export const getProfileByUsername = async (username: string) => {
  try {
    const response = await axiosInstance.get(`/profiles?username=${username}`);

    if (response.status !== 200 && response.status !== 201) {
      throw new Error("Erro ao buscar perfil");
    }

    return response.data.content[0];
  } catch (error) {
    console.error("Erro:", error);
    return [];
  }
};
