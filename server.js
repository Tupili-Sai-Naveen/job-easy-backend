require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");            // ← NEW
const { Server } = require("socket.io"); // ← NEW

const app = express();
const server = http.createServer(app);   // ← NEW (wrap express)

// ── Socket.io setup ──────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: "*",
  }
});

let liveUsers = 0; // just a number in memory, no DB!

io.on("connection", (socket) => {
  liveUsers++;
  io.emit("liveCount", liveUsers);       // tell everyone new count
  console.log(`User joined. Live: ${liveUsers}`);

  socket.on("disconnect", () => {
    liveUsers--;
    io.emit("liveCount", liveUsers);     // tell everyone new count
    console.log(`User left. Live: ${liveUsers}`);
  });
});
// ─────────────────────────────────────────────────────────────────

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/admin-note", require("./routes/adminNoteRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuth"));

app.get("/", (req, res) => res.send("API running"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(process.env.PORT || 5000, () => console.log("Server running"))) // ← server.listen not app.listen
  .catch(err => console.log(err));
