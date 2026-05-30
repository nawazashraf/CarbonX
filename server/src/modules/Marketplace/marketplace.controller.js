import {
  createListingService,
  getListingsService,
  buyCreditsService,
} from "./marketplace.service.js";

export const createListing = async (req, res) => {
  try {
    const listing = await createListingService(req.body);

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const getListings = async (req, res) => {
  const listings = await getListingsService();

  res.json({
    success: true,
    data: listings,
  });
};

export const buyCredits = async (req, res) => {
  try {
    const listing = await buyCreditsService(req.params.listingId);

    res.json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const syncListing = async (req, res) => {
  try {
    const listing = await syncListingService(req.body);

    res.status(201).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
