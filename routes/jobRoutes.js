const express = require("express");
const Job = require("../models/Job");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const job = new Job({ ...req.body, status: "approved" }); // set approved by default
    await job.save();
    res.json(job);
  } catch (err) {
    res.status(500).json({ message: "Failed to add job" });
  }
});

router.get("/", async (req, res) => {
  const jobs = await Job.find().sort({ createdAt: -1 });
  res.json(jobs);
});

router.get("/today/count", async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const count = await Job.countDocuments({ createdAt: { $gte: today } });
  res.json({ count });
});

router.delete("/:id", auth, async (req, res) => {
  await Job.findByIdAndDelete(req.params.id);
  res.json({ message: "Job deleted" });
});

module.exports = router;