import { api } from "./axios";

export const mintCredits = async ({
  projectId,
  txHash,
}: {
  projectId: string;
  txHash: string;
}) => {
  const { data } = await api.post("/credits/mint", {
    projectId,
    txHash,
  });

  return data;
};

export const getWalletCredits = async (wallet: string) => {
  const { data } = await api.get(`/credits/wallet/${wallet}`);
  return data;
};


