import { api } from "./axios";

export const verifyProject = async (id: string) => {
  const { data } = await api.put(`/verifications/${id}/verify`);

  return data;
};
