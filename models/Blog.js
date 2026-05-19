const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: {
    type:     String,
    required: true,
  },
  slug: {
    type:     String,
    required: true,
    unique:   true,
  },
  content: {
    type:     String,
    required: true,
  },
  category: {
    type:    String,
    default: "Career Tips",
  },
  tags: {
    type:    [String],
    default: [],
  },
  author: {
    type:    String,
    default: "JobEasy Team",
  },
  coverImage: {
    type:    String,
    default: "",
  },
  published: {
    type:    Boolean,
    default: true,
  },
  views: {
    type:    Number,
    default: 0,
  },
}, { timestamps: true });

module.exports = mongoose.model("Blog", blogSchema);
