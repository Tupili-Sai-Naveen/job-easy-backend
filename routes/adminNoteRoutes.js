const express = require("express");
const Note = require("../models/Note");
const auth = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", auth, async (req, res) => {
  const note = await Note.findOne();
  res.json(note);
});

router.post("/", auth, async (req, res) => {
  let note = await Note.findOne();
  if (!note) note = new Note({ content: req.body.content });
  else note.content = req.body.content;
  await note.save();
  res.json(note);
});

module.exports = router;