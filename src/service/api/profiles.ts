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

