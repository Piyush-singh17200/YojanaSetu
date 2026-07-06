const express = require("express");
const cors = require("cors");
const schemesRouter = require("./routes/schemes");

const app = express();
const PORT = process.env.PORT || 5000;

// Allow the deployed frontend (Vercel) plus local dev by default.
// Set FRONTEND_URL in Render's environment settings to your Vercel URL.
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(
  cors({
    origin: allowedOrigins.length ? allowedOrigins : "*",
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ status: "ok", service: "YojanaSetu API" });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/schemes", schemesRouter);

app.listen(PORT, () => {
  console.log(`YojanaSetu API running on port ${PORT}`);
});
