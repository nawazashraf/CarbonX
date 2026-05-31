import Marketplace from "./marketplace.model.js";
import Project from "../Projects/project.model.js";

export const createListingService = async (data) => {
  const project = await Project.findById(data.projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.availableCredits < data.creditsListed) {
    throw new Error("Insufficient credits");
  }

  project.availableCredits -= data.creditsListed;
  await project.save();

  const listing = await Marketplace.create({
    project: data.projectId,
    sellerWallet: project.ownerWallet,
    creditsListed: data.creditsListed,
    pricePerCredit: data.pricePerCredit,
    status: "active",
  });

  return listing.populate("project");
};

export const syncListingService = async (data) => {
  const project = await Project.findById(data.projectId);

  if (!project) {
    throw new Error("Project not found");
  }

  if (project.availableCredits < data.creditsListed) {
    throw new Error("Insufficient credits");
  }

  project.availableCredits -= data.creditsListed;
  await project.save();

  const listing = await Marketplace.create({
    contractListingId: data.contractListingId,
    transactionHash: data.transactionHash,
    project: data.projectId,
    sellerWallet: data.sellerWallet.toLowerCase(),
    creditsListed: data.creditsListed,
    pricePerCredit: data.pricePerCredit,
    status: "active",
  });

  return listing.populate("project");
};
export const getListingsService = async () => {
  return Marketplace.find({
    status: "active",
  })
    .populate("project")
    .sort({ createdAt: -1 });
};

export const getMyListingsService = async (wallet) => {
  return Marketplace.find({
    sellerWallet: wallet.toLowerCase(),
  })
    .populate("project")
    .sort({ createdAt: -1 });
};

export const buyCreditsService = async (listingId) => {
  const listing = await Marketplace.findById(listingId);

  if (!listing) {
    throw new Error("Listing not found");
  }

  if (listing.status !== "active") {
    throw new Error("Listing is not active");
  }

  listing.status = "sold";

  await listing.save();

  return listing.populate("project");
};
