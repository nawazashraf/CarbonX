import express from "express";

import {
  createListing,
  getListings,
  buyCredits,
  syncListing,
  getMyListings
} from "./marketplace.controller.js";

const router = express.Router();

router.post("/list", createListing);

router.get("/", getListings);

router.post("/buy/:listingId", buyCredits);

router.post("/sync", syncListing);

router.get("/my-listings/:wallet", getMyListings);

export default router;
