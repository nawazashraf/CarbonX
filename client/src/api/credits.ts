import { api } from "./axios";

export const mintCredits = async (projectId: string, txHash: string) => {
  const { data } = await api.post("/credits/mint", {
    projectId,
    txHash,
  });

  return data;
};
