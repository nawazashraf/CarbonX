import { api } from "./axios";

export const createTransaction = async (payload: any) => {
  const { data } = await api.post("/transactions", payload);

  return data;
};
