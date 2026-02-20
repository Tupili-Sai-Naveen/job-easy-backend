// server.js
require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// --------------------- CORS ---------------------
// Allow Vercel frontend + localhost
const allowedOrigins = [
  "http://localhost:5173", // local dev
  "https://job-easy-frontend19.vercel.app" // Vercel frontend
];

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true); // allow Postman or server-to-server
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      return callback(new Error(`CORS blocked for origin ${origin}`));
    }
  },
  credentials: true
}));

// --------------------- Middleware ---------------------
app.use(express.json());

// --------------------- Routes ---------------------
// Make sure your route files exist
app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/admin-note", require("./routes/adminNoteRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuth"));

// Test root route
app.get("/", (req, res) => res.send("API running"));

// --------------------- MongoDB & Server ---------------------
const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.log("MongoDB connection error:", err));
