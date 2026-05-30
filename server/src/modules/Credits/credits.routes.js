import express from "express";

import {
    mintCredits,
    getProjectCredits,
    getWalletCredits
}
from "./credits.controller.js";

const router =
express.Router();

router.post(
    "/mint",
    mintCredits
);

router.get(
    "/project/:projectId",
    getProjectCredits
);

router.get(
    "/wallet/:wallet",
    getWalletCredits
);

export default router;