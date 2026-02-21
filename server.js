require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// ── CORS ──────────────────────────────────────────────────────────────────────
const allowedOrigins = [
  "http://localhost:5173",
  "https://job-easy-frontend19.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // Postman / server-to-server
      if (allowedOrigins.includes(origin)) return callback(null, true);
      if (origin.includes("vercel.app")) return callback(null, true); // preview deploys
      return callback(new Error(`CORS blocked: ${origin}`));
    },
    credentials: true,
  })
);

app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/jobs",        require("./routes/jobRoutes"));
app.use("/api/experience",  require("./routes/experienceRoutes"));
app.use("/api/ads",         require("./routes/adRoutes"));
app.use("/api/admin-note",  require("./routes/adminNoteRoutes"));
app.use("/api/admin/auth",  require("./routes/adminAuth"));

app.get("/", (_req, res) => res.send("API running ✅"));

// ── MongoDB ───────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI) // useNewUrlParser / useUnifiedTopology removed in Mongoose 6+
  .then(() =>
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
  )
  .catch((err) => console.error("MongoDB connection error:", err));
