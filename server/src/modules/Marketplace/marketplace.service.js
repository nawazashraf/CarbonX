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

  return Marketplace.create({
    project: data.projectId,

    sellerWallet: project.ownerWallet,

    creditsListed: data.creditsListed,

    pricePerCredit: data.pricePerCredit,
  });
};

export const getListingsService = async () => {
  return Marketplace.find({
    status: "active",
  }).populate("project");
};

export const buyCreditsService = async (listingId) => {
  const listing = await Marketplace.findById(listingId);

  if (!listing) {
    throw new Error("Listing not found");
  }

  listing.status = "sold";

  await listing.save();

  return listing;
};

export const syncListingService = async (data) => {
  return Marketplace.create({
    contractListingId: data.contractListingId,
    transactionHash: data.transactionHash,

    project: data.projectId,

    sellerWallet: data.sellerWallet,

    creditsListed: data.creditsListed,

    pricePerCredit: data.pricePerCredit,

    status: "active",
  });
};
