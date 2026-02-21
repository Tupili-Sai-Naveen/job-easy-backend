const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

// GET /api/admin-note  – PUBLIC so Jobs page can show it without token
router.get("/", async (_req, res) => {
  try {
    const note = await Note.findOne().sort({ createdAt: -1 });
    res.json(note || { content: "" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/admin-note  – admin only
router.post("/", auth, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ message: "Content is required" });
    // Replace existing note (single note model)
    await Note.deleteMany({});
    const note = await Note.create({ content });
    res.status(201).json(note);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
