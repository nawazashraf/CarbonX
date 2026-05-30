import { api } from "./axios";

export const mintCredits = async (projectId: string) => {
  const { data } = await api.post("/credits/mint", {
    projectId,
  });

  return data;
};
