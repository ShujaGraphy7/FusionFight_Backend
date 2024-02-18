// server.js
const express = require("express");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
require("dotenv").config();
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: '*',
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
}));

app.use(bodyParser.json());

// Connect to MongoDB
connectDB();

// Routes
app.use('/users', userRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
