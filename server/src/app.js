const express = require("express");
const cors = require("cors");
const suggestionsRouter = require("./routes/suggestions");

// CLIENT_ORIGIN must be set to the deployed Netlify origin in production
// (see PRD section 5). Falls back to the local Vite dev server.
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

const app = express();

app.use(cors({ origin: CLIENT_ORIGIN, methods: ["GET", "POST"] }));
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use(suggestionsRouter);

module.exports = app;
