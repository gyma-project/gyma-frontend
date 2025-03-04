import axios from "axios";
import { getSession } from "next-auth/react";


const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});


// Adiciona o token automaticamente antes de cada requisição
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
      config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session && session.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
    } else {
      console.log("Nenhum token encontrado na sessão.");
    }
    return config;
  },
  (error) => {
    console.error("Erro no interceptor:", error);
    return Promise.reject(error);
  }
);




const axiosKeycloak = axios.create({
  baseURL: "http://localhost:8080/admin/realms/gyma",
  headers: {
    "Content-Type": "application/json",
  },
});


axiosKeycloak.interceptors.request.use(
  async (config) => {
    const session = await getSession();


    if (session && session.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
    } else {
      console.log("Nenhum token encontrado na sessão.");
    }


    return config;
  },
  (error) => {
    console.error("Erro no interceptor:", error);
    return Promise.reject(error);
  },
);


export default axiosInstance;
export { axiosKeycloak };