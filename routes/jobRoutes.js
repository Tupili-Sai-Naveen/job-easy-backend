const express = require("express");
const router = express.Router();
const Job = require("../models/Job");

router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.json(jobs);
  } catch (err) {
    console.error("Jobs fetch error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/today/count", async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0,0,0,0);
    const count = await Job.countDocuments({ createdAt: { $gte: today } });
    res.json({ count });
  } catch (err) {
    console.error("Jobs count error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
