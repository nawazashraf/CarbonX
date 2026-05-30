import express from "express";

import {
  createListing,
  getListings,
  buyCredits,
  syncListing,
} from "./marketplace.controller.js";

const router = express.Router();

router.post("/list", createListing);

router.get("/", getListings);

router.post("/buy/:listingId", buyCredits);

router.post("/sync", syncListing);

export default router;
