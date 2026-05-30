import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const marketplaceService = {
  getListings: async () => {
    const res = await axios.get(`${API}/marketplace`);

    return res.data.data;
  },

  getMyListings: async (wallet: string) => {
    const res = await axios.get(`${API}/marketplace/my-listings/${wallet}`);

    return res.data.data;
  },
};
