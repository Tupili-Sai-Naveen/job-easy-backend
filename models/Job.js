const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema({
  company: String,
  role: String,
  location: String,
  type: String,
  link: String,
  note: String,
  status: { type: String, default: "approved" }, // default approved for today count
}, { timestamps: true });

module.exports = mongoose.model("Job", jobSchema);