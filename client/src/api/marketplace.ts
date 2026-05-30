import { api } from "./axios";

export const syncListing = async (payload: any) => {
  const { data } = await api.post("/marketplace/sync", payload);

  return data;
};

export const getListings = async () => {
  const { data } = await api.get("/marketplace");
  return data;
};

