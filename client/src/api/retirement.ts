import { api } from "./axios";

export const retireCredits = async (payload: {
  projectId: string;
  ownerWallet: string;
  creditsRetired: number;
  reason?: string;
  txHash: string;
}) => {
  const { data } = await api.post("/retirements/retire", payload);

  return data;
};

export const getRetirements = async (wallet: string) => {
  const { data } = await api.get(`/retirements/${wallet}`);
  return data;
};

export const getCertificate = async (id: string) => {
  const { data } = await api.get(`/retirements/certificate/${id}`);
  return data;
};

