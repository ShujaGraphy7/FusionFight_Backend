// models/User.js

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  walletAddress: { type: String, required: true, unique: true },
  wonMatches: { type: Number, default: 0 },
  lostMatches: { type: Number, default: 0 },
  totalMatches: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 },
  lastTokenUpdate: { type: Number, default: 0 },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
