import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export const getListings = async () => {
  const res = await axios.get(`${API}/marketplace`);
  return res.data.data;
};

export const getMyListings = async (wallet: string) => {
  const res = await axios.get(`${API}/marketplace/my-listings/${wallet}`);
  return res.data.data;
};

export const syncListing = async (payload: {
  projectId: string;
  contractListingId: number;
  transactionHash: string;
  sellerWallet: string;
  creditsListed: number;
  pricePerCredit: number;
}) => {
  const res = await axios.post(`${API}/marketplace/sync`, payload);
  return res.data.data;
};

export const buyListing = async (listingId: string) => {
  const res = await axios.post(`${API}/marketplace/buy/${listingId}`);
  return res.data.data;
};

export const marketplaceService = {
  getListings,
  getMyListings,
  syncListing,
  buyListing,
};
