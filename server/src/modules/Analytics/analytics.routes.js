import express from "express";

import {
    getOverview,
    getProjectStats,
    getMarketplaceStats
}
from "./analytics.controller.js";

const router = express.Router();

router.get(
    "/overview",
    getOverview
);

router.get(
    "/projects",
    getProjectStats
);

router.get(
    "/marketplace",
    getMarketplaceStats
);

export default router;