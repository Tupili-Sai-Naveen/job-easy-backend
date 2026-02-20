require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

app.use(cors({
  origin:"*", 
}));
app.use(express.json());

app.use("/api/jobs", require("./routes/jobRoutes"));
app.use("/api/experience", require("./routes/experienceRoutes"));
app.use("/api/ads", require("./routes/adRoutes"));
app.use("/api/admin-note", require("./routes/adminNoteRoutes"));
app.use("/api/admin/auth", require("./routes/adminAuth"));

app.get("/", (req, res) => res.send("API running"));

mongoose.connect(process.env.MONGO_URI)
  .then(() => app.listen(process.env.PORT || 5000, () => console.log("Server running")))
  .catch(err => console.log(err));
