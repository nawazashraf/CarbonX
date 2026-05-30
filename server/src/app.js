import express from "express";

import projectModule from "./modules/Projects/index.js";

import verificationModule from "./modules/verification/index.js";

const app = express();

app.use(express.json());

app.use(
    "/api/projects",
    projectModule
);



app.use(
    "/api/verifications",
    verificationModule
);

export default app;