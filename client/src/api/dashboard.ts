import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const dashboardService = {
  async getDashboard(wallet: string) {
    const response = await axios.get(`${API_URL}/dashboard/${wallet}`);

    return response.data;
  },
};
