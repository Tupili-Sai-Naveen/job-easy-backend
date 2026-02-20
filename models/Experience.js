const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
  company: String,
  experience: String,
}, { timestamps: true });

module.exports = mongoose.model("Experience", experienceSchema);