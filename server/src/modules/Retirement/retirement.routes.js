import express from "express";

import {
    retireCredits,
    getRetirements,
    getCertificate
}
from "./retirement.controller.js";

const router =
express.Router();

router.post(
    "/retire",
    retireCredits
);

router.get(
    "/:wallet",
    getRetirements
);

router.get(
    "/certificate/:id",
    getCertificate
);

export default router;