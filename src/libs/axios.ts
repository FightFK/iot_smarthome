import axios from "axios";

const api = axios.create({
  baseURL: "/api/v1", 
  headers: { "Content-Type": "application/json" },
  timeout: 20000, 
});


api.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
