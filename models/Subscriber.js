const mongoose = require("mongoose");

const subscriberSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  firstName: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("Subscriber", subscriberSchema);