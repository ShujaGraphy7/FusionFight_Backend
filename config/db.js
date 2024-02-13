// config/db.js
const mongoose = require("mongoose");

function connectDB() {
  mongoose.connect(
    "mongodb+srv://shujaabrar7:EHzrWhg7Jz9phVtQ@fusionwave.ts8ejiz.mongodb.net/fusionFight",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  );
  const db = mongoose.connection;

  db.on("error", console.error.bind(console, "MongoDB connection error:"));
  db.once("open", () => {
    console.log("Connected to MongoDB successfully!");
    // Additional setup or actions after connecting to MongoDB
  });
}

module.exports = connectDB;
