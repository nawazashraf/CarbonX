import axios from "axios";

const getBaseURL = () => {
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!envUrl) return "http://localhost:5000/api";
  
  if (envUrl.endsWith("/api") || envUrl.endsWith("/api/")) {
    return envUrl;
  }
  
  const cleanUrl = envUrl.replace(/\/$/, "");
  return `${cleanUrl}/api`;
};

export const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
