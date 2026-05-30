import { api } from "./axios";

export const createTransaction = async (payload: any) => {
  const { data } = await api.post("/transactions", payload);

  return data;
};

export const getTransactionsByWallet = async (wallet: string) => {
  const { data } = await api.get(`/transactions/wallet/${wallet}`);
  return data;
};

