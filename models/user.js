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
  referralCode: { type: String, unique: true },
});

// Generate a 6-character referral code
userSchema.pre('save', async function (next) {
  if (!this.referralCode) {
    this.referralCode = await generateUniqueReferralCode();
  }
  next();
});

const User = mongoose.model("User", userSchema);

module.exports = User;

// Generate a random 6-character alphanumeric referral code
async function generateUniqueReferralCode() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let code;
  do {
    code = '';
    for (let i = 0; i < 6; i++) {
      code += characters.charAt(Math.floor(Math.random() * characters.length));
    }
  } while (await User.exists({ referralCode: code }));
  return code;
}