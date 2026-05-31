import next from "next";
import path from "path";
import { fileURLToPath } from "url";
import app from "./app.js";
import connectDB from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 5000;
const dev = process.env.NODE_ENV !== "production";
const clientDir = path.resolve(__dirname, "../../client");

const nextApp = next({ dev, dir: clientDir });
const handle = nextApp.getRequestHandler();

async function startServer() {
  await connectDB();

  // Wait for Next.js to prepare (compiles client pages in development, loads production build in production)
  await nextApp.prepare();

  app.get("/health", (req, res) => {
    res.json({ message: "Server is up and running" });
  });

  // Next.js handles all client routes (pages, static assets, etc.)
  app.all(/.*/, (req, res) => {
    return handle(req, res);
  });

  app.listen(PORT, () => {
    console.log(`Server started at Port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Failed to start server process:", error);
  process.exit(1);
});
