const express = require("express");
const Note = require("../models/Note");
const router = express.Router();

// Get note
router.get("/", async (req, res) => {
  try {
    const note = await Note.findOne();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch note" });
  }
});

// Add / update note
router.post("/", async (req, res) => {
  try {
    let note = await Note.findOne();
    if (!note) note = new Note({ content: req.body.content });
    else note.content = req.body.content;
    await note.save();
    res.json(note);
  } catch (err) {
    res.status(500).json({ message: "Failed to add note" });
  }
});

module.exports = router;
