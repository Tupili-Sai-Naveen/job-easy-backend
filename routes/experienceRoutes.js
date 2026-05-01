const express    = require("express");
const Experience = require("../models/Experience");
const router     = express.Router();

// ✅ GET ALL
router.get("/", async (req, res) => {
  try {
    const data = await Experience.find().sort({ createdAt: -1 });
    res.json(data);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET SINGLE ← NEW
router.get("/:id", async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ message: "Not found" });
    res.json(exp);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE
router.post("/", async (req, res) => {
  try {
    const exp = new Experience(req.body);
    await exp.save();
    res.json(exp);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ UPDATE
router.put("/:id", async (req, res) => {
  try {
    const updated = await Experience.findByIdAndUpdate(
      req.params.id,
      { experience: req.body.experience },
      { new: true }
    );
    res.json(updated);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE
router.delete("/:id", async (req, res) => {
  try {
    await Experience.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
