import { api } from "./axios";

export const listCredits = async (payload: any) => {
  const { data } = await api.post("/marketplace/list", payload);

  return data;
};

export const buyCredits = async (listingId: string) => {
  const { data } = await api.post("/marketplace/buy", {
    listingId,
  });

  return data;
};
