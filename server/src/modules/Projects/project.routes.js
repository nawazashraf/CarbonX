import express from "express";

import {
    createProject,
    getProjects,
    getProjectById
}
from "./project.controller.js";

import authMiddleware
from "../../middleware/auth.middleware.js";

const router = express.Router();

router.post(
    "/",
    authMiddleware,
    createProject
);

router.get(
    "/",
    getProjects
);

router.get(
    "/:id",
    getProjectById
);

export default router;