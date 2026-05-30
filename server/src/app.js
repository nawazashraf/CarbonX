import express from "express";

import projectModule from "./modules/Projects/index.js";
import verificationModule from "./modules/verification/index.js";
import creditsRoutes from "./modules/Credits/credits.routes.js";

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



app.use(
    "/api/credits",
    creditsRoutes
);

export default app;