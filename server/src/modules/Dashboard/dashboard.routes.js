import express from "express";

import { getDashboard } from "../Dashboard/dashboard.controller.js";

const router = express.Router();

router.get("/:wallet", getDashboard);

export default router;
