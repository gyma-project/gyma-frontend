import axios from "axios";
import { getSession } from "next-auth/react"; // Importa getSession

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {

    const session = await getSession();
    console.log("Sessão do NextAuth:", session); 

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

export default axiosInstance;
