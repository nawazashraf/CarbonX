import express from "express";

import {
    createListing,
    getListings,
    buyCredits
}
from "./marketplace.controller.js";

const router = express.Router();

router.post(
    "/list",
    createListing
);

router.get(
    "/",
    getListings
);

router.post(
    "/buy/:listingId",
    buyCredits
);

export default router;