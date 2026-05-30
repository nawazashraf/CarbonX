import express from "express";

import {
    verifyProject,
    getVerifications
}
from "./verification.controller.js";

const router = express.Router();

router.get(
    "/",
    getVerifications
);

router.post(
    "/:projectId",
    verifyProject
);

export default router;