import { api } from "./axios";

export const verifyProject = async (
  id: string,
  payload: { approvedCredits: number; remarks: string; verifierWallet?: string }
) => {
  const { data } = await api.post(`/verifications/${id}`, payload);

  return data;
};

