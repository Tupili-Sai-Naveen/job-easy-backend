require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  transports: ["websocket", "polling"]  // allow both
});

let liveUsers = 0;

io.on("connection", (socket) => {
  liveUsers++;
  console.log(`✅ User connected! ID: ${socket.id} | Live now: ${liveUsers}`);
  io.emit("liveCount", liveUsers);

  socket.on("disconnect", (reason) => {
    liveUsers--;
    console.log(`❌ User disconnected! Reason: ${reason} | Live now: ${liveUsers}`);
    io.emit("liveCount", liveUsers);
  });
});

app.use(cors({ origin: "*" }));
app.use(express.json());

// test route to check if socket is working
app.get("/live-count", (req, res) => {
  res.json({ liveUsers });
});

app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/admin-note", require("./routes/adminNoteRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuth"));

app.get("/", (req, res) => res.send("API running"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => server.listen(process.env.PORT || 5000, () => {
    console.log("✅ Server running with Socket.io!");
  }))
  .catch(err => console.log(err));
