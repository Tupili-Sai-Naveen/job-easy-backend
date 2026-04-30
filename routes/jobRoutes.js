const express = require("express");
const router = express.Router();
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");

// ✅ GET TODAY COUNT
router.get("/today/count", async (_req, res) => {
  try {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const count = await Job.countDocuments({
      createdAt: { $gte: start }
    });

    res.json({ count });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET ALL JOBS (NO LIMIT 🚀)
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || "";

    const filter = {
      $or: [
        { company: { $regex: search, $options: "i" } },
        { role: { $regex: search, $options: "i" } },
        { location: { $regex: search, $options: "i" } }
      ]
    };

    const jobs = await Job.find(filter).sort({ createdAt: -1 });

    res.json(jobs);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ GET SINGLE JOB
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });

    res.json(job);
  } catch {
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
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ DELETE JOB (ADMIN)
router.delete("/:id", auth, async (req, res) => {
  try {
    await Job.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
