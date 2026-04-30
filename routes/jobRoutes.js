const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

// ✅ GET ALL JOBS
router.get("/", async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET SINGLE JOB (IMPORTANT 🔥)
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ CREATE JOB
router.post("/", async (req, res) => {
  try {
    const { company, role, location, type, link, note } = req.body;

    if (!company || !role) {
      return res.status(400).json({ message: "Company and role required" });
    }

    const job = await Job.create({
      company,
      role,
      location,
      type,
      link,
      note,
      status: "approved"
    });

    res.status(201).json(job);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE (ADMIN)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
