import { api } from "./axios";

export const verifyProject = async (
  id: string,
  payload: {
    verifierWallet?: string;
    approvedCredits: number;
    remarks: string;
    txHash?: string;
  }
) => {
  const { data } = await api.post(`/verifications/${id}`, payload);

  return data;
};
