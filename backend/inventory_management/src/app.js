const express = require("express");
require('dotenv').config();
const cors = require("cors");
const app = express();
app.use(express.json());



app.use(cors());

// ADD THIS ROOT ROUTE - This fixes the "Cannot GET /" error
app.get("/", (req, res) => {
  res.json({
    message: "Backend is running successfully!",
    status: "OK",
    timestamp: new Date().toISOString(),
  });
});

// Your existing routes

// app.use("/api/auth", authRoutes);






module.exports = app;
