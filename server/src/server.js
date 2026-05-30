import app from "./app.js";

app.get("/health", (req, res) => {
  res.json({
    message: "Server is up and running",
  });
});

app.listen(3000, () => {
  console.log("Server started at Port 3000");
});
