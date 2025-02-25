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
        username: userData.firstName.toLowerCase() + Math.round(Math.random()*1000),
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
  
      if (response.status !== 201) {
        throw new Error("Erro ao cadastrar usuário no Keycloak");
      }
  
      return response.data; 
    } catch (error) {
      console.error("Erro:", error);
      return null;
    }
  };
  