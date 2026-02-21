const express = require("express");
const router = express.Router();
const Ad = require("../models/Ad");
const auth = require("../middleware/authMiddleware");

// GET /api/ads  – public
router.get("/", async (_req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/ads  – admin only
router.post("/", auth, async (req, res) => {
  try {
    const { title, image, link } = req.body;
    if (!title || !image || !link)
      return res.status(400).json({ message: "All fields required" });
    const ad = await Ad.create({ title, image, link });
    res.status(201).json(ad);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/ads/:id  – admin only
router.delete("/:id", auth, async (req, res) => {
  try {
    await Ad.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
