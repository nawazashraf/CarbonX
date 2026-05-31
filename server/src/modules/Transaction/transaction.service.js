import Transaction from "./transaction.model.js";
import Marketplace from "../Marketplace/marketplace.model.js";
import Project from "../Projects/project.model.js";

export const createTransaction = async (data) => {
  const { listingId, buyerWallet, txHash, blockNumber } = data;

  const listing = await Marketplace.findById(listingId).populate("project");

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.status !== "active") {
    throw new Error("Listing is not active");
  }

  const transaction = await Transaction.create({
    project: listing.project._id,
    listing: listing._id,
    buyerWallet: buyerWallet.toLowerCase(),
    sellerWallet: listing.sellerWallet,
    creditsPurchased: listing.creditsListed,
    pricePerCredit: listing.pricePerCredit,
    totalPrice: listing.creditsListed * listing.pricePerCredit,
    txHash,
    blockNumber,
    status: "confirmed",
  });

  listing.status = "sold";
  await listing.save();

  return transaction;
};

export const getTransactions = async () => {
  return Transaction.find()
    .populate("project")
    .populate("listing")
    .sort({ createdAt: -1 });
};

export const getTransactionById = async (id) => {
  return Transaction.findById(id).populate("project").populate("listing");
};

export const getTransactionsByWallet = async (wallet) => {
  return Transaction.find({
    $or: [
      { buyerWallet: wallet.toLowerCase() },
      { sellerWallet: wallet.toLowerCase() },
    ],
  })
    .populate("project")
    .populate("listing")
    .sort({ createdAt: -1 });
};
