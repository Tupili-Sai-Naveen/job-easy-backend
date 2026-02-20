const express = require("express");
const Experience = require("../models/Experience");
const router = express.Router();

router.get("/", async (req, res) => {
  const data = await Experience.find().sort({ createdAt: -1 });
  res.json(data);
});

router.post("/", async (req, res) => {
  const exp = new Experience(req.body);
  await exp.save();
  res.json(exp);
});

router.put("/:id", async (req, res) => {
  const updated = await Experience.findByIdAndUpdate(req.params.id, { experience: req.body.experience }, { new: true });
  res.json(updated);
});

router.delete("/:id", async (req, res) => {
  await Experience.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

module.exports = router;