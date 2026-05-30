import { api } from "./axios";

export const mintCredits = async (payload: { projectId: string; txHash: string }) => {
  const { data } = await api.post("/credits/mint", payload);

  return data;
};

export const getWalletCredits = async (wallet: string) => {
  const { data } = await api.get(`/credits/wallet/${wallet}`);
  return data;
};


