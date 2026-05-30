import { api } from "./axios";

export const retireCredits = async (payload: {
  creditId: string;
  amount: number;
}) => {
  const { data } = await api.post("/retirements", payload);

  return data;
};
