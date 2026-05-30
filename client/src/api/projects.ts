import { api } from "./axios";

export const getProjects = async () => {
  const { data } = await api.get("/projects");
  return data;
};

export const getProject = async (id: string) => {
  const { data } = await api.get(`/projects/${id}`);
  return data;
};

export const createProject = async (payload: any) => {
  const { data } = await api.post("/projects", payload);
  return data;
};
