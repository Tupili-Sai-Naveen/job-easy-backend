const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

// GET /api/jobs  – public
router.get("/", async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/jobs/today/count  – public
router.get("/today/count", async (_req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const count = await Job.countDocuments({ createdAt: { $gte: start } });
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// POST /api/jobs  – public (anyone can add)
router.post("/", async (req, res) => {
  try {
    const { company, role, location, type, link, note } = req.body;
    if (!company || !role) {
      return res.status(400).json({ message: "Company and role are required" });
    }
    const job = await Job.create({ company, role, location, type, link, note, status: "approved" });
    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// DELETE /api/jobs/:id  – admin only
router.delete("/:id", auth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
