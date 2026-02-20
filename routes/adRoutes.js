const express = require("express");
const Ad = require("../models/Ad");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const ads = await Ad.find();
    res.json(ads);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

router.post("/", auth, async (req, res) => {
  try {
    const ad = new Ad(req.body);
    await ad.save();
    res.json(ad);
  } catch (err) {
    res.status(500).json({ message: "Failed to add ad" });
  }
});

router.delete("/:id", auth, async (req, res) => {
  try {
    const ad = await Ad.findById(req.params.id);
    if (!ad) return res.status(404).json({ message: "Ad not found" });

    await ad.deleteOne();
    res.status(200).json({ message: "Ad deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete ad" });
  }
});

module.exports = router;