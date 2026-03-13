const express = require("express");
const router = express.Router();
const axios = require("axios");
const Subscriber = require("../models/Subscriber");

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_API = `https://api.telegram.org/bot${BOT_TOKEN}`;

// ── Telegram webhook — user sends /start to bot ──────────────────
router.post("/webhook", async (req, res) => {
  try {
    const message = req.body.message;
    if (!message) return res.sendStatus(200);

    const chatId = String(message.chat.id);
    const firstName = message.chat.first_name || "Friend";
    const text = message.text || "";

    if (text === "/start") {
      const existing = await Subscriber.findOne({ chatId });

      if (!existing) {
        // New subscriber — save to DB
        await Subscriber.create({ chatId, firstName });

        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: `👋 Hello ${firstName}!\n\n✅ You are now subscribed to JobEasy Alerts!\n\n🔔 You will get a message every time a new job is posted.\n\nGood luck! 🚀\n\n🌐 job-easy-frontend19.vercel.app`,
        });
      } else {
        // Already subscribed
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: chatId,
          text: `✅ You are already subscribed!\n\nWe will notify you when new jobs are posted. 🔔`,
        });
      }
    }

    if (text === "/stop") {
      await Subscriber.deleteOne({ chatId });
      await axios.post(`${TELEGRAM_API}/sendMessage`, {
        chat_id: chatId,
        text: `😢 You have unsubscribed from JobEasy Alerts.\n\nType /start anytime to subscribe again.`,
      });
    }

    res.sendStatus(200);
  } catch (err) {
    console.error("Webhook error:", err.message);
    res.sendStatus(200);
  }
});

// ── Send alert to ALL subscribers (called when job is posted) ────
router.post("/notify", async (req, res) => {
  try {
    const { company, role, location, type, link } = req.body;

    const subscribers = await Subscriber.find();
    if (subscribers.length === 0) {
      return res.json({ message: "No subscribers", sent: 0 });
    }

    const text =
`🔔 New Job Alert!

🏢 Company: ${company}
💼 Role: ${role}
📍 Location: ${location}
🏷️ Type: ${type}

🔗 Apply: ${link || "See website"}

👉 More jobs: job-easy-frontend19.vercel.app`;

    let sent = 0;
    for (const sub of subscribers) {
      try {
        await axios.post(`${TELEGRAM_API}/sendMessage`, {
          chat_id: sub.chatId,
          text,
        });
        sent++;
      } catch (e) {
        console.error(`Failed for ${sub.chatId}`);
      }
    }

    res.json({ message: "Alerts sent!", sent });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Get subscriber count ─────────────────────────────────────────
router.get("/count", async (req, res) => {
  try {
    const count = await Subscriber.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;