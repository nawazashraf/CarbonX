import express from "express";

import projectModule from "./modules/Projects/index.js";
import verificationModule from "./modules/Verification/index.js";
import creditsRoutes from "./modules/Credits/credits.routes.js";
import marketplaceRoutes from "./modules/Marketplace/marketplace.routes.js";
import retirementRoutes from "./modules/Retirement/retirement.routes.js";
import analyticsRoutes from "./modules/Analytics/analytics.routes.js";
import transactionRoutes from "./modules/Transaction/index.js";
import dashboardRoutes from "./modules/Dashboard/dashboard.routes.js";

import cors from "cors";

const app = express();

app.use(express.json());
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin requests (origin is undefined)
      if (!origin || allowedOrigins.includes(origin) || origin.includes(".onrender.com")) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

app.use("/api/projects", projectModule);

app.use("/api/verifications", verificationModule);

app.use("/api/credits", creditsRoutes);

app.use("/api/marketplace", marketplaceRoutes);

app.use("/api/retirements", retirementRoutes);

app.use("/api/analytics", analyticsRoutes);

app.use("/api/transactions", transactionRoutes);

app.use("/api/dashboard", dashboardRoutes);

export default app;
