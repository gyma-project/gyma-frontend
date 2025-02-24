import axiosInstance from "../axios";

export interface Role {
    id: number;
    name: string;
}
  
export interface Profile {
    id: number;
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    keycloakId: string;
    active: boolean;
    roles: Role[];
    image: string | null;
}
  
  export const getProfiles = async (role: "ADMIN" | "TRAINER" | "STUDENT"): Promise<Profile[]> => {
    try {
      const response = await axiosInstance.get(`profiles?roles=${role}`);
      if (response.status !== 200) {
        throw new Error(`Erro ao buscar perfis de ${role.toLowerCase()}s`);
      }
      return Array.isArray(response.data.content) ? response.data.content : [];
    } catch (error) {
      console.error("Erro:", error);
      return [];
    }
};
  
  