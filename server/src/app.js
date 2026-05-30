import express from "express";

import projectModule
from "./modules/project/index.js";

const app = express();

app.use(express.json());

app.use(
    "/api/projects",
    projectModule
);

export default app;