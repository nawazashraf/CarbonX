import { api } from "./axios";

export const syncListing = async (payload: any) => {
  const { data } = await api.post("/marketplace/sync", payload);

  return data;
};
