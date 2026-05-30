import { api } from "./axios";

export const getOverview = async () => {
  const { data } = await api.get("/analytics/overview");
  return data;
};
