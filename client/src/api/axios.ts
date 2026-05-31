import axios from "axios";

const getBaseURL = () => {
  // 1. If running in the browser, always use a relative path.
  // This prevents localhost:5000 from getting hardcoded into the compiled client bundle.
  if (typeof window !== "undefined") {
    return "/api";
  }

  // 2. If a specific URL is provided in the environment (e.g. for server-side fetches)
  const envUrl = process.env.NEXT_PUBLIC_API_URL;
  if (envUrl) {
    if (envUrl.endsWith("/api") || envUrl.endsWith("/api/")) {
      return envUrl;
    }
    const cleanUrl = envUrl.replace(/\/$/, "");
    return `${cleanUrl}/api`;
  }

  // 3. Fallback for Server-Side Rendering (SSR) to local Express port
  const port = process.env.PORT || 5000;
  return `http://localhost:${port}/api`;
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
