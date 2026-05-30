import express from "express";

import projectModule from "./modules/Projects/index.js";
import verificationModule from "./modules/verification/index.js";
import creditsRoutes from "./modules/Credits/credits.routes.js";
import marketplaceRoutes from "./modules/Marketplace/marketplace.routes.js";
import retirementRoutes from "./modules/Retirement/retirement.routes.js";
import analyticsRoutes from "./modules/Analytics/analytics.routes.js";

import cors from "cors";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

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


app.use(
    "/api/marketplace",
    marketplaceRoutes
);


app.use(
    "/api/retirements",
    retirementRoutes
);


app.use(
    "/api/analytics",
    analyticsRoutes
);


export default app;