import app from "./app.js";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";
import next from "next";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== "production";

// Client directory path (absolute to compile/serve correctly)
const clientDir = path.resolve(__dirname, "../../client");

const nextApp = next({ dev, dir: clientDir });
const nextHandler = nextApp.getRequestHandler();

async function startServer() {
  await connectDB();

  app.get("/health", (req, res) => {
    res.json({
      message: "Server is up and running",
    });
  });

  // Serve frontend in production or if explicitly requested via env variable
  if (process.env.SERVE_FRONTEND === "true" || !dev) {
    console.log("Preparing Next.js frontend...");
    await nextApp.prepare();
    console.log("Next.js frontend prepared.");

    // Hand routing over to Next.js for all non-API paths
    app.all("*", (req, res) => {
      return nextHandler(req, res);
    });
  } else {
    // In development mode (if started standalone)
    app.get("/", (req, res) => {
      res.json({ message: "CarbonX API Server running in standalone dev mode" });
    });
  }

  app.listen(PORT, () => {
    console.log(`Server started at Port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server process:", error);
  process.exit(1);
});
