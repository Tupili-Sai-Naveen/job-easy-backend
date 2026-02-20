require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");

async function createAdmin() {
  await mongoose.connect(process.env.MONGO_URI);

  const existing = await Admin.findOne({ email: "admin@gmail.com" });
  if (existing) return process.exit();

  const hashed = await bcrypt.hash("admin123", 10);
  await Admin.create({ email: "admin@gmail.com", password: hashed });
  console.log("Admin created successfully");
  process.exit();
}

createAdmin();