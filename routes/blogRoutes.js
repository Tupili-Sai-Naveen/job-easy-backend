const express = require("express");
const router  = express.Router();
const Blog    = require("../models/Blog");

// GET all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Blog.find({ published: true })
      .sort({ createdAt: -1 })
      .select("-content"); // don't send full content in list
    res.json(posts);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// GET single post by slug
router.get("/:slug", async (req, res) => {
  try {
    const post = await Blog.findOne({
      slug:      req.params.slug,
      published: true,
    });
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST create blog (admin only)
router.post("/", async (req, res) => {
  try {
    const { title, content, category, tags, author, coverImage } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: "Title and content required" });
    }

    // Auto generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    // Check duplicate slug
    const exists = await Blog.findOne({ slug });
    if (exists) return res.status(400).json({ message: "Slug already exists" });

    const post = await Blog.create({
      title, slug, content,
      category: category || "Career Tips",
      tags:     tags     || [],
      author:   author   || "JobEasy Team",
      coverImage: coverImage || "",
      published: true,
    });

    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE post
router.delete("/:id", async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
