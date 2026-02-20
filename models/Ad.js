const mongoose = require("mongoose");

const adSchema = new mongoose.Schema({
  title: String,
  image: String, 
  link: String,
});

module.exports = mongoose.model("Ad", adSchema);