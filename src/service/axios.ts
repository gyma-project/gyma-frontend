import axios from "axios";
import { getSession, signIn } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8081/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  async (config) => {
    const session = await getSession();
    if (session && session.accessToken) {
      config.headers["Authorization"] = `Bearer ${session.accessToken}`;
    } else {
      window.location.href = "/";
      return Promise.reject("Usuário não autenticado");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await signIn("keycloak", { callbackUrl: window.location.href });
        const newSession = await getSession();
        if (newSession && newSession.accessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newSession.accessToken}`;
          return axiosInstance(originalRequest);
        } else {
          window.location.href = "/";
          return Promise.reject("Falha ao renovar token.");
        }
      } catch (signInError) {
        window.location.href = "/";
        return Promise.reject(signInError);
      }
    }

    return Promise.reject(error);
  },
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
      window.location.href = "/";
      return Promise.reject("Usuário não autenticado");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

axiosKeycloak.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await signIn("keycloak", { callbackUrl: window.location.href });
        const newSession = await getSession();
        if (newSession && newSession.accessToken) {
          originalRequest.headers["Authorization"] = `Bearer ${newSession.accessToken}`;
          return axiosKeycloak(originalRequest);
        } else {
          window.location.href = "/";
          return Promise.reject("Falha ao renovar token.");
        }
      } catch (signInError) {
        window.location.href = "/";
        return Promise.reject(signInError);
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
export { axiosKeycloak };