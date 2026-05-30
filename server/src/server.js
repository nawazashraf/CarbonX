import app from "./app.js";
import connectDB from "./config/db.js";

connectDB();

app.get("/health", (req, res) => {
  res.json({
    message: "Server is up and running",
  });
});

app.listen(5000, () => {
  console.log("Server started at Port 3000");
});
