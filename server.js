// server.js
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");

const { json, urlencoded } = require("express");

const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const airdropRoutes = require("./routes/airdropRoutes");
require("dotenv").config();
const cors = require("cors");



const app = express();
app.use(helmet());
app.use(json());
app.use(urlencoded());

const PORT = 8888;

// Middleware
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
  })
);

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use("/users", userRoutes);
app.use("/airdrop", airdropRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
