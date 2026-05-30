import { api } from "./axios";

export const getListings = async () => {
  const res = await api.get("/marketplace");
  return res.data.data || res.data;
};

export const getMyListings = async (wallet: string) => {
  const res = await api.get(`/marketplace/my-listings/${wallet}`);
  return res.data.data || res.data;
};

export const syncListing = async (payload: {
  projectId: string;
  contractListingId: number;
  transactionHash: string;
  sellerWallet: string;
  creditsListed: number;
  pricePerCredit: number;
}) => {
  const res = await api.post("/marketplace/sync", payload);
  return res.data.data || res.data;
};

export const buyListing = async (listingId: string) => {
  const res = await api.post(`/marketplace/buy/${listingId}`);
  return res.data.data || res.data;
};

export const marketplaceService = {
  getListings,
  getMyListings,
  syncListing,
  buyListing,
};
