import { api } from "./axios";

export const dashboardService = {
  async getDashboard(wallet: string) {
    const response = await api.get(`/dashboard/${wallet}`);
    return response.data;
  },
};
