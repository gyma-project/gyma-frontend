import axios from "axios";
import { axiosKeycloak } from "../axios";

interface KeycloakUserData {
    username: string;
    email: string;
    firstName: string;
    lastName: string;
    password: string;
    userType: string;
  }
  
  export const createKeycloakUser = async (userData: KeycloakUserData) => {
    try {
      
      const keycloakUser = {
        enabled: true,
        username: userData.username,
        email: userData.email,
        firstName: userData.firstName,
        lastName: userData.lastName,
        credentials: [
          {
            type: "password",
            value: userData.password,
            temporary: false,
          },
        ],
        emailVerified: true,
        requiredActions: [],
        groups: [],
        realmRoles: [userData.userType],
      };
  
      const response = await axiosKeycloak.post("/users", keycloakUser);
  
      if (response.status !== 201 && response.status !== 200) {
        throw new Error("Erro ao cadastrar usuário no Keycloak");
      }
  
      return response.data; 
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  };

  export const getUUIDbyUsername = async (username: string) => {
    try {
      const response = await axiosKeycloak.get("/users?username=admin&exact=true");
  
      if (response.status !== 201 && response.status !== 200) {
        throw new Error("Erro ao pegar uuid do usuário");
      }
  
      return response.data[0].id; 
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  };
  